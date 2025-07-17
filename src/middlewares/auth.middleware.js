import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";

export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ApiError(401, "No token provided"));
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded; // { userId: ... }
    next();
  } catch (err) {
    return next(new ApiError(401, "Invalid or expired token"));
  }
};
