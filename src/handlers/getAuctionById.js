import AWS from "aws-sdk";
import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import httpEventNormalizer from "@middy/http-event-normalizer";
import httpErrorHandler from "@middy/http-error-handler";
import createError from "http-errors";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAuctionById(event, context) {
  console.log(event);
  const id = event.pathParameters.auctionId;
  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: {
      id
    }
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
    statusCode: auction ? 200 : 404,
    body: auction
      ? JSON.stringify(auction)
      : `Auction with id ${id} is not found`
  };

  return response;
}

export const handler = middy(getAuctionById)
  .use(httpJsonBodyParser())
  .use(httpEventNormalizer())
  .use(httpErrorHandler());
