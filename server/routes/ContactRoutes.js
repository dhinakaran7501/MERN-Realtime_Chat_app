import { Router } from "express";
import { verifyTokens } from "../middlewares/AuthMiddleware.js";
import {
  getContactsforDMLists,
  searchContacts,
} from "../controllers/ContactController.js";

const contactsRoutes = Router();

contactsRoutes.post("/search", verifyTokens, searchContacts);
contactsRoutes.get("/get-contacts-for-dm", verifyTokens, getContactsforDMLists);

export default contactsRoutes;
