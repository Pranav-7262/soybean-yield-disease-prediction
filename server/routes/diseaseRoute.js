import express from "express";
import multer from "multer";
import { predictDisease } from "../controllers/diseaseController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/disease", upload.single("image"), predictDisease);

export default router;