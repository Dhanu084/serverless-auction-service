import AWS from "aws-sdk";
import commonMiddleware from "../lib/commonMiddleware";
import createError from "http-errors";

const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function getAuction(id) {
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
    throw new createError.InternalServerError(
      `Auction with id ${id} is not found`
    );
  }
  return auction;
}

async function getAuctionById(event, context) {
  console.log(event);
  const { auctionId } = event.pathParameters;
  const auction = await getAuction(auctionId);
  const response = {
    statusCode: auction ? 200 : 404,
    body: auction
      ? JSON.stringify(auction)
      : `Auction with id ${auctionId} is not found`
  };

  return response;
}

export const handler = commonMiddleware(getAuctionById);
