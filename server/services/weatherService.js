import axios from "axios";
import { ApiError } from "../config/ApiError.js";

const OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast";

export const fetchCurrentWeather = async (latitude, longitude) => {
  let response;

  try {
    response = await axios.get(OPEN_METEO_URL, {
      params: {
        latitude,
        longitude,
        current: "temperature_2m,relative_humidity_2m,precipitation",
        timezone: "auto",
      },
      timeout: 10000,
    });
  } catch (error) {
    console.error("Current weather lookup failed:", error.message);
    throw new ApiError(502, "Weather service is currently unavailable");
  }

  const current = response.data?.current;
  console.log("Current weather data:", current);
  const temperature = current?.temperature_2m;
  const humidity = current?.relative_humidity_2m;
  const precipitation = current?.precipitation;
  const fetchedAt = new Date().toISOString();

  if (
    !Number.isFinite(temperature) ||
    !Number.isFinite(humidity) ||
    !Number.isFinite(precipitation) ||
    !fetchedAt
  ) {
    throw new ApiError(502, "Weather service returned incomplete readings");
  }

  return {
    temperature_c: temperature,
    humidity_percent: humidity,
    rainfall_mm: precipitation,
    fetched_at: fetchedAt,
    source: "Open-Meteo",
    latitude,
    longitude,
  };
};
