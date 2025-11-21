import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Admin, { IAdmin } from "../models/Admin";

// ----------------------------------------
// Runtime validation for required env variable
// ----------------------------------------
if (!process.env.JWT_SECRET) {
  throw new Error(
    "❌ JWT_SECRET is missing. Set it in your environment variables."
  );
}

const JWT_SECRET = process.env.JWT_SECRET;

interface JwtPayload {
  id: string;
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // ----------------------------------------
    // 1. Get token from cookies
    //----------------------------------------
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: "Not authorized: token missing" });
    }

    // ----------------------------------------
    // 2. Verify the token
    //----------------------------------------
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    // ----------------------------------------
    // 3. Fetch the admin from DB (and exclude password)
    //----------------------------------------
    const admin: IAdmin | null = await Admin.findById(decoded.id).select(
      "-password"
    );

    if (!admin) {
      return res
        .status(401)
        .json({ message: "Not authorized: user no longer exists" });
    }

    // ----------------------------------------
    // 4. Attach the user to req (now fully typed)
    //----------------------------------------
    req.user = admin;

    // ----------------------------------------
    // 5. Continue to route
    //----------------------------------------
    next();
  } catch (error: any) {
    console.error("Auth error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
