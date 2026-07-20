import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ApiError } from "../config/ApiError.js";

export const verifyJWT = async (req, res, next) => {
  try {
    // First, check the Authorization header for Bearer token
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken",
    );

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }
    req.userId = user._id;
    req.user = user; // Set full user object for admin middleware
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized: Invalid or expired token",
    });
  }
};
