import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import yieldRoutes from "./routes/yieldRoutes.js";
import diseaseRoute from "./routes/diseaseRoute.js";
import authRoutes from "./routes/authRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";

dotenv.config();
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);

app.use("/api/yield", yieldRoutes);
app.use("/api/history", historyRoutes);

app.use("/api/disease", diseaseRoute);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
