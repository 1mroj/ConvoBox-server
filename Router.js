// Router.js
import { Router } from "express";
import webhook from "./Routes/webhook.Routes.js";
import chats from "./Routes/Chat.Routes.js";
import userRoutes from "./Routes/user.Routes.js";
import templateRoutes from "./Routes/template.Routes.js";
import triggerRoutes from "./Routes/Trigger.Routes.js";
import Broadcastrouter from "./Routes/Broadcast.Routes.js";

const router = Router();
router.use("/whatsapp", webhook);
router.use("/chats", chats);
router.use("/users", userRoutes);
router.use("/templates", templateRoutes);
router?.use("/triggers", triggerRoutes);
router?.use("/broadcast", Broadcastrouter);

export default router;
