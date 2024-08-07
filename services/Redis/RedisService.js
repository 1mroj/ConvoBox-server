import getRedisClient from "./redisClient.js"; // Adjust the path accordingly
import { PrismaClient } from "@prisma/client";
import whatsappServices from "../WhatAppwebhookServices.js";

const prisma = new PrismaClient();
const redisClient = getRedisClient();
const redis = {};

// You can remove the direct consumer and publisher client creation if not needed elsewhere
redis.consumer = redisClient;

export async function findinitateconverstion(conversationinfo) {
  try {
    const data = await redisClient?.hGetAll(
      `converstaion:${conversationinfo?.conversationId}`
    );

    if (Object.keys(data).length === 0) {
      const redisconvertstion = await redisClient.hSet(
        `converstaion:${conversationinfo?.conversationId}`,
        {
          socket: JSON?.stringify([]),
          message: JSON?.stringify([]),
          pricing: 0,
        }
      );
      await redisClient.expire(
        `converstaion:${conversationinfo?.conversationId}`,
        86400
      );
      return { redisstatus: 200, data: redisconvertstion };
    } else {
      return { redisstatus: 200, data: data };
    }
  } catch (error) {
    console.log(error);
    return { redisstatus: 500, data: null };
  }
}

export async function findconversation(conversation) {
  try {
    const data = await redisClient?.hGetAll(
      `converstaion:${conversation?.conversationId}`
    );
    console.log(data);
  } catch (error) {
    console.log(error);
  }
}

export async function pushmessagetoconverstion(conversationinfo, updateinfo) {
  try {
    const conversation = await redisClient.hGetAll(
      `converstaion:${conversationinfo?.conversationId}`
    );

    await redisClient.hSet(
      `converstaion:${conversationinfo?.conversationId}`,
      updateinfo
    );
  } catch (error) {
    console.log(error);
  }
}

export async function updateprice(conversationinfo, priceinfo) {
  try {
    const conversation = await redisClient.hGetAll(
      `converstaion:${conversationinfo?.conversationId}`
    );

    if (conversation) {
      await redisClient.hSet(
        `converstaion:${conversationinfo?.conversationId}`,
        {
          pricing: priceinfo,
        }
      );
    }
  } catch (error) {
    console.log(error);
  }
}

export async function pushmessage(message) {
  try {
    console.log(message);
    for (const item of message) {
      await redisClient.lPush("broadcatmessage", JSON?.stringify(item));
    }
  } catch (error) {
    console.log(error);
  }
}

export async function checkmessagequeue() {
  const buisness = await prisma?.whatsappBuisness?.findFirst({
    where: {
      id: "275986335588625",
    },
  });
  try {
    while (true) {
      const data = await redisClient.brPop(
        { isolated: true },
        "broadcatmessage",
        0
      );

      let parseddata = JSON?.parse(data?.element);

      if (parseddata) {
        // await whatsappServices?.sendMessage(buisness, {
        //   message: parseddata["msg"],
        //   reciver: parseddata["(cc)phone"],
        // });
      }
    }
  } catch (error) {
    console.log(error);
  }
}

export default redis;
