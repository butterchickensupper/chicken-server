const tableName = process.env.SAMPLE_TABLE;
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = process.env.IS_OFFLINE === 'true' 
    ? new dynamodb.DocumentClient({ endpoint: 'http://ddb_local:8000' })
    : new dynamodb.DocumentClient();

/**
 * Gets the current menu
 */
exports.getMenuHandler = async (event) => {
    if (event.httpMethod !== 'GET') {
        throw new Error(`getMenuHandler only accept GET method, you tried: ${event.httpMethod}`);
    }
    // All log statements are written to CloudWatch
    console.info('received:', [event]);

    var params = {
        TableName : tableName,
        Key: { id: 'dev|menu' }
    };
    const data = await docClient.get(params).promise();
    console.info('data', [data]);
    if (!data?.Item?.objectData) {
        return {
            statusCode: 404,
            body: JSON.stringify({ message: 'failed to find menu'})
        };
    } 

    const response = {
        statusCode: 200,
        body: JSON.stringify(data?.Item?.objectData)
    };

    // All log statements are written to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
};