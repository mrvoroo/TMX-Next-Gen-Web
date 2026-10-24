import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Exclude api, keystatic, demo (concept sites, own root layout), _next, _vercel and files
  matcher: ['/((?!api|keystatic|demo|_next|_vercel|.*\\..*).*)'],
};
