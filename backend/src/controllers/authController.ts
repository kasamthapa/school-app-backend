import { Request, Response } from "express";
import Admin from "../models/Admin";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}
const JWT_SECRET = process.env.JWT_SECRET;

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    console.log("Stored hash:", admin.password);
    console.log(
      "Compare result:",
      await bcrypt.compare("admin123", admin.password)
    );
    const isMatch = await bcrypt.compare(password, admin.password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return res.status(200).json({ message: "LogIn successfully" });
  } catch (e: any) {
    console.log("Error in login", e.message);
    return res.status(500).json({ message: "Server error" });
  }
};

export const logout = async (_req: Request, res: Response) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    expires: new Date(0),
  });
  return res.status(200).json({ message: "Logged Out successfully" });
};
