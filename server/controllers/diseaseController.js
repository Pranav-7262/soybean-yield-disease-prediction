import axios from "axios";
import FormData from "form-data";
import fs from "fs";

export const predictDisease = async (req, res) => {
  try {
    const filePath = req.file.path;

    const formData = new FormData();
    formData.append("file", fs.createReadStream(filePath));

    const response = await axios.post(
      "http://127.0.0.1:8000/predict/disease",
      formData,
      {
        headers: formData.getHeaders(),
      }
    );

    // delete file after sending
    fs.unlinkSync(filePath);

    res.json(response.data);

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Prediction failed" });
  }
};