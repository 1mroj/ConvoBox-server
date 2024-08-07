import { PrismaClient } from "@prisma/client";
import { Router } from "express";

const triggerRoutes = Router();
const prisma = new PrismaClient();
triggerRoutes.post("/createtrigger", async (req, res) => {
  try {
    const { wabaid, triggerword, replayType, replay } = req?.body;
    if (!wabaid)
      return res.status(403).json({ message: "waba id is  required" });

    const buisness = await prisma?.whatsappBuisness?.findFirst({
      where: {
        id: wabaid,
      },
    });
    if (!buisness)
      return res?.sendStatus(404).json({ message: "Buissness not found " });
    const trigger = await prisma?.triggers?.create({
      data: {
        triggerword: triggerword,
        replayType: replayType,
        replay: replay,
        phonenumberid: buisness?.phoneNumberId,
      },
    });
    if (trigger) {
      return res.status(200).json({ message: "trigger created" });
    } else {
      return res.sendStatus(400).json({ message: "triger is not  created" });
    }
  } catch (error) {
    console?.log(error);
    return res.status(500).json({ message: "something went wrong" });
  }
});
export default triggerRoutes;
