import { FastifyPluginCallback } from 'fastify';
import ddb from '../ddb';
import { HighScore } from './types';

const TableName = process.env.SCORES_TABLE_NAME!;
const MAX_RESULTS = 20;

const routes: FastifyPluginCallback = (fastify, opts, next) => {
  fastify.get('/', async () => ({ ping: 'pong' }));

  fastify.get('/scores/:category', async (request, reply) => {
    const category = (request.params as { category: string }).category;

    try {
      const result = await ddb.get({
        TableName,
        Key: { category },
      }).promise();
      const item = result.Item;
      if (!item) {
        return { success: true, scores: [] };
      }

      const scores: [string, HighScore][] = Object.entries(item.scores);
      scores.sort(
        (a, b) => (
          (b[1].score - a[1].score)
          || (a[1].time - b[1].time)
        ),
      );

      return {
        success: true,
        scores: scores.slice(0, MAX_RESULTS),
      };
    } catch (error) {
      fastify.log.error(error);
      reply.code(404);
      return { success: false };
    }
  });

  fastify.put('/scores/:category/:username', async (request, reply) => {
    const { category, username } = request.params as { category: string, username: string };
    const { score, time } = request.body as HighScore;

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      reply.code(400);
      return { success: false };
    }

    try {
      const result = await ddb.update({
        TableName,
        Key: { category },
        UpdateExpression: (
          'SET scores.#username = :fullScore'
        ),
        ConditionExpression: (
          'scores.#username.score < :score OR '
          + '(scores.#username.score = :score AND scores.#username.time > :time)'
        ),
        ExpressionAttributeNames: {
          '#username': username,
        },
        ExpressionAttributeValues: {
          ':fullScore': { score, time },
          ':score': score,
          ':time': time,
        },
        ReturnValues: 'ALL_NEW',
      }).promise();
      const item = result.Attributes;
      if (!item) {
        return { success: true, scores: [] };
      }

      const scores: [string, HighScore][] = Object.entries(item.scores);
      scores.sort(
        (a, b) => (
          (b[1].score - a[1].score)
          || (a[1].time - b[1].time)
        ),
      );

      return {
        success: true,
        scores: scores.slice(0, MAX_RESULTS),
      };
    } catch (error) {
      fastify.log.error(error);
      reply.code(404);
      return { success: false };
    }
  });

  next();
}

export default routes;
