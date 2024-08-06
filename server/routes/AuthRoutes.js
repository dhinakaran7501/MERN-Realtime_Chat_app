import { Router } from "express";
import { signup, login, getUserInfo } from "../controllers/AuthController.js";
import { verifyTokens } from "../middlewares/AuthMiddleware.js";

const authRoutes = Router();

authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.get("/userInfo", verifyTokens, getUserInfo);

export default authRoutes;
