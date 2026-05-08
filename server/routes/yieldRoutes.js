import express from "express";
import { getYieldPrediction } from "../controllers/yieldController.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Yield prediction requires authentication
router.post("/predict", verifyJWT, getYieldPrediction);

export default router;
