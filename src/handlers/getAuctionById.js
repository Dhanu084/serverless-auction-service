import AWS from "aws-sdk";
import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import httpEventNormalizer from "@middy/http-event-normalizer";
import httpErrorHandler from "@middy/http-error-handler";
import createError from "http-errors";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAuctionById(event, context) {
  console.log(event);
  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: {
      id: event.pathParameters.auctionId,
    },
  };
  let auction;
  try {
    const result = await dynamodb.get(params).promise();
    auction = result.Item;
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError();
  }

  const response = {
    statusCode: 200,
    body: JSON.stringify(auction),
  };

  return response;
}

export const handler = middy(getAuctionById)
  .use(httpJsonBodyParser())
  .use(httpEventNormalizer())
  .use(httpErrorHandler());
