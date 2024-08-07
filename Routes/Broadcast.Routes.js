import { Router } from "express";
import multer from "multer";
import fs from "fs";
import { parse } from "csv-parse";
import { pushmessage } from "../services/Redis/RedisService.js";

const Broadcastrouter = Router();

const upload = multer();

Broadcastrouter?.post(
  "/send-broadcast",
  upload?.single("file"),
  async (req, res) => {
    try {
      const { type  , templateid , message  } = req?.body;
      console.log(req?.file);
      console.log(type, templateid);
      const filecontent = req?.file?.buffer?.toString("utf-8");
      const parser = parse({ delimiter: ",", columns: true, from_line: 1 });
      const broadcast = [];

      parser.on("data", (row) => {
        let newRow = { ...row }; // create a new object with the same properties as row
        if (type === "template") {
          newRow.type = "template";
        }

        broadcast?.push(newRow);
      });

      parser.on("error", (err) => {
        console.log(err);
      });

      parser.on("end", async () => {
        console.log("finished");
        console.log(broadcast);
        await pushmessage(broadcast);
      });

      parser.write(filecontent);
      parser.end();

      res.sendStatus(200);
    } catch (error) {
      console.log(error);
    }
  }
);

export default Broadcastrouter;
