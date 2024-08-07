import axios, { Axios } from "axios";
import dotenv from "dotenv";
dotenv?.config();
const FB_APP_ID = process?.env?.FB_APP_ID;
const FB_SECERET = process?.env?.FB_SECERET;
const whatsAppToken = {};
const BaseUrl = "https://graph.facebook.com/v19.0";

whatsAppToken.gettoken = async (code) => {
  try {
    const axiosInstance = axios?.create({
      baseURL: BaseUrl,
    });
    const response = await axiosInstance?.get(
      `/oauth/access_token?client_id=${FB_APP_ID}&client_secret=${FB_SECERET}&code=${code}`
    );
    console?.log(response?.data);
    return { status: response.status, data: response.data };
  } catch (error) {
    return { status: error.response.status, data: error.response.data };
  }
};

export default whatsAppToken;
