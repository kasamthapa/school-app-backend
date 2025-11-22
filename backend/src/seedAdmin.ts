// src/seedAdmin.ts
import { connectDB } from "./config/db";
import Admin from "./models/Admin";
import dotenv from "dotenv";

dotenv.config();
connectDB();

const createAdmin = async () => {
  try {
    // Remove any old admin with username 'admin'
    await Admin.deleteMany({ username: "admin" });

    // Create new admin — password will be hashed automatically by pre-save hook
    await Admin.create({
      username: "admin",
      password: "admin123", // plain text here
    });

    console.log("✅ Admin created successfully with hashed password");
    process.exit(0);
  } catch (e: any) {
    console.error("Error creating admin:", e.message);
    process.exit(1);
  }
};

createAdmin();
