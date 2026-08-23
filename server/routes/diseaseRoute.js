import express from "express";
import multer from "multer";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { predictDisease } from "../controllers/diseaseController.js";
import {
  deleteAllDiseasePredictions,
  deleteDiseasePrediction,
  getDiseaseHistory,
  getDiseasePredictionById,
} from "../controllers/historyController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.use(verifyJWT);

router.post("/disease", upload.single("image"), predictDisease);
router.get("/", getDiseaseHistory);
router.get("/:predictionId", getDiseasePredictionById);

router.delete("/:predictionId", deleteDiseasePrediction);

router.delete("/", deleteAllDiseasePredictions);

export default router;
