// index.js
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import http from "http";
import { PrismaClient } from "@prisma/client";
import cron from "node-cron";
import cors from "cors";
import setupSocketIO from "./socket.js";
import router from "./Router.js";

import sqsServices from "./services/Aws/Broadcast.queue.js";
import whatsappServices from "./services/WhatAppwebhookServices.js";
import {
  checkmessagequeue,
  findconversation,
  findinitateconverstion,
  updateprice,
} from "./services/Redis/RedisService.js";
import { RegisterWhatsappPhoneNumber } from "./services/WhatsApp/WhatsApp.Services.js";
dotenv.config();

const prisma = new PrismaClient({
  log: ["query"],
});

const app = express();
const server = http.createServer(app);

// const setupSocketIO = require("./socket"); // adjust the path as needed
const io = setupSocketIO(server);

// const sockets = [];

// cron.schedule("* * * * * * ", async () => {
//   // console.log(await io?.fetchSockets());
//   console.log(sockets);
// });

// checkmessagequeue();
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use("/", router);

app.get("/", (req, res) => {
  res.send("index.js ");
});

const conversation = await prisma?.conversations?.findFirst({
  where: {
    conversationId: "93b8f17d-6590-4ffe-9f8e-178b422400d3",
  },
});
// updateprice(conversation, 0.32);

// findorinitateconverstion(conversation);
// findinitateconverstion(conversation);

// const buisness = await prisma?.whatsappBuisness?.findFirst({
//   where: {
//     id: "275986335588625",
//   },
// });
// const templateinfo = await prisma?.templates.findFirst({
//   where: {
//     template_id: "1815577892265351",
//   },
// });

// whatsappServices.sendTemplatemessage(
//   buisness,
//   {
//     reciver: "916381802481",
//     name: "discountmessage",
//     isheader: true,
//     header: {
//       type: "IMAGE",
//       imagelink:
//         "https://images.unsplash.com/photo-1721265250302-c02ea398a73c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw3fHx8ZW58MHx8fHx8",
//     },
//     isbody: true,
//     body: {
//       bodyvariable: ["off50", "ares"],
//     },
//     isfooter: null,
//     footer: null,
//     isbutton: null,
//     buttons: null,
//   },
//   templateinfo
// );

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`HTTP is listening on port ${PORT}`);
});

export default io;
// module.exports = { io };
