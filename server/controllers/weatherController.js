import async_handler from "express-async-handler";
import { ApiError } from "../config/ApiError.js";
import { ApiResponse } from "../config/ApiResponse.js";
import { fetchCurrentWeather } from "../services/weatherService.js";

export const getCurrentWeather = async_handler(async (req, res) => {
  const latitude = Number(req.query.latitude);
  const longitude = Number(req.query.longitude);

  if (
    req.query.latitude === undefined ||
    req.query.longitude === undefined ||
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    throw new ApiError(400, "Valid latitude and longitude are required");
  }

  const weather = await fetchCurrentWeather(latitude, longitude);

  return res
    .status(200)
    .json(new ApiResponse(200, weather, "Current local weather fetched"));
});
