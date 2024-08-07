import { PrismaClient } from "@prisma/client";
import axios, { Axios } from "axios";

import io from "../index.js";
import TemplateUtilty from "../utility/templateUtility.js";
import messageUtility from "../utility/messageUtility.js";

// const io = require("../index");

const whatsappServices = {};
let version = "v19.0";

const axiosinstace = new Axios({
  baseURL: "https://graph.facebook.com/v19.0/",
  headers: {
    "Content-Type": "application/json",
    Authorization:
      "Bearer EAAPbr2pJ7WUBO9XFLMjMMpUZBcwr8oBiZBykzTcA1ZCZCHhX50ls2KVhD0LbkldAWpvoRwLGC7gGW75lguNQIwTZAwVnvMl4QkUN9DPuOfg479eSMnFmFLHWUY73I5Ynx9ZC4dqlRnawDBeAtBj0UkIDyUNotlSm8mtTNzgqQ0FXcLFxLI34QWNGskGG5azZAcCEehWNDU4fu9iaQUTZCV9h",
  },
});

const prisma = new PrismaClient();
whatsappServices.handleIncomingMessage = async ({ field, value }) => {
  try {
    const { messaging_product, metadata, contacts, messages, statuses } = value;

    console.log(messages[0]);
    // const  socket = statuses?.find((item)=>item?.wabaid ===  )
    const Accountinfo = {
      wabaid: "275986335588625",
      phoneNumberId: "268715066317890",
      display_phone_number: "15550717907",
    };

    const socket = sockets?.find(
      (item) => item?.wabaid === Accountinfo?.wabaid
    );
    console.log("Socket", socket);
    if (socket) {
      console.log("event  is  going to emitted");
      io.to(socket?.socketId).emit("incomingmessage", {
        message: messages[0]?.text?.body,
      });
      console.log("event is emitted");
    }
    if (messages[0]?.type === "text") {
      const message = await prisma.messages.create({
        data: {
          messageid: messages[0]?.id,
          from: messages[0]?.from,
          to: metadata?.display_phone_number,
          message: messages[0]?.text?.body,
          messagetype: messages[0]?.type,
          messageenvent: "incomming",
          timestamp: messages[0]?.timestamp,
        },
      });
      console.log("message is  saved to  the  db..");
      console.log(message);
    } else {
      console.log("Unidentified format ");
    }

    // if (!statuses) {
    //   const { from, id, timestamp, type, text } = messages[0];
    // }
    // console.log(io);
    // console.log(socketService.connectedSockets.get(contacts[0].wa_id));
    //  socketService.Handlereplay(contacts[0].wa_id);

    // Notice;
    // data = {
    //   field: "messages",
    //   value: {
    //     messaging_product: "whatsapp",
    //     metadata: {
    //       display_phone_number: "16505551111",
    //       phone_number_id: "123456123",
    //     },
    //     contacts: [
    //       {
    //         profile: {
    //           name: "test user name",
    //         },
    //         wa_id: "16315551181",
    //       },
    //     ],
    //     messages: [
    //       {
    //         from: "16315551181",
    //         id: "ABGGFlA5Fpa",
    //         timestamp: "1504902988",
    //         type: "text",
    //         text: {
    //           body: "this is a text message",
    //         },
    //       },
    //     ],
    //   },
    // };

    // await prisma.message.create({
    //   data: {},
    // });

    prisma.return;
  } catch (error) {
    console.log(error);
  }
};

whatsappServices.Register = (signUpInfo, UserInfo) => {
  try {
    console.log("-".repeat(process?.stdout?.columns));
    console.log(signUpInfo);
    console.log("-".repeat(process?.stdout?.columns));
    console.log(UserInfo);
  } catch (error) {
    console.log(error);
  }
};

whatsappServices.findBuisnessphoneid = async (buisnessInfo) => {
  try {
    const info = await prisma?.whatsappBuisness?.findFirst({
      where: {
        phoneNumberId: buisnessInfo?.phone_number_id,
      },
    });
    if (info) {
      return { status: 200, data: info };
    } else {
      return { status: 404, data: null };
    }
  } catch (error) {
    console.log(error);
    return { status: 500, data: null };
  }
};

whatsappServices.TemplateStatus = async (templateinfo) => {
  try {
    console.log(templateinfo);
    const {
      event,
      message_template_id,
      message_template_name,
      message_template_language,
      reason,
    } = templateinfo;
    const updateData = {
      status: event,
      name: String(message_template_name),
      language: String(message_template_language),
      rejected_reason: reason,
    };
    const template = await prisma?.templates?.update({
      where: {
        template_id: String(message_template_id),
      },
      data: updateData,
    });
    return { status: 200, message: template };
  } catch (err) {
    return { status: 500, message: err?.message };
  }
};

whatsappServices.sendMessage = async (whatsappBuisness, messageinformation) => {
  try {
    // Validate whatsappBusiness object
    if (!whatsappBuisness?.phoneNumberId || !whatsappBuisness?.accessToken) {
      throw new Error("Invalid whatsappBusiness object");
    }

    // Validate messageInfo object
    if (
      !messageinformation ||
      !messageinformation.reciver ||
      !messageinformation.message
    ) {
      throw new Error("Invalid messageInfo object");
    }

    // Construct the message body
    const messageBody = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: `${messageinformation.reciver}`,
      type: "text",
      text: {
        preview_url: false,
        body: `${messageinformation.message}`,
      },
    };
    console.log(messageBody);

    // Construct the URL
    const url = `https://graph.facebook.com/${version}/${whatsappBuisness?.phoneNumberId}/messages`;

    // Set the headers
    const headers = {
      Authorization: `Bearer ${whatsappBuisness?.accessToken}`,
      "Content-Type": "application/json",
    };

    // Send the request
    const res = await axios.post(url, messageBody, {
      headers,
    });

    // // Log the response
    console.log("Response:", res.data);
    if (res?.status === 200) {
      return { status: 200, data: res?.data };
    }
  } catch (error) {
    // Log the error
    console.log(error?.response);
    return { status: 500, data: null };
  }
};

whatsappServices.sendTemplatemessage = async (
  whatsappBuisness,
  messageinfo,
  templainfo
) => {
  try {
    const url = `https://graph.facebook.com/${version}/${whatsappBuisness?.phoneNumberId}/messages`;
    // Set the headers
    const headers = {
      Authorization: `Bearer ${whatsappBuisness?.accessToken}`,
      "Content-Type": "application/json",
    };
    const messageBody = TemplateUtilty?.templateBody(templainfo, messageinfo);
    console.log(JSON?.stringify(messageBody, null, 2));
    const res = await axios.post(url, messageBody, {
      headers,
    });
    console.log(res);
  } catch (error) {
    console.log(error?.response?.data);
  }
};

export default whatsappServices;
