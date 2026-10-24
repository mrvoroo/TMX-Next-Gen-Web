'use client';

import { useEffect, useState } from 'react';

/**
 * true once the page has loaded and the browser is idle (or after `timeout`).
 * Used to mount heavy WebGL scenes AFTER the first paint, so shader
 * compilation never delays the visible text (FCP/LCP). Once reached it stays
 * true for client-side navigations in the same tab.
 */
let reached = false;

export function useIdleReady(timeout = 2000): boolean {
  const [ready, setReady] = useState(() => reached);

  useEffect(() => {
    if (ready) return;
    let idle: number | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const done = () => {
      reached = true;
      setReady(true);
    };
    const schedule = () => {
      if ('requestIdleCallback' in window) idle = window.requestIdleCallback(done, { timeout });
      else timer = setTimeout(done, 300);
    };
    if (document.readyState === 'complete') schedule();
    else window.addEventListener('load', schedule, { once: true });
    return () => {
      window.removeEventListener('load', schedule);
      if (idle !== undefined) window.cancelIdleCallback(idle);
      clearTimeout(timer);
    };
  }, [ready, timeout]);

  return ready;
}
