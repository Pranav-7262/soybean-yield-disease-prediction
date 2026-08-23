import mongoose from "mongoose";

const diseasePredictionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    prediction: {
      type: String,
      required: true,
    },

    confidence: {
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

export const DiseasePrediction = mongoose.model(
  "DiseasePrediction",
  diseasePredictionSchema,
);

export default DiseasePrediction;
