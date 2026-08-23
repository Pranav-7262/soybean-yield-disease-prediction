import mongoose from "mongoose";

const predictionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    predicted_yield: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      default: "kg/hectare",
    },
    soil_n: {
      type: Number,
      required: true,
    },
    soil_p: {
      type: Number,
      required: true,
    },
    soil_k: {
      type: Number,
      required: true,
    },
    temperature_c: {
      type: Number,
      required: true,
    },
    humidity_percent: {
      type: Number,
      required: true,
    },
    rainfall_mm: {
      type: Number,
      required: true,
    },
    area_hectare: {
      type: Number,
      required: true,
    },
    model_accuracy: {
      type: String,
      default: "99.75%",
    },
  },
  {
    timestamps: true,
  },
);

export const Prediction = mongoose.model("Prediction", predictionSchema);
export default Prediction;
