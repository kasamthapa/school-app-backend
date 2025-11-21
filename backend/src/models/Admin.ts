import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

interface IAdmin extends mongoose.Document {
  username: string;
  password: string;
}

const adminSchema = new Schema<IAdmin>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

export default model("Admin", adminSchema);
export type { IAdmin };
