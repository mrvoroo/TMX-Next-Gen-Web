import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Exclude api, keystatic, _next, _vercel and any path containing a file extension
  matcher: ['/((?!api|keystatic|_next|_vercel|.*\\..*).*)'],
};
