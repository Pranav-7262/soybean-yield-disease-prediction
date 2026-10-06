import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getCurrentWeather } from "../controllers/weatherController.js";

const router = express.Router();

router.get("/current", verifyJWT, getCurrentWeather);

export default router;
