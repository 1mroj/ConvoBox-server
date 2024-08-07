import axios from "axios";
import fs from "fs";
import { PrismaClient } from "@prisma/client";
import TemplateUtilty from "../utility/templateUtility.js";
import { type } from "os";
const prisma = new PrismaClient();
const TEMPLATE_API_BASE_URL = "https://graph.facebook.com/v19.0";

export const createComponents = (userInput) => {
  // console.log(userInput);
  // console.log(String(userInput.templateHeaderType)?.toUpperCase());

  const components = [];

  // if(userInput?.templateHeaderType === "image"){

  // }

  if (userInput.templateHeaderType === "TEXT") {
    components.push({
      type: "HEADER",
      format: "TEXT",
      text: userInput.headerText,
      example: {
        header_text: [userInput.headerTextVariable],
      },
    });
  } else if (
    ["IMAGE", "VIDEO", "DOCUMENT"].includes(
      String(userInput.templateHeaderType)?.toUpperCase()
    )
  ) {
    components.push({
      type: "HEADER",
      format: String(userInput.templateHeaderType)?.toUpperCase(),
      example: {
        header_handle: [userInput.mediaId],
      },
    });
  }

  // console.log(
  //   JSON?.parse(userInput?.templateVariables)?.map((item) => item?.value)
  // );
  // console.log(JSON?.parse(userInput?.templateVariables?.map((item) => item?.value)));

  components.push({
    type: "BODY",
    text: userInput?.templateBody,
    example: {
      body_text: [
        JSON?.parse(userInput?.templateVariables)?.map((item) => item?.value),
      ],
    },
  });

  if (userInput?.templateFooter !== "") {
    components.push({
      type: "FOOTER",
      text: userInput.templateFooter,
    });
  }

  if (JSON?.parse(userInput?.templateButtons)?.length > 0) {
    // console.log("Button is  present ");
    const buttonobject = {
      type: "BUTTONS",
      buttons: [],
    };
    JSON?.parse(userInput?.templateButtons)?.map((item) => {
      if (item?.type === "QUICK_REPLY") {
        buttonobject.buttons.push({ type: "QUICK_REPLY", text: item?.text });
      } else if (item?.type === "URL") {
        buttonobject.buttons.push({
          type: "URL",
          text: item?.text,
          url: item?.url,
        });
      } else if (item?.type === "PHONE_NUMBER") {
        buttonobject.buttons.push({
          type: "PHONE_NUMBER",
          text: item?.text,
          phone_number: `+91${item?.phoneNumber}`,
        });
      }
    });
    components.push(buttonobject);
  }
  // console?.log(components);
  // components.push({
  //   type: "BUTTONS",
  //   buttons: [],
  // });

  // for (let i = 1; i <= 7; i++) {
  //   if (
  //     userInput[`btntype${i}`] &&
  //     userInput[`btntype${i}`] !== "QUICK_REPLY"
  //   ) {
  //     let buttonObject = {};
  //     switch (userInput[`btntype${i}`]) {
  //       case "URL":
  //         buttonObject = {
  //           type: "URL",
  //           text: userInput[`urltext`],
  //           url: userInput[`urllink`],
  //         };
  //         break;
  //       case "PHONE_NUMBER":
  //         buttonObject = {
  //           type: "PHONE_NUMBER",
  //           text: userInput[`phonetext`],
  //           phone_number: userInput[`phoneNumber`],
  //         };
  //         break;
  //       case "COPY_CODE":
  //         buttonObject = {
  //           type: "COPY_CODE",
  //           example: userInput[`copyCodeVariable`],
  //         };
  //         break;
  //       default:
  //         continue;
  //     }
  //     components[3].buttons.push(buttonObject);
  //   }
  // }

  // let j = 1;
  // while (userInput[`quicktext${j}`]) {
  //   components[3].buttons.push({
  //     type: "QUICK_REPLY",
  //     text: userInput[`quicktext${j}`],
  //   });
  //   j++;
  // }
  console?.log("components  created");
  return components;
};

export const extractComponentData = (components) => {
  const header =
    components.find((component) => component.type === "HEADER")?.text || "";
  const body =
    components.find((component) => component.type === "BODY")?.text || "";
  const footer =
    components.find((component) => component.type === "FOOTER")?.text || "";
  const buttonsComponent = components.find(
    (component) => component.type === "BUTTONS"
  );
  const buttons = buttonsComponent ? buttonsComponent.buttons : [];

  return { header, body, footer, buttons };
};

export const createSession = async ({ fileType, fileLength, accessToken }) => {
  try {
    const appId = 1085971379121509;
    if (!fileType || !fileLength) {
      throw new Error("Missing required fields: fileType and/or fileLength");
    }

    const url = `${TEMPLATE_API_BASE_URL}/${appId}/uploads?access_token=${accessToken}`;
    const headers = {
      "Content-Type": "application/json",
    };
    const requestBody = {
      file_type: fileType,
      file_length: fileLength,
    };

    const response = await axios.post(url, requestBody, { headers });
    return { data: response.data, statusCode: response.status };
  } catch (error) {
    console.error("Error in createSession:", error?.response);
    const errorMessage = error.response
      ? `${error.response.status} ${error.response.statusText} - ${error.response.data.error.message}`
      : "Internal server error";
    return {
      error: `Failed to create session: ${errorMessage}`,
      statusCode: error.response ? error.response.status : 500,
    };
  }
};

export const initiateSession = async ({
  uploadSessionId,
  filePath,
  accessToken,
}) => {
  try {
    const fileOffset = 0;

    if (!filePath) {
      throw new Error("Missing required field: filePath");
    }

    const url = `${TEMPLATE_API_BASE_URL}/${uploadSessionId}`;
    const headers = {
      Authorization: `OAuth ${accessToken}`,
      file_offset: fileOffset,
      "Content-Type": "multipart/",
      // "Content-Type": "application/octet-stream",
    };

    // const fileData = fs.readFileSync(filePath);

    const response = await axios.post(url, filePath, { headers });
    // console.log(response);
    if (response.data && response.data.h) {
      const mediaHandle = response.data.h;
      return { mediaHandle, statusCode: response.status };
    } else {
      throw new Error("Invalid response: Missing media handle");
    }
  } catch (error) {
    console.error("Error in initiateSession:", error);
    const errorMessage = error.response
      ? `${error.response.status} ${error.response.statusText} - ${error.response.data.error.message}`
      : "Internal server error";
    return {
      error: `Failed to initiate session: ${errorMessage}`,
      statusCode: error.response ? error.response.status : 500,
    };
  }
};

export const MediaUplaodWithPhoneId = async (file, whatsappInfo) => {
  try {
    // console.log(file);
    const baseUrl = `https://graph.facebook.com/v20.0/${whatsappInfo?.phoneNumberId}/media`;
    const header = {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${whatsappInfo?.accessToken}`,
    };
    const { fieldname, ...resfiles } = file;
    const body = {
      file: resfiles,
      type: file?.mimetype,
      messaging_product: "whatsapp",
    };
    console.log(body);

    const res = await axios?.post(baseUrl, body, header);
    if (res?.status === 200) {
      return { status: res?.status, id: res?.data?.id };
    }
    // console.log(res);
  } catch (error) {
    // console?.log(error);
    return { status: "Error", message: error?.response?.data };
  }
};

export const handleMediaUpload = async (userInput, buisness) => {
  try {
    // console.log(userInput?.file?.mimetype);
    // const extension = userInput.file.split(".").pop();

    let mediaType = userInput?.file?.mimetype;

    // if (userInput.headerFormat === "IMAGE") {
    //   mediaType = `image/${extension}`;
    // } else if (userInput.headerFormat === "DOCUMENT") {
    //   mediaType = `application/${extension}`;
    // } else if (userInput.headerFormat === "VIDEO") {
    //   mediaType = `video/${extension}`;
    // }

    userInput.mediaType = mediaType;
    const arrayBuffer = userInput?.file?.buffer?.slice();
    const blob = new Blob([arrayBuffer], { type: mediaType });
    // console.log(blob);
    // const fileContent = URL?.createObjectURL(blob);
    // console.log(fileContent);
    // const fileContent = fs.readFileSync(userInput.mediaPath);
    // const fileSizeInBytes = fileContent.length;
    // console.log(fileSizeInBytes);
    // Create session

    const sessionResponse = await createSession({
      fileType: mediaType,
      fileLength: userInput?.file?.size,
      // accessToken: userInput.accessToken,
      accessToken: buisness?.accessToken,
    });

    if (sessionResponse.error) {
      throw new Error(sessionResponse.error);
    }

    const uploadSessionId = sessionResponse.data.id;
    console.log(uploadSessionId);

    // Initiate session
    const initiateResponse = await initiateSession({
      uploadSessionId,
      filePath: userInput?.file,
      accessToken: buisness?.accessToken,
    });

    if (initiateResponse.error) {
      throw new Error(initiateResponse.error);
    }

    userInput.mediaId = initiateResponse.mediaHandle;
    console.log("User Media  is  uploaded");
    return userInput;
  } catch (error) {
    throw new Error(`Media upload failed: ${error.message}`);
  }
};

export const sendTemplateRequest = async (userInput, buisness) => {
  const components = createComponents(userInput);

  const requestBody = {
    name: String(userInput.templateName)?.toLowerCase()?.replace(/\s+/g, ""),
    language: userInput?.templateLanguage,
    category: userInput.templateCategory,
    allow_category_change: true,
    components: components,
  };
  console?.log("-".repeat(process?.stdout?.columns));
  console?.log(
    components?.map((item) => {
      if (item?.type === "BODY") {
        console?.log(typeof item?.example);
        console.log(item?.example);
      }
    })
  );
  // console?.log(requestBody);
  // console.log("Request Body:", JSON.stringify(requestBody));

  // let testaccount = "275986335588625";
  // let testAccess = `EAAPbr2pJ7WUBOyZB5HzGJNaG73CioBK3sHHLQpXJtBfZC7UzwZAgBpABAIBZBREaQLSExuIacPfsIuo1ZBqxfTTAqJTHKqPcZCJlYh2mF0tdHY8PvnzhWMEKxgxyZAywEbT8c9wKsUI8gNcnVtKuPHCmmCvaCVaA74p3ZAPKjxkbM9STc150FO6CXLoXCsJjkAPH`;

  const url = `${TEMPLATE_API_BASE_URL}/${buisness?.id}/message_templates`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${buisness?.accessToken}`,
  };

  try {
    console.log(url, headers, requestBody);
    const response = await axios.post(url, JSON?.stringify(requestBody), {
      headers,
    });
    if (response?.status === 200) {
      const data = response.data;

      const { header, body, footer, buttons } =
        extractComponentData(components);

      await prisma.templates.create({
        data: {
          template_id: data.id,
          wabaid: userInput.wabaid,
          status: data.status,
          name: userInput.name,
          language: userInput.language,
          category: userInput.category,
          header: header,
          headerVariable: userInput.headerTextVariable,
          header_format: userInput.headerFormat,
          header_handle: userInput.mediaId,
          body: body,
          bodyVariable: JSON.stringify(userInput.bodyTextVariable),
          footer: footer,
          buttons: JSON.stringify(buttons),
          createdAt: new Date(),
        },
      });
    }
    console.log(response?.data);
  } catch (error) {
    console?.log(error?.response?.data);
  }

  return { message: "Template created successfully", statusCode: 200 };
};
