import { v4 as uuid } from "uuid";
const AWS = require("aws-sdk");

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createAuction(event, context) {
  const { title } = JSON.parse(event.body);
  const auction = {
    id: uuid(),
    title,
    status: "OPEN",
    createdAt: new Date().toISOString(),
  };

  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Item: auction,
  };

  await dynamodb.put(params).promise();
  const response = {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
  return response;
}

export const handler = createAuction;
