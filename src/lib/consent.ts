'use client';

/**
 * Consent core (client only).
 *
 * Stores the visitor's choice in localStorage under "tmx-cookie-consent".
 * All storage access is wrapped in try/catch: if storage is unavailable
 * (private mode, blocked), the choice is kept in memory for the current page
 * session only and the banner shows again on the next visit.
 *
 * If the stored version differs from CONSENT_VERSION, it counts as "no consent".
 */

import { useSyncExternalStore } from 'react';

export const CONSENT_KEY = 'tmx-cookie-consent';
export const CONSENT_VERSION = 1;
export const OPEN_SETTINGS_EVENT = 'tmx:open-consent-settings';

export interface Consent {
  version: number;
  timestamp: string;
  necessary: true;
  analytics: boolean;
  marketing: boolean;
}

type Listener = () => void;

const listeners = new Set<Listener>();

/** Fallback when localStorage is not usable. */
let memoryRaw: string | null = null;

/** Snapshot cache — useSyncExternalStore needs a stable reference per raw value. */
let cache: { raw: string | null; value: Consent | null } | null = null;

function readRaw(): string | null {
  let stored: string | null = null;
  try {
    stored = window.localStorage.getItem(CONSENT_KEY);
  } catch {
    stored = null;
  }
  return stored ?? memoryRaw;
}

function parse(raw: string | null): Consent | null {
  if (!raw) return null;
  try {
    const data: unknown = JSON.parse(raw);
    if (typeof data !== 'object' || data === null) return null;
    const c = data as Record<string, unknown>;
    if (
      c.version !== CONSENT_VERSION ||
      typeof c.timestamp !== 'string' ||
      typeof c.analytics !== 'boolean' ||
      typeof c.marketing !== 'boolean'
    ) {
      return null;
    }
    return {
      version: CONSENT_VERSION,
      timestamp: c.timestamp,
      necessary: true,
      analytics: c.analytics,
      marketing: c.marketing,
    };
  } catch {
    return null;
  }
}

/** Current valid consent, or null if none / outdated version / unreadable. */
export function getConsent(): Consent | null {
  if (typeof window === 'undefined') return null;
  const raw = readRaw();
  if (cache && cache.raw === raw) return cache.value;
  cache = { raw, value: parse(raw) };
  return cache.value;
}

export function setConsent(choice: { analytics: boolean; marketing: boolean }): void {
  if (typeof window === 'undefined') return;
  const consent: Consent = {
    version: CONSENT_VERSION,
    timestamp: new Date().toISOString(),
    necessary: true,
    analytics: choice.analytics,
    marketing: choice.marketing,
  };
  const raw = JSON.stringify(consent);
  try {
    window.localStorage.setItem(CONSENT_KEY, raw);
    memoryRaw = null;
  } catch {
    memoryRaw = raw;
  }
  listeners.forEach((listener) => listener());
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === CONSENT_KEY || event.key === null) listener();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

/** Reactive consent. null on the server and while no valid choice exists. */
export function useConsent(): Consent | null {
  return useSyncExternalStore(subscribe, getConsent, () => null);
}

/** Asks the banner to open its settings layer (used by the footer). */
export function openConsentSettings(): void {
  window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT));
}
