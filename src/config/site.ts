export const SITE_INDEXABLE = false; // set true only at official launch

// Public origin, no trailing slash. Override via NEXT_PUBLIC_SITE_URL.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tmx1.netlify.app';
