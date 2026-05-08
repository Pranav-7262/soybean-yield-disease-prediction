import express from "express";
import {
  changeCurrentPassword,
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  resetAccount,
  updateEmail,
  updateUsername,
} from "../controllers/authController.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshAccessToken);
router.post("/logout", verifyJWT, logoutUser);

router.get("/current-user", verifyJWT, getCurrentUser);
router.put("/update-username", verifyJWT, updateUsername);
router.put("/update-email", verifyJWT, updateEmail);
router.put("/update-password", verifyJWT, changeCurrentPassword);
router.delete("/reset-account", verifyJWT, resetAccount);

export default router;
