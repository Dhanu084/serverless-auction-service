import AWS from "aws-sdk";
import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import httpEventNormalizer from "@middy/http-event-normalizer";
import httpErrorHandler from "@middy/http-error-handler";
import createError from "http-errors";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAuctions(event, context) {
  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
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
    body: JSON.stringify(auctions),
  };

  return response;
}

export const handler = middy(getAuctions)
  .use(httpJsonBodyParser())
  .use(httpEventNormalizer())
  .use(httpErrorHandler());
