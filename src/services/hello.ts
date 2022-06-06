import { APIGatewayProxyEvent } from "aws-lambda";

export async function handler(event: APIGatewayProxyEvent) {
  console.log("Event: ", event);
  const responseMessage = "Hello, World!";
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: responseMessage,
    }),
  };
}

export async function get(event: APIGatewayProxyEvent) {
  console.log("Event: ", event);
  const responseMessage = "Get World!";
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: responseMessage,
    }),
  };
}
