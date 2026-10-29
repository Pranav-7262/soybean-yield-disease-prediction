import async_handler from "express-async-handler";
import {
  getYieldDistricts as fetchYieldDistricts,
  predictYield,
} from "../services/mlClient.js";
import Prediction from "../models/yieldPrediction.js";
import { ApiError } from "../config/ApiError.js";
import { ApiResponse } from "../config/ApiResponse.js";

export const getYieldDistricts = async_handler(async (_req, res) => {
  const result = await fetchYieldDistricts();
  return res.status(200).json(
    new ApiResponse(200, { districts: result.districts }, "Supported districts"),
  );
});

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
    district,
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

  if (
    hasInvalidField ||
    Number(area_hectare) <= 0 ||
    typeof district !== "string" ||
    !district.trim()
  ) {
    throw new ApiError(
      400,
      "Select a supported district and provide valid non-negative inputs with field area greater than zero",
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
    district,
    predicted_yield: result.predicted_yield,
    estimated_total_production_kg: result.estimated_total_production_kg,
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
    validation_mae_kg_per_hectare:
      result.validation_metrics?.mae_kg_per_hectare,
    validation_r2: result.validation_metrics?.r2,
    model_version: result.model_version,
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
