const dynamodb = require('aws-sdk/clients/dynamodb');

const tableName = process.env.ORDER_TABLE;
const docClient = process.env.IS_OFFLINE === 'true' 
    ? new dynamodb.DocumentClient({ endpoint: 'http://ddb_local:8000' })
    : new dynamodb.DocumentClient();

/**
 * Gets the menu from dynamo
 * 
 * @param {Object} event - Input event to the Lambda function
 * @param {Object} context - Lambda Context runtime methods and attributes
 *
 * @returns {Object} object - Object containing details of the menu
 * 
 */
exports.lambdaHandler = async (event, context) => {
    if (event.httpMethod !== 'GET') {
        throw new Error(`getMenuHandler only accept GET method, you tried: ${event.httpMethod}`);
    }
    // All log statements are written to CloudWatch
    console.info('received:', [event]);

    var params = {
        TableName : tableName,
        Key: { partitionKey: 'dev|menu', sortKey: 'menu' }
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
        headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*", // Allow from anywhere 
            "Access-Control-Allow-Methods": "GET" // Allow only GET request 
        },
        body: data?.Item?.objectData // menu is inserted as a string
    };

    // All log statements are written to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
};
