import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";

export const authenticateJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "app-jwt-secret"
    ) as { userId: string };
    req.user = await User.findById(decoded.userId).select("-password");
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
};

export const authorizeRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== role) {
      return res
        .status(403)
        .json({ message: "Access denied. Insufficient permissions." });
    }
    next();
  };
};
