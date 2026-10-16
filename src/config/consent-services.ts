/**
 * Consent service registry.
 *
 * Each entry is a loader function that injects/initialises one third-party
 * service. <ConsentScripts /> runs the loaders of a category only after the
 * visitor granted that category, and only once per page load.
 *
 * EMPTY on purpose: no analytics or marketing service is active.
 * Before adding a service here, update the consent banner texts and the
 * privacy policy (lawyer review required).
 */

export type ConsentLoader = () => void | Promise<void>;

export type ConsentServiceCategory = 'analytics' | 'marketing';

export const consentServices: Record<ConsentServiceCategory, ConsentLoader[]> = {
  analytics: [],
  marketing: [],
};
