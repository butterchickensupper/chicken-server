var admin = require('firebase-admin')
var serviceAccount = require('serviceAccount.json')

admin.initializeApp({
   credential: admin.credential.cert(serviceAccount)
})

exports.lambdaHandler = async (event, context, callback) => {
   try {
      const { jwt } = event.requestContext.authorizer

      admin
         .auth()
         .verifyIdToken(jwt)
         .then((decodedToken) => {
            const uid = decodedToken.uid
            console.log(uid)

            const allow = {
               principalId: 'user',
               policyDocument: {
                  Version: '2012-10-17',
                  Statement: [
                     {
                        Action: 'execute-api:Invoke',
                        Effect: 'Allow',
                        Resource: process.env.RESOURCE
                     }
                  ]
               }
            }
            callback(null, allow)
         })
   } catch (err) {
      console.error(err)
      callback('Unauthorized')
   }
}
