import express from "express";
const router = express.Router();
import { detectDisease } from "../controllers/diseaseController.js";


router.post("/detect", detectDisease);

export default router;