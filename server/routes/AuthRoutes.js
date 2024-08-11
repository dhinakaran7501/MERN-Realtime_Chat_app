import { Router } from "express";
import {
  signup,
  login,
  getUserInfo,
  updateProfile,
  addProfileImage,
  removeProfileImage,
  logOut,
} from "../controllers/AuthController.js";
import { verifyTokens } from "../middlewares/AuthMiddleware.js";
import upload from "../Multer/multerConfig.js";

const authRoutes = Router();

authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.get("/userInfo", verifyTokens, getUserInfo);
authRoutes.post("/update-profile", verifyTokens, updateProfile);
authRoutes.post(
  "/add-profile-image",
  verifyTokens,
  upload.single("profileimage"),
  addProfileImage
);
authRoutes.delete("/remove-profile-image", verifyTokens, removeProfileImage);

authRoutes.post("/logout", logOut);
export default authRoutes;
