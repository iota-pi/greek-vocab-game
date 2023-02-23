import type { AWSError } from 'aws-sdk';
import type { FastifyPluginCallback } from 'fastify';
import { ddb } from '../ddb';
import type { HighScore } from './types';
import type { GameCategory } from '../../src/types';

const TableName = process.env.SCORES_TABLE_NAME!;
const MAX_RESULTS = 10;

const checkCategory = (category: string) => {
  const categories: Record<GameCategory, true> = {
    nouns: true,
    verbs: true,
  };
  return categories[category as GameCategory] === true;
};

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
        console.info('Item not found, returning empty scores');
        return { success: true, scores: [] };
      }

      const scores: HighScore[] = Object.values(item.scores);
      scores.sort(
        (a, b) => ((b.score - a.score) || (a.time - b.time)),
      );

      console.info(scores);

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
    const { score, time, total } = request.body as Omit<HighScore, 'name'>;

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      console.warn(`Invalid username ${username}`);
      reply.code(400);
      return { success: false, message: 'Invalid username' };
    }
    if (!checkCategory(category)) {
      console.warn(`Invalid category ${category}`);
      reply.code(400);
      return { success: false, message: 'Invalid category' };
    }

    await ddb.put({
      TableName,
      Item: {
        category,
        scores: {},
      },
      ConditionExpression: 'attribute_not_exists(scores)',
    }).promise().catch(error => {
      if ((error as AWSError).code !== 'ConditionalCheckFailedException') {
        throw error;
      }
    });

    console.info('Adding score', { score, time, total, username });

    try {
      const item = await ddb.update({
        TableName,
        Key: { category },
        UpdateExpression: (
          'SET scores.#username = :fullScore'
        ),
        ConditionExpression: (
          'attribute_not_exists(scores.#username) OR '
          + 'scores.#username.score < :score OR '
          + '(scores.#username.score = :score AND scores.#username.#time > :time)'
        ),
        ExpressionAttributeNames: {
          '#username': username,
          '#time': 'time',
        },
        ExpressionAttributeValues: {
          ':fullScore': { score, time, total, name: username },
          ':score': score,
          ':time': time,
        },
        ReturnValues: 'ALL_NEW',
      }).promise().then(
        result => result.Attributes,
      ).catch(error => {
        if ((error as AWSError).code !== 'ConditionalCheckFailedException') {
          throw error;
        }
        return ddb.get({
          TableName,
          Key: { category },
        }).promise().then(result => result.Item);
      });
      if (!item) {
        return { success: true, scores: [] };
      }

      const scores: HighScore[] = Object.values(item.scores);
      scores.sort(
        (a, b) => ((b.score - a.score) || (a.time - b.time)),
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
};

export default routes;
