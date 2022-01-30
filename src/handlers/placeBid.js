import AWS from "aws-sdk";
import commonMiddleware from "../lib/commonMiddleware";
import createError from "http-errors";
import { getAuction } from "./getAuctionById";
const dynamodb = new AWS.DynamoDB.DocumentClient();

async function placeBid(event, context) {
  console.log(event);
  const { auctionId } = event.pathParameters;
  const { amount } = event.body;
  const currentAuction = await getAuction(auctionId);
  if (!currentAuction) {
    throw new createError.NotFound(`Auction with id ${auctionId} is not found`);
  }
  if (amount <= currentAuction.highestBid.amount) {
    throw new createError.BadRequest(
      "amount is lesser or equal to last placed bid"
    );
  }
  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: {
      id: auctionId
    },
    UpdateExpression: "set highestBid.amount = :amount",
    ExpressionAttributeValues: {
      ":amount": amount
    },
    ReturnValues: "ALL_NEW"
  };

  let updatedAuction;
  try {
    const result = await dynamodb.update(params).promise();
    updatedAuction = result.Attributes;
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError(error);
  }

  const response = {
    statusCode: updatedAuction ? 200 : 404,
    body: updatedAuction
      ? JSON.stringify(updatedAuction)
      : `Auction with id ${auctionId} is not found`
  };

  return response;
}

export const handler = commonMiddleware(placeBid);
