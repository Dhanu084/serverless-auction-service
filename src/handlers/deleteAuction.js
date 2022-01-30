import AWS from "aws-sdk";
import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import httpEventNormalizer from "@middy/http-event-normalizer";
import httpErrorHandler from "@middy/http-error-handler";
import createError from "http-errors";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function deleteAuction(event, context) {
  console.log(event);
  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: {
      id: event.pathParameters.auctionId
    }
  };

  try {
    await dynamodb.delete(params).promise();
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError();
  }

  const response = {
    statusCode: 200 
  };

  return response;
}

export const handler = middy(deleteAuction)
  .use(httpJsonBodyParser())
  .use(httpEventNormalizer())
  .use(httpErrorHandler());
