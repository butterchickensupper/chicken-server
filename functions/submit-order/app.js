const dynamodb = require('aws-sdk/clients/dynamodb')
const { v4: uuidv4 } = require('uuid')

const tableName = process.env.ORDER_TABLE
const docClient =
   process.env.IS_OFFLINE === 'true' ? new dynamodb.DocumentClient({ endpoint: 'http://ddb_local:8000' }) : new dynamodb.DocumentClient()

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
      throw new Error(`submitOrderHandler only accept POST method, you tried: ${event.httpMethod}`)
   }
   // All log statements are written to CloudWatch
   console.info('jwt:', [event.headers])
   const body = JSON.parse(event.body)
   const timestamp = Date.now()
   const orderId = uuidv4()
   var item = {
      partitionKey: 'dev|user-guid',
      sortKey: `order|${orderId}`,
      createdAt: timestamp,
      updatedAt: timestamp,
      version: 1,
      objectData: JSON.stringify({
         items: body.items,
         billingInfo: body.billingInfo
      })
   }

   var params = {
      TableName: tableName,
      Item: item
   }
   const data = await docClient.put(params).promise()
   if (data.$response.error) {
      return {
         statusCode: 500,
         body: JSON.stringify({ message: data.$response.error.message })
      }
   }
   const response = {
      statusCode: 200,
      headers: {
         'Access-Control-Allow-Credentials': 'true',
         'Access-Control-Allow-Headers': 'Content-Type,Authorization',
         'Access-Control-Allow-Origin': 'http://localhost:4200',
         'Access-Control-Allow-Methods': 'POST,OPTIONS' // Allow only POST request
      },
      body: JSON.stringify({
         id: orderId,
         items: body.items,
         billingInfo: body.billingInfo,
         createdAt: timestamp,
         updatedAt: timestamp
      })
   }

   // All log statements are written to CloudWatch
   console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`)
   return response
}
