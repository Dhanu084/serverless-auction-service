import commonMiddleware from "../lib/commonMiddleware";
import { getEndedAuctions } from "../lib/getEndedAuctions";
import { closeAuction } from "../lib/closeAuctions";
import createError from "http-errors";

const processAuctions = async (event, context) => {
  try {
    const auctionsToClose = await getEndedAuctions();
    auctionsToClose.map((auction) => closeAuction(auction));

    // since not triggered by api gateway , anything can be returned
    return { closed: auctionsToClose.length };
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError();
  }
};

export const handler = commonMiddleware(processAuctions);
