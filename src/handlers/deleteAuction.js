import AWS from "aws-sdk";
import commonMiddleware from "../lib/commonMiddleware";
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

export const handler = commonMiddleware(deleteAuction);
