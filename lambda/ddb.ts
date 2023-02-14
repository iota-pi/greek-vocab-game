import { DocumentClient } from 'aws-sdk/clients/dynamodb';

export const ddb = new DocumentClient({
  apiVersion: '2012-08-10',
  region: 'ap-southeast-2',
});

export default ddb;
