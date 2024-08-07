import express from "express";
import TemplateService from "../services/templateService.js";
import multer from "multer";
import { PrismaClient } from "@prisma/client";
const upload = multer();
const prisma = new PrismaClient();
const router = express.Router();

router.post("/create", upload?.single("file"), async (req, res) => {
  try {
    // console.log(req?.file);
    const userInput = req.body;
    console.log(userInput);
    if (req?.file) {
      console.log("File  is  present");
      userInput.file = req?.file;
      const result = await TemplateService?.createTemplate(userInput);
      if (result) {
        return res.status(result.statusCode).json(result);
      }
    } else {
      const result = await TemplateService.createTemplate(userInput);
      return res.status(result.statusCode).json(result);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/edit", async (req, res) => {
  try {
    const userInput = req.body;
    const result = await TemplateService.editTemplate(userInput);
    res.status(result.statusCode).json(result);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/fetch", async (req, res) => {
  const { wabaid, accessToken } = req.body;
  const userInput = { wabaid, accessToken };

  try {
    const result = await TemplateService.fetchTemplates(userInput);
    res.status(result.statusCode).json(result);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/sendTemplate", async (req, res) => {
  const { templateId, buisnessId } = req?.body;
  const buisness = await prisma?.whatsappBuisness?.findFirst({
    where: {
      id: buisnessId,
    },
  });

  const templateinfo = await prisma?.templates?.findFirst({
    where: {
      template_id: templateId,
    },
  });
  TemplateService.sendTemplateMessage(templateinfo, {}, buisness);
  return res.sendStatus(200);
});

router?.post("/gettemplates", async (req, res) => {
  try {
    const { buisnessId } = req?.body;
    const templates = await prisma?.templates?.findMany({
      where: {
        wabaid: buisnessId,
      },
      select: {
        template_id: true,
        name: true,
        language: true,
        category: true,
        quality_score: true,
        status: true,
        wabaid: true,
        components: true,
        rejected_reason: true,
      },
    });
    res?.status(200).json({ message: "Ok", templates: templates });
  } catch (error) {
    return res.status(500).json({ message: "Internal  Server error" });
  }
});

router.delete("/delete", async (req, res) => {
  try {
    const userInput = req.body;
    const result = await TemplateService.deleteTemplate(userInput);
    res.status(result.statusCode).json(result);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
