import { DynamoDB } from '@aws-sdk/client-dynamodb';

export const docClient = new DynamoDB({ endpoint: 'http://ddb_local:8000', region: 'local' });
