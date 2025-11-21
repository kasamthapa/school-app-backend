import { join } from "path";
import { connectDB } from "./config/db";
import Admin from "./models/Admin";
import dotenv from "dotenv";

dotenv.config();
connectDB();

const createAdmin = async () => {
  try {
    const existing = await Admin.findOne({ username: "admin" });
    if (existing) {
      console.log("Admin user already exists!");
      process.exit(0);
    }
    await Admin.create({
      username: "admin",
      password: "admin123",
    });

    console.log("Admin data created successfully");
  } catch (e: any) {
    console.log("Error creating admin user", e.message);
    process.exit(1);
  }
};

createAdmin();
