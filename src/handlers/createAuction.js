import { v4 as uuid } from "uuid";
import AWS from "aws-sdk";
import commonMiddleware from "../lib/commonMiddleware";
import createError from "http-errors";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createAuction(event, context) {
  const { title } = event.body;
  const now = new Date();
  const endDate = new Date();
  endDate.setHours(now.getHours() + 1);
  const auction = {
    id: uuid(),
    title,
    status: "OPEN",
    createdAt: now.toISOString(),
    endingAt: endDate.toISOString(),
    highestBid: {
      amount: 0
    }
  };

  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Item: auction
  };

  try {
    await dynamodb.put(params).promise();
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError(error);
  }
  const response = {
    statusCode: 201,
    body: JSON.stringify(auction)
  };
  return response;
}

export const handler = commonMiddleware(createAuction);
