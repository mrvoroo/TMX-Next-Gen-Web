import { makeRouteHandler } from '@keystatic/next/route-handler';
import config from '../../../../../keystatic.config';

const handler = makeRouteHandler({ config });

const notFoundResponse = () => new Response('Not Found', { status: 404 });
const isProd = process.env.NODE_ENV === 'production';

export const GET = isProd ? notFoundResponse : handler.GET;
export const POST = isProd ? notFoundResponse : handler.POST;
