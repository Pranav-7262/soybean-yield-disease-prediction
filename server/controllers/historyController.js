import async_handler from "express-async-handler";
import Prediction from "../models/Prediction.js";
import { ApiError } from "../config/ApiError.js";
import { ApiResponse } from "../config/ApiResponse.js";

export const getUserHistory = async_handler(async (req, res) => {
  const userId = req.userId;

  const predictions = await Prediction.find({ userId })
    .sort({ createdAt: -1 })
    .exec();

  if (!predictions) {
    throw new ApiError(404, "No predictions found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        predictions,
        "User predictions fetched successfully",
      ),
    );
});

// Get a single prediction by ID
export const getPredictionById = async_handler(async (req, res) => {
  const { predictionId } = req.params;
  const userId = req.userId;

  const prediction = await Prediction.findById(predictionId);

  if (!prediction) {
    throw new ApiError(404, "Prediction not found");
  }

  // Ensure user can only view their own predictions
  if (prediction.userId.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to view this prediction");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, prediction, "Prediction fetched successfully"));
});

// Delete a prediction
export const deletePrediction = async_handler(async (req, res) => {
  const { predictionId } = req.params;
  const userId = req.userId;

  const prediction = await Prediction.findById(predictionId);

  if (!prediction) {
    throw new ApiError(404, "Prediction not found");
  }

  // Ensure user can only delete their own predictions
  if (prediction.userId.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to delete this prediction");
  }

  await Prediction.findByIdAndDelete(predictionId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Prediction deleted successfully"));
});

// Delete all predictions for a user
export const deleteAllPredictions = async_handler(async (req, res) => {
  const userId = req.userId;

  const result = await Prediction.deleteMany({ userId });

  if (result.deletedCount === 0) {
    throw new ApiError(404, "No predictions found to delete");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { deletedCount: result.deletedCount },
        "All predictions deleted successfully",
      ),
    );
});

// Get statistics about user predictions
export const getPredictionStats = async_handler(async (req, res) => {
  const userId = req.userId;

  const predictions = await Prediction.find({ userId });

  if (predictions.length === 0) {
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          totalPredictions: 0,
          avgYield: 0,
          maxYield: 0,
          minYield: 0,
        },
        "No predictions found",
      ),
    );
  }

  const yields = predictions.map((p) => p.predicted_yield);
  const avgYield = (yields.reduce((a, b) => a + b, 0) / yields.length).toFixed(
    2,
  );
  const maxYield = Math.max(...yields);
  const minYield = Math.min(...yields);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalPredictions: predictions.length,
        avgYield: parseFloat(avgYield),
        maxYield,
        minYield,
      },
      "Statistics fetched successfully",
    ),
  );
});
