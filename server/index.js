import express from "express";
import cors from "cors";
import yieldRoutes from "./routes/yieldRoutes.js";
import diseaseRoute from "./routes/diseaseRoute.js"

const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("<b>Node Backend Running </b>");
});

app.use("/api/yield", yieldRoutes);

// this route for disease detection
app.use("/api/disease", diseaseRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
