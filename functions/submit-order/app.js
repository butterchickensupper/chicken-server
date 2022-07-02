const dynamodb = require('aws-sdk/clients/dynamodb');
const { v4: uuidv4 } = require('uuid');

const tableName = process.env.ORDER_TABLE;
const docClient = process.env.IS_OFFLINE === 'true' 
    ? new dynamodb.DocumentClient({ endpoint: 'http://ddb_local:8000' })
    : new dynamodb.DocumentClient();

/**
 * Submits an order for a user
 * 
 * @param {Object} event - Input event to the Lambda function
 * @param {Object} context - Lambda Context runtime methods and attributes
 *
 * @returns {Object} object - Object containing details of the stock buying transaction
 * 
 */
exports.lambdaHandler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        throw new Error(`submitOrderHandler only accept POST method, you tried: ${event.httpMethod}`);
    }
    // All log statements are written to CloudWatch
    console.info('received:', [event]);

    const timestamp = Date.now();
    var item = {
        partitionKey: 'dev|user-guid',
        sortKey: 'order|guid',
        transactionId: uuidv4(),
        createdAt: timestamp,
        updatedAt: timestamp,
        version: 1,
        objectData: event.body
    };
    var params = {
        TableName : tableName,
        ConditionExpression: 'attribute_not_exists(eventKey)',
        Item: item
    };
    const data = await docClient.put(params).promise();
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
