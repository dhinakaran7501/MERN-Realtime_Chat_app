import { Router } from "express";
import { verifyTokens } from "../middlewares/AuthMiddleware.js";
import { searchContacts } from "../controllers/ContactController.js";

const contactsRoutes = Router();

contactsRoutes.post("/search", verifyTokens, searchContacts);

export default contactsRoutes;
