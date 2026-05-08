import express from "express";
import {
  getUserHistory,
  getPredictionById,
  deletePrediction,
  deleteAllPredictions,
  getPredictionStats,
} from "../controllers/historyController.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All history routes require authentication
router.use(verifyJWT);

// Get all user predictions
router.get("/", getUserHistory);

// Get prediction statistics
router.get("/stats", getPredictionStats);

// Get a specific prediction by ID
router.get("/:predictionId", getPredictionById);

// Delete a specific prediction
router.delete("/:predictionId", deletePrediction);

// Delete all predictions
router.delete("/", deleteAllPredictions);

export default router;
