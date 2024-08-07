// socket.js
import { Server } from "socket.io";
import whatsappServices from "./services/WhatAppwebhookServices.js";
import { PrismaClient } from "@prisma/client";
import {
  findinitateconverstion,
  pushmessagetoconverstion,
} from "./services/Redis/RedisService.js";
import getRedisClient from "./services/Redis/redisClient.js";

const redisClient = getRedisClient();
const prisma = new PrismaClient();
export default function setupSocketIO(server) {
  const io = new Server(server, {
    cors: {
      allowedHeaders: "*",
      origin: "*",
    },
  });

  // Event listeners
  io.use(async (socket, next) => {
    try {
      const token = JSON?.parse(socket.handshake?.headers?.access_token);
      // console.log("Token received: ", JSON?.parse(token));

      const buisness = await prisma?.whatsappBuisness?.findFirst({
        where: {
          id: token?.id,
        },
      });
      console.log("Business: ", buisness);

      socket.buisness = buisness;
      next();
    } catch (error) {
      console.error("Error in authentication middleware: ", error);
      next(error);
    }
  });

  io.on("connect", async (socket) => {
    console.log("Connected socket ID: ", socket.id);

    if (socket?.buisness) {
      await redisClient?.set(
        socket?.buisness?.phoneNumber,
        JSON?.stringify([{ socketid: socket?.id }])
      );
    } else {
      console.error("No business data associated with socket");
    }

    socket.on("joinroom", (data) => {
      const parseddata = JSON.parse(data);
      socket.join(parseddata.roomid);
      console.log(`${socket.id} is connected to Room`, parseddata.roomid);
    });

    socket.on("sendmessage", async (data) => {
      try {
        const messageinfo = JSON.parse(data);
        const message = await whatsappServices.sendMessage(
          socket?.buisness,
          messageinfo
        );

        const conversation = await findinitateconverstion({
          conversationId: messageinfo?.convoid,
        });
        const messages = JSON?.parse(conversation?.data?.message);
        messages?.unshift(
          JSON?.stringify({
            from: socket?.buisness?.phoneNumber,
            id: message?.data?.messages[0]?.id,
            status: null,
            timestamp: Math.floor(Date.now() / 1000),
            message: messageinfo?.message,
          })
        );
        let updateinfo = {
          message: JSON?.stringify(messages),
        };
        await pushmessagetoconverstion(
          { conversationId: messageinfo?.convoid },
          updateinfo
        );

        //  console.log(message)
      } catch (error) {
        io?.to(socket?.id).emit("error", { message: "something went wrong" });
        // console.error("Error sending message: ", error);
      }
    });

    socket.on("onchange", async (data) => {
      try {
        const user = await prisma.users.findFirst({
          where: {
            user_id: String(data.user),
          },
        });
        console.log(`${user?.name} typing with the socket on ${socket.id}`);
      } catch (error) {
        console.error("Error on change: ", error);
      }
    });

    socket.on("hello", (data) => {
      console.log("Hello received: ", data);
      io.to(socket.id).emit("returnhello", { message: "hello++" });
    });

    socket.on("disconnect", async () => {
      await redisClient?.del(socket?.buisness?.phoneNumber);
      console.log(`Socket ${socket.id} disconnected`);
    });
  });

  io.on("error", (error) => {
    console.error("Socket.io error: ", error);
  });

  return io;
}
