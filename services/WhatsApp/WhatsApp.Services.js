import axios from "axios";
import whatsAppToken from "./TokenServices.js";
import whatsappServices from "../WhatAppwebhookServices.js";
import { PrismaClient } from "@prisma/client";
// import whatsappEvent from "../../Events/whatsappEvents.js";
const API = "https://graph.facebook.com/v19.0";
const WhatsAppRegistration = {};
const DATA_LOCALIZATION_REGION = "IN";

const prisma = new PrismaClient();
export async function generateWhatsappPin() {
  let pin;
  do {
    pin = Math.floor(100000 + Math.random() * 900000);
  } while (pin % 10 === 0 || Math.floor(pin / 100000) === 0);
  return pin.toString();
}

export const GetPhoneNumberAPI = async (phoneNumberId, accessToken) => {
  try {
    const axiosinstace = axios.create({
      baseURL: API,

      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const response = await axiosinstace.get(`${phoneNumberId}`);
    console.log(`Response Form  ${response?.data}`);
    return { status: response?.status, data: response?.data };
  } catch (error) {
    return { status: error?.response?.status, data: error?.response?.data };
  }
};

export const RegisterWhatsappPhoneNumber = async (accountInfo) => {
  try {
    const axiosInstance = axios?.create({
      baseURL: API,
      headers: { Authorization: `Bearer ${accountInfo.accessToken}` },
    });

    const body = {
      messaging_product: "whatsapp",
      pin: await generateWhatsappPin(),
      // data_localization_region: DATA_LOCALIZATION_REGION,
    };

    const response = await axiosInstance?.post(
      `${accountInfo.phoneNumberId}/register`,
      body
    );
    console.log(body);
    response.data.pin = body?.pin;
    console.log("Registation complete", response?.data);
    return { status: response?.status, data: response?.data };
  } catch (error) {
    return { status: error?.response?.status, data: error?.response?.data };
  }
};

WhatsAppRegistration.OnBoard = async (OnBoardData) => {
  try {
    const tokenresponse = await whatsAppToken?.gettoken(OnBoardData?.code);
    if (tokenresponse?.status === 200) {
      const appIfo = {
        accessToken: tokenresponse?.data?.access_token,
        phoneNumberId: OnBoardData?.phoneNumberId,
        wabaid: OnBoardData?.whatsappBusinessAccountId,
      };
      console.log(appIfo);
      const resgistation = await RegisterWhatsappPhoneNumber(appIfo);
      console.log(resgistation?.data);
      // appIfo.pin = resgistation?.data?.pin;
      const phoneNumberres = await GetPhoneNumberAPI(
        OnBoardData?.phoneNumberId,
        appIfo?.accessToken
      );
      appIfo.rating = phoneNumberres?.data?.quality_rating;
      appIfo.Number = phoneNumberres?.data?.display_phone_number;
      appIfo.Name = phoneNumberres?.data?.verified_name;

      console.log("Lasr  App  info  ", appIfo);
      await prisma?.whatsappBuisness.upsert({
        where: {
          id: appIfo?.wabaid,
        },
        create: {
          id: appIfo?.wabaid,
          phoneNumber: appIfo?.Number,
          phoneNumberId: appIfo?.phoneNumberId,
          verifiedName: appIfo?.Name,
          PIN: appIfo?.pin,
          RATING: appIfo?.rating,
          status: "Connected",
          accessToken: appIfo?.accessToken,
        },
        update: {
          id: appIfo?.wabaid,
          phoneNumber: appIfo?.Number,
          phoneNumberId: appIfo?.phoneNumberId,
          verifiedName: appIfo?.Name,
          PIN: appIfo?.pin,
          RATING: appIfo?.rating,
          status: "Connected",
          accessToken: appIfo?.accessToken,
        },
      });
    }

    whatsappEvent?.emit(
      "subscribe",
      OnBoardData?.whatsappBusinessAccountId,
      tokenresponse?.data?.access_token
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default WhatsAppRegistration;
