const dynamodb = require('aws-sdk/clients/dynamodb');

const tableName = process.env.SAMPLE_TABLE;
const docClient = process.env.IS_OFFLINE === 'true' 
    ? new dynamodb.DocumentClient({ endpoint: 'http://ddb_local:8000' })
    : new dynamodb.DocumentClient();

/**
 * Get all orders for a user
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
        KeyConditionExpression: '#pk = :partitionKey AND begins_with(#sk, :sortKey)',
        ExpressionAttributeNames: {
            '#pk': 'partitionKey',
            '#sk': 'sortKey'
        },
        ExpressionAttributeValues: {
            ':partitionKey': 'dev|user-guid',
            ':sortKey': 'order'
        }
    };
    const data = await docClient.query(params).promise();
    console.info('data', [data]);
    if (!data?.Items) {
        return {
            statusCode: 404,
            body: JSON.stringify({ message: 'failed to get orders'})
        };
    } 
 
    const body = data?.Items.map((item) => {
        const order = JSON.parse(item.objectData);
        return {
            id: order.id,
            items: order.items,
            name: order.name,
            address: order.address,
            date: order.date,
            total: order.total
        };
    });
    const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*", // Allow from anywhere 
            "Access-Control-Allow-Methods": "GET" // Allow only GET request 
        },
        body: JSON.stringify(body)
    };

    // All log statements are written to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
};
