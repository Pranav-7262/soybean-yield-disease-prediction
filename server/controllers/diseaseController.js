import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import DiseasePrediction from "../models/diseasePrediction.js";

export const predictDisease = async (req, res) => {
  const filePath = req.file?.path;

  try {
    const formData = new FormData();

    formData.append("file", fs.createReadStream(filePath));

    const response = await axios.post(
      "http://127.0.0.1:8000/predict/disease",
      formData,
      {
        headers: formData.getHeaders(),
      },
    );

    const diseasePrediction = await DiseasePrediction.create({
      userId: req.user._id,
      prediction: response.data.prediction,
      confidence: response.data.confidence,
      model_accuracy: response.data.model_accuracy,
    });

    res.status(201).json({
      success: true,
      data: diseasePrediction,
    });
  } catch (error) {
    console.error("Disease prediction error:", error.message);

    res.status(500).json({
      success: false,
      error: "Prediction failed",
    });
  } finally {
    // Always delete uploaded file
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};
