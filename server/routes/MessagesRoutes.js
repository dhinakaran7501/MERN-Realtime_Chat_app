import { Router } from "express";
import { verifyTokens } from "../middlewares/AuthMiddleware.js";
import { getMessages, uploadFile } from "../controllers/MessagesController.js";
import upload from "../Multer/multerConfig.js";

const messagesRoutes = Router();
messagesRoutes.post("/get-messages", verifyTokens, getMessages);
messagesRoutes.post(
  "/upload-file",
  verifyTokens,
  upload.single("file"),
  uploadFile
);

export default messagesRoutes;
