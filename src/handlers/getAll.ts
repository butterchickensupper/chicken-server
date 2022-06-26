import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { DynamoDB } from '@aws-sdk/client-dynamodb';

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(event);
    let response: APIGatewayProxyResult;
    try {
        const ddb = new DynamoDB({ endpoint: 'http://ddb_local:8000', region: 'local' });
        const res = await ddb.scan({ TableName: 'SampleTable' });
        response = {
            statusCode: 200,
            body: JSON.stringify(res.Items),
        };
    } catch (err) {
        console.log(err);
        response = {
            statusCode: 500,
            body: JSON.stringify({
                message: 'some error happened',
            }),
        };
    }

    return response;
};
