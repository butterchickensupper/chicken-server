const dynamodb = require("aws-sdk/clients/dynamodb");

// const docClient = process.env.AWS_SAM_LOCAL
//   ? new dynamodb.DocumentClient({
//       endpoint: "http://ddb_local:8000",
//       region: "local",
//     })
//   : new dynamodb.DocumentClient();
const docClient = new dynamodb.DocumentClient({
  endpoint: "http://ddb_local:8000",
  region: "local",
});

exports.docClient = docClient;
