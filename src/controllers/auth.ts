import { Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";

const generateToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "app-jwt-secret", {
    expiresIn: "1h",
  });
};

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  try {
    const user = new User({ name, email, password, role });
    await user.save();
    const token = generateToken(user._id);
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
    });
    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    res.status(400).json({ message: "Error registering user", error });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = generateToken(user._id);
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
    });
    res.status(200).json({ message: "User logged in successfully", token });
  } catch (error) {
    res.status(400).json({ message: "Error logging in user", error });
  }
};

export const logoutUser = (req: Request, res: Response) => {
  res.clearCookie("jwt");
  res.status(200).json({ message: "User logged out successfully" });
};
