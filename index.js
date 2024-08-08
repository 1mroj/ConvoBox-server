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

// Connect to the WebSocket server hosted on Render
const socket = setupSocketIO(app);

cron.schedule("* * * * * *", async () => {
  console.log("Cron job is running...");
  // Additional logic
});

checkmessagequeue();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use("/", router);

app.get("/", (req, res) => {
  res.send("index.js is running");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`HTTP server is listening on port ${PORT}`);
});

export default socket;
