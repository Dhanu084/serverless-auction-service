import AWS from "aws-sdk";
import createError from "http-errors";
import commonMiddleware from "../lib/commonMiddleware";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAuctions(event, context) {
  console.log(event);
  const { status } = event.queryStringParameters;

  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    IndexName: "statusAndEndDate",
    KeyConditionExpression: "#status = :status",
    ExpressionAttributeValues: {
      ":status": status
    },
    ExpressionAttributeNames: {
      "#status": "status"
    }
  };
  let auctions;
  try {
    const result = await dynamodb.query(params).promise();
    auctions = result.Items;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError();
  }

  const response = {
    statusCode: 200,
    body: JSON.stringify(auctions)
  };

  return response;
}

export const handler = commonMiddleware(getAuctions);
