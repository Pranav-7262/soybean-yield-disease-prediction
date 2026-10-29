import express from "express";
import {
  getYieldDistricts,
  getYieldPrediction,
} from "../controllers/yieldController.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Yield prediction requires authentication
router.get("/districts", verifyJWT, getYieldDistricts);
router.post("/predict", verifyJWT, getYieldPrediction);

export default router;
