import { Router } from "express";
import { verifyTokens } from "../middlewares/AuthMiddleware.js";
import { getMessages } from "../controllers/MessagesController.js";

const messagesRoutes = Router();

messagesRoutes.post("/get-messages", verifyTokens, getMessages);

export default messagesRoutes;
