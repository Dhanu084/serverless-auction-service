import AWS from "aws-sdk";
import createError from "http-errors";
import commonMiddleware from "../lib/commonMiddleware";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAuctions(event, context) {
  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME
  };
  let auctions;
  try {
    const result = await dynamodb.scan(params).promise();
    auctions = result.Items;
  } catch (error) {
    throw new createError.InternalServerError();
  }

  const response = {
    statusCode: 200,
    body: JSON.stringify(auctions)
  };

  return response;
}

export const handler = commonMiddleware(getAuctions);
