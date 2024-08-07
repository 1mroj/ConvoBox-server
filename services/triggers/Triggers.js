import { PrismaClient } from "@prisma/client";
import axios from "axios";
const triggerservices = {};
const prisma = new PrismaClient();
triggerservices.findtrigger = async (phonenumberid, text) => {
  try {
    const trigger = await prisma.triggers.findFirst({
      where: {
        phonenumberid: phonenumberid,
        triggerword: text,
      },
    });
    console.log(trigger);
    return trigger;
  } catch (error) {
    console.log(error);
  }
};

triggerservices.sendtrigger = async (trigger, reciver, buisness) => {
  try {
    const api = `https://graph.facebook.com/v19.0/${buisness?.phoneNumberId}/messages`;
    console.log(typeof trigger?.replay);
    const { data } = await axios.post(
      api,
      JSON?.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: reciver,
        type: "text",
        text: {
          preview_url: false,
          body: trigger?.replay,
        },
      }),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${buisness?.accessToken}`,
        },
      }
    );
  } catch (error) {
    console.log(error?.response?.data?.error);
  }
};
export default triggerservices;
