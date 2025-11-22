// routes/gallery.ts
import { Router, Request, Response } from "express";
import multer from "multer";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { protect } from "../middleware/auth";
import Gallery from "../models/Gallery";

const router = Router();

// Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// POST /gallery
router.post(
  "/",
  protect,
  upload.single("image"),
  async (req: Request, res: Response) => {
    try {
      if (!req.file)
        return res.status(400).json({ message: "No file uploaded" });

      // Upload to Cloudinary
      const result: UploadApiResponse = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "school-gallery" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as UploadApiResponse);
          }
        );
        stream.end(req.file!.buffer);
      });

      const img = new Gallery({
        title: req.body.title || "Untitled",
        description: req.body.description || "",
        imageUrl: result.secure_url,
        public_id: result.public_id, // Save public_id
      });

      await img.save();

      return res
        .status(201)
        .json({ message: "Uploaded successfully", image: img });
    } catch (err: any) {
      console.error("Cloudinary upload error:", err);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

// GET /gallery
router.get("/", async (_req: Request, res: Response) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (err: any) {
    console.error("Gallery fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /gallery/:id
router.delete("/:id", protect, async (req: Request, res: Response) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery)
      return res.status(404).json({ message: "Gallery item not found" });

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(gallery.public_id);

    // Delete from database
    await gallery.deleteOne();

    return res.status(200).json({ message: "Deleted successfully" });
  } catch (err: any) {
    console.error("Gallery delete error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
