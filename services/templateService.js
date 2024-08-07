import axios from "axios";
import { Prisma, PrismaClient } from "@prisma/client";
import {
  MediaUplaodWithPhoneId,
  createComponents,
  extractComponentData,
  handleMediaUpload,
  sendTemplateRequest,
} from "../controllers/templateController.js";
const TEMPLATE_API_BASE_URL = "https://graph.facebook.com/v19.0";
const prisma = new PrismaClient();

const TemplateService = {
  async createTemplate(userInput) {
    try {
      const buisness = await prisma?.whatsappBuisness?.findFirst({
        where: {
          id: "275986335588625",
        },
      });
      // console?.log(buisness);
      if (userInput.headerFormat !== "TEXT") {
        // console.log("This  is not  the  text");
        // const media = await MediaUplaodWithPhoneId(userInput?.file, buisness);
        // console.log(media);
        userInput = await handleMediaUpload(userInput, buisness);
        console.log("UserInput  After  HandleMedia ", userInput);
        console.log("-".repeat(process?.stdout?.columns));
      }
      console.log("Send in to  whatsapp");
      return await sendTemplateRequest(userInput, buisness);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = error.response
        ? `${error.response.status} ${error.response.statusText} - ${error.response.data.error.message}`
        : "Internal server error";
      return {
        error: `Failed to create template: ${errorMessage}`,
        statusCode: error.response ? error.response.status : 500,
      };
    }
  },

  async editTemplate(userInput) {
    try {
      const { templateId, accessToken } = userInput;
      const url = `${TEMPLATE_API_BASE_URL}/${templateId}`;

      if (userInput.headerFormat !== "TEXT") {
        userInput = await handleMediaUpload(userInput);
      }

      const components = createComponents(userInput);

      const requestBody = {
        components,
      };

      console.log("Request URL:", url);
      console.log("Request Body:", JSON.stringify(requestBody));

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      };

      const response = await axios.post(url, requestBody, { headers });

      const { header, body, footer, buttons } =
        extractComponentData(components);

      await prisma.templates.update({
        where: { template_id: templateId },
        data: {
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
          lastEdited: new Date(),
        },
      });

      return { message: "Template edited successfully", statusCode: 200 };
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = error.response
        ? `${error.response.status} ${error.response.statusText} - ${error.response.data.error.message}`
        : "Internal server error";
      return {
        error: `Failed to edit template: ${errorMessage}`,
        statusCode: error.response ? error.response.status : 500,
      };
    }
  },

  async fetchTemplates(userInput) {
    try {
      const url = `${TEMPLATE_API_BASE_URL}/${userInput.wabaid}/message_templates`;
      const accessToken = userInput.accessToken;

      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      const params = {
        fields:
          "id,name,status,category,language,quality_score,rejected_reason,components",
        limit: "100",
      };

      const response = await axios.get(url, { headers, params });

      const data = response.data;
      // console.log(data);
      if (!data || !Array.isArray(data.data)) {
        return {
          error: "Invalid data format received from API",
          statusCode: 400,
        };
      }

      const apiTemplates = data.data;
      const apiTemplateIds = new Set(
        apiTemplates.map((template) => template.id)
      );

      for (const template of apiTemplates) {
        let header;
        let footer;
        let BUTTONS;
        let Body;
        console.log("-"?.repeat(process?.stdout?.columns));
        console.log("template Componets details for : ", template?.name);
        if (template?.components || template?.components?.length > 0) {
          for (let component of template?.components) {
            console.log("Cureent  component ", component?.type);
            if (component?.type === "FOOTER") {
              footer = component;
              console.log(`this is the footer`, footer);
            } else if (component?.type === "HEADER") {
              header = component;
              console.log(`this is the header`, header);
            } else if (component?.type === "BODY") {
              Body = component;
              console.log(`this is the body`, Body);
            } else if (component?.type === "BUTTONS") {
              BUTTONS = component;
              console.log(`this is the Buttons`, BUTTONS);
            }
          }
        }

        console.log("-"?.repeat(process?.stdout?.columns));
        // console.log(template?.components);
        // const template = await prisma?.templates?.findFirst({
        //   where: {
        //     template_id: template?.id,
        //   },
        // });
        await prisma.templates.upsert({
          where: { template_id: template.id },
          update: {
            status: template.status,
            name: template.name,
            category: template.category,
            quality_score: template.quality_score.score,
            rejected_reason: template.rejected_reason,
            language: template?.language,
            header: header,
            header_format: header?.format,

            header_handle:
              header?.format === "IMAGE"
                ? String(header?.example?.header_handle)
                : null,
            headerVariable:
              header?.format === "TEXT" && header?.example?.header_text
                ? header?.example?.header_text
                : null,
            body: Body,
            bodyVariable: Body?.example?.body_text,
            buttons: BUTTONS,
            footer: footer,
            components: template?.components,
          },
          create: {
            template_id: template.id,
            wabaid: userInput.wabaid,

            status: template.status,
            name: template.name,
            category: template.category,
            quality_score: template.quality_score.score,
            rejected_reason: template.rejected_reason,
            language: template?.language,
            header: header,
            header_format: header?.format,
            header_handle:
              header?.format === "IMAGE"
                ? String(header?.example?.header_handle)
                : null,
            headerVariable:
              header?.format === "TEXT" ? header?.example?.header_text : null,
            body: Body,
            bodyVariable: Body?.example?.body_text,
            buttons: BUTTONS,
            footer: footer !== undefined ? footer : null,
            components: template?.components,
          },
        });
      }
      //console.log(template.components)
      // const dbTemplates = await prisma.templates.findMany({
      //   where: { wabaid: userInput.wabaid },
      //   select: { template_id: true, name: true, status: true },
      // });

      // for (const dbTemplate of dbTemplates) {
      //   if (!apiTemplateIds.has(dbTemplate.template_id)) {
      //     await prisma.templates.delete({
      //       where: { template_id: dbTemplate.template_id },
      //     });
      //   }
      // }

      return { templates: dbTemplates, statusCode: 200 };
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = error.response
        ? `${error.response.status} ${error.response.statusText} - ${error.response.data.error.message}`
        : "Internal server error";
      return {
        error: `Failed to fetch templates: ${errorMessage}`,
        statusCode: error.response ? error.response.status : 500,
      };
    }
  },

  async deleteTemplate(userInput) {
    try {
      const { wabaid, accessToken, templateId, templateName } = userInput;
      const url = `${TEMPLATE_API_BASE_URL}/${wabaid}/message_templates`;

      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      const params = {
        hsm_id: templateId,
        name: templateName,
      };

      const response = await axios.delete(url, { headers, params });

      await prisma.templates.delete({
        where: { template_id: templateId },
      });

      return { message: "Template deleted successfully", statusCode: 200 };
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = error.response
        ? `${error.response.status} ${error.response.statusText} - ${error.response.data.error.message}`
        : "Internal server error";
      return {
        error: `Failed to delete template: ${errorMessage}`,
        statusCode: error.response ? error.response.status : 500,
      };
    }
  },

  async sendTemplateMessage(templateinfo, UserInfo, buisnessInfo) {
    console.log(templateinfo);
    console.log(buisnessInfo);
  },
};

export default TemplateService;
