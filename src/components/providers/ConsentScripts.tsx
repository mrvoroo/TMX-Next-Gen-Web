'use client';

import { useEffect, useRef } from 'react';
import { useConsent } from '@/lib/consent';
import {
  consentServices,
  type ConsentServiceCategory,
} from '@/config/consent-services';

const CATEGORIES: ConsentServiceCategory[] = ['analytics', 'marketing'];

/**
 * Runs the loaders of the consent service registry — only for granted
 * categories, once per page load. If a category that has loaded services is
 * withdrawn, the page reloads so the running scripts are stopped.
 */
export function ConsentScripts() {
  const consent = useConsent();
  const loaded = useRef<Record<ConsentServiceCategory, boolean>>({
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    for (const category of CATEGORIES) {
      const loaders = consentServices[category];
      const granted = consent?.[category] === true;

      if (granted && !loaded.current[category] && loaders.length > 0) {
        loaded.current[category] = true;
        for (const load of loaders) {
          void Promise.resolve()
            .then(load)
            .catch(() => {
              /* a failing service must never break the site */
            });
        }
      } else if (!granted && loaded.current[category]) {
        window.location.reload();
        return;
      }
    }
  }, [consent]);

  return null;
}
