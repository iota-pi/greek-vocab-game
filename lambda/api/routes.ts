import { FastifyPluginCallback } from 'fastify';
import ddb from '../ddb';

const routes: FastifyPluginCallback = (fastify, opts, next) => {
  fastify.get('/', async () => ({ ping: 'pong' }));

  fastify.get('/:account/items', async (request, reply) => {
    const account = (request.params as { account: string }).account;
    const cacheTime = parseInt((request.query as { since: string }).since) || undefined;
    const valid = true;
    if (!valid) {
      reply.code(403);
      return { success: false };
    }
    try {
      const results = await (async () => { })();
      return { success: true, items: results };
    } catch (error) {
      fastify.log.error(error);
      reply.code(404);
      return { success: false };
    }
  });

  next();
}

export default routes;
