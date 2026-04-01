import express from "express";
import cors from "cors";
import yieldRoutes from "./routes/yieldRoutes.js";
import diseaseRoute from "./routes/diseaseRoute.js"

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Your React/Vite port
    methods: ["GET", "POST"],
    credentials: true,
  }),
);

app.use("/api/yield", yieldRoutes);

// this route for disease detection
app.use("/api/disease", diseaseRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
