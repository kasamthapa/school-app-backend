import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error("MONGO_URI is missing in .env");
    }
    await mongoose.connect(uri); // ← no "!" needed now
    console.log(`MongoDB Connected:`, uri);
  } catch (error: any) {
    console.error("DB Error:", error.message);
    process.exit(1);
  }
};
