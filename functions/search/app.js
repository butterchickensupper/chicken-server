const dynamodb = require('aws-sdk/clients/dynamodb')

const tableName = process.env.ORDER_TABLE
const docClient =
   process.env.IS_OFFLINE === 'true' ? new dynamodb.DocumentClient({ endpoint: 'http://ddb_local:8000' }) : new dynamodb.DocumentClient()

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
   if (event.httpMethod !== 'POST') {
      throw new Error(`searchOrderHandler only accept GET method, you tried: ${event.httpMethod}`)
   }
   // All log statements are written to CloudWatch
   console.info('jwt:', [event.headers])
   const requestBody = JSON.parse(event.body) // get dates from here
   if (!requestBody.startDate) {
      return {
         statusCode: 500,
         body: JSON.stringify({ message: 'failed to find date to search by' })
      }
   }

   var params = {
      TableName: tableName,
      KeyConditionExpression: '#pk = :partitionKey AND begins_with(#sk, :sortKey)',
      ExpressionAttributeNames: {
         '#pk': 'partitionKey',
         '#sk': 'sortKey'
      },
      ExpressionAttributeValues: {
         ':partitionKey': 'dev|user-guid',
         ':sortKey': 'order'
      }
   }
   const data = await docClient.query(params).promise()
   console.info('data', [data])
   if (!data?.Items) {
      return {
         statusCode: 404,
         body: JSON.stringify({ message: 'failed to search orders' })
      }
   }

   const body = data?.Items.map((item) => {
      const order = JSON.parse(item.objectData)
      const orderId = item.sortKey.split('|')[1]
      return {
         id: orderId,
         items: order.items,
         billingInfo: order.billingInfo,
         createdAt: new Date(item.createdAt),
         updatedAt: new Date(item.updatedAt)
      }
   })
   const response = {
      statusCode: 200,
      headers: {
         'Access-Control-Allow-Credentials': 'true',
         'Access-Control-Allow-Headers': 'Content-Type,Authorization',
         'Access-Control-Allow-Origin': 'http://localhost:4200',
         'Access-Control-Allow-Methods': 'POST,OPTIONS' // Allow only POST request
      },
      body: JSON.stringify(body.sort((a, b) => b.createdAt - a.createdAt))
   }

   // All log statements are written to CloudWatch
   console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`)
   return response
}
