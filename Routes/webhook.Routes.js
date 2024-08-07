import whatsappServices from "../services/WhatAppwebhookServices.js";
import redisclient, {
  pushmessagetoconverstion,
  findinitateconverstion,
} from "../services/Redis/RedisService.js";
import { Router } from "express";
import io from "../index.js";
import conversationServices from "../services/Conversation/Conversations.js";

import triggerservices from "../services/triggers/Triggers.js";
import getRedisClient from "../services/Redis/redisClient.js";
import dotenv from "dotenv";
dotenv.config();
const FB_WEBHOOK_VERIFY_TOKEN = process.env.FB_WEBHOOK_VERIFY_TOKEN;

// Initialize the router
const Webhookrouter = Router();

const redisClient = getRedisClient();

Webhookrouter.get("/webhooks", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  // Check the mode and token sent are correct
  if (mode === "subscribe" && token === FB_WEBHOOK_VERIFY_TOKEN) {
    // Respond with 200 OK and challenge token from the request
    console.log("Webhook verified successfully!");
    return res.status(200).send(challenge);
  } else {
    // Respond with '403 Forbidden' if verify tokens do not match
    res.sendStatus(403);
  }
});

Webhookrouter.post("/webhooks", async (req, res) => {
  try {
    const { object, entry } = req.body;
    // console.log(JSON.stringify(req.body, null, 2));

    const { field, value } = entry[0].changes[0];
    // console.log(field);
    // console.log(value);
    // console.log(JSON.stringify(value, null, 2));

    // IncomingMessages

    if (field === "messages") {
      if (value?.messages) {
        const { metadata, contacts } = value;
        const buisness = await whatsappServices?.findBuisnessphoneid(metadata);

        // find buisness
        if (buisness?.status === 200) {
          let converstion;
          // find  conversation
          converstion = await conversationServices?.findconversationwithNumbers(
            metadata?.display_phone_number,
            contacts[0]?.wa_id
          );

          if (converstion?.status === 200) {
            const redisconvo = await findinitateconverstion(converstion?.data);

            const { from, id, timestamp, type, text } = value?.messages[0];
            const messgeinfo = {
              from,
              id,
              timestamp,
              type,
              messages: text?.body,
            };

            const redismessages = JSON?.parse(redisconvo?.data?.message);

            const messageFound = redismessages.find((item) => item.id === id);
            if (!messageFound) {
              redismessages?.unshift(JSON?.stringify(messgeinfo));
              let updateinfo = {
                message: JSON?.stringify(redismessages),
              };
              await pushmessagetoconverstion(converstion?.data, updateinfo);
            }

            const onlineuser = await redisClient?.get(
              buisness?.data?.phoneNumber
            );

            // console.log(JSON?.parse(onlineuser));

            JSON?.parse(onlineuser).forEach((user) => {
              // console.log(user);
              io?.to(user?.socketid).emit("incomingmessage", messgeinfo);
            });
            // if (data) {
            //   console.log(data);
            //   io?.to(data?.socketId).emit("incomingmessage", value?.messages[0]);
            // }

            // const messages = await conversationServices?.storemesage(
            //   converstion?.data?.conversationId,
            //   value?.messages[0],
            //   contacts[0]?.wa_id,
            //   "incoming"
            // );

            // triggers
            if (value?.messages[0]?.type === "text") {
              const trigger = await triggerservices.findtrigger(
                buisness?.data?.phoneNumberId,
                value?.messages[0]?.text?.body
              );
              console.log(trigger);

              trigger &&
                triggerservices?.sendtrigger(
                  trigger,
                  contacts[0]?.wa_id,
                  buisness?.data
                );
            }
          } else if (converstion?.status === 404) {
            converstion = await conversationServices?.createconversation(
              metadata?.display_phone_number,
              contacts[0]?.wa_id,
              contacts[0]?.profile?.name
            );
            const messages = await conversationServices?.storemesage(
              converstion?.data?.conversationId,
              value?.messages[0],
              contacts[0]?.wa_id,
              "incoming"
            );
          } else {
          }
        } else {
          return res?.sendStatus(400);
        }
      }
    } else if (field === "message_template_status_update") {
      const templateres = await whatsappServices?.TemplateStatus(value);

      if (templateres?.status === 200) {
        return res?.sendStatus(200);
      } else {
        console.log(templateres);
        return res?.sendStatus(404);
      }
    }

    // if (field === "messages") {
    //   if (value?.statuses?.length === 0) {
    //     return res.sendStatus(200);
    //   }
    //   whatsappServices.handleIncomingMessage({ field, value });
    // }

    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res?.sendStatus(400);
  }
});

export default Webhookrouter;
