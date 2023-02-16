import awsLambdaFastify from '@fastify/aws-lambda';
import createServer from './api';

const proxy = awsLambdaFastify(createServer());
export {
  proxy as handler,
};
