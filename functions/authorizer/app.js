
var admin = require("firebase-admin");

var serviceAccount = require("serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


exports.lambdaHandler = async (event) => {
  try {
    // If an authenticated request is made to JWT
    // Which we expect is what will happen
    // So we simply return the claims
    const { jwt } = event.requestContext.authorizer;

    admin.auth().verifyIdToken('token').then((decodedToken) => {
      const uid = decodedToken.uid;
      console.log(uid);

      return {
        statusCode: 200,
        body: JSON.stringify({ jwt: jwt }),
      };
    })
  } catch (err) {
    console.error(err);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Please check logs" }),
    };
  }
};