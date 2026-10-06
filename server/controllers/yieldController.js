import async_handler from "express-async-handler";
import { predictYield } from "../services/mlClient.js";
import Prediction from "../models/yieldPrediction.js";
import { ApiError } from "../config/ApiError.js";
import { ApiResponse } from "../config/ApiResponse.js";

export const getYieldPrediction = async_handler(async (req, res) => {
  const userId = req.userId; // From auth middleware
  const {
    rainfall_mm,
    temperature_c,
    humidity_percent,
    soil_n,
    soil_p,
    soil_k,
    area_hectare,
    weather,
  } = req.body;

  const requiredFields = {
    rainfall_mm,
    temperature_c,
    humidity_percent,
    soil_n,
    soil_p,
    soil_k,
    area_hectare,
  };
  const hasInvalidField = Object.values(requiredFields).some(
    (value) =>
      value === "" ||
      value === null ||
      value === undefined ||
      !Number.isFinite(Number(value)) ||
      Number(value) < 0,
  );

  if (hasInvalidField || Number(area_hectare) <= 0) {
    throw new ApiError(
      400,
      "All yield inputs must be valid non-negative numbers and field area must be greater than zero",
    );
  }

  // Get prediction from ML service
  const result = await predictYield(req.body);

  if (result.status === "error") {
    throw new ApiError(500, result.error || "ML Service error");
  }

  // Save prediction to database
  const prediction = await Prediction.create({
    userId,
    predicted_yield: result.predicted_yield,
    unit: result.unit,
    soil_n,
    soil_p,
    soil_k,
    temperature_c,
    humidity_percent,
    rainfall_mm,
    area_hectare,
    ...(weather && {
      weather: {
        source: weather.source,
        location: weather.location,
        fetched_at: weather.fetched_at,
        latitude: weather.latitude,
        longitude: weather.longitude,
        edited: weather.edited,
      },
    }),
    model_accuracy: result.model_accuracy,
  });

  if (!prediction) {
    throw new ApiError(500, "Failed to save prediction");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        ...result,
      },
      "Prediction successful and saved to history",
    ),
  );
});
