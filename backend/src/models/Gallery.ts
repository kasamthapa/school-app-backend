import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    imageUrl: { type: String, required: true },
    public_id: { type: String, required: true }, // Added for Cloudinary deletion
  },
  { timestamps: true }
);

export default mongoose.model("Gallery", gallerySchema);
