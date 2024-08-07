// const prisma = require("../services/Prisma/Prisma");
import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import getRedisClient from "../services/Redis/redisClient.js";
const prisma = new PrismaClient();

const redisClinent = getRedisClient();
// const chatRoutes = require("express").Router();
const chatRoutes = Router();

chatRoutes.post("/getConversations", async (req, res) => {
  try {
    const { wabaphone } = req?.body;
    const result = await prisma.$queryRaw`
      WITH RecentMessages AS (
        SELECT
          m."conversationId",
          m."messageId",
          m."senderId",
          m."message",
          m."timestamp",
          m."messageType",
          m."messageEvent",
          m."createdAt",
          m."updatedAt",
          ROW_NUMBER() OVER (PARTITION BY m."conversationId" ORDER BY m."createdAt" DESC) AS rn
        FROM
          messages m
      )
      SELECT
        c."conversationId",
        c."buisnessNumber",
        c."PhoneNumber",
        c."conversationName",
        rm."messageId",
        rm."senderId",
        rm."message",
        rm."timestamp",
        rm."messageType",
        rm."messageEvent",
        rm."createdAt",
        rm."updatedAt"
      FROM
        conversations c
      JOIN
        RecentMessages rm ON c."conversationId" = rm."conversationId"
      WHERE
        rm.rn = 1
        AND c."buisnessNumber" = ${wabaphone}
      ORDER BY
        rm."createdAt" DESC;
    `;

    return res.status(200).json({
      conversations: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

chatRoutes?.post("/getmessages/:id", async (req, res) => {
  try {
    // const messages = await
    console.log(req?.params?.id);
    const redismessages = await redisClinent?.GetAll(
      `conversation:${req?.params?.id}`
    );
    console.log(redismessages);
    if (redismessages) {
      return res?.status(200).json({
        conversations: redismessages,
      });
    }
    const messages = await prisma?.messages?.findMany({
      where: {
        conversationId: req?.body?.id,
      },
      take: 10,
    });
    return res?.status(200).json({
      conversations: messages,
    });
  } catch (error) {
    console.log(error);
  }
});

export default chatRoutes;
