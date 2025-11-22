// backend/routes/gallery.ts
import { Router } from "express";
import multer from "multer";
import path from "path";
import { protect } from "../middleware/auth";
import Gallery from "../models/Gallery";

const router = Router();

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Save files in 'uploads' folder at project root
    cb(null, path.join(__dirname, "..", "..", "uploads"));
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "image-" + unique + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Upload image route
router.post("/", protect, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // Use BACKEND_URL from env or fallback to request host
    const BASE_URL =
      process.env.BACKEND_URL || `${req.protocol}://${req.get("host")}`;

    const imageUrl = `${BASE_URL}/uploads/${req.file.filename}`;

    const img = new Gallery({
      title: req.body.title || "Untitled",
      description: req.body.description || "",
      imageUrl,
    });

    await img.save();

    res.json({ message: "Uploaded successfully", image: img });
  } catch (error: any) {
    console.error("Upload error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all gallery images
router.get("/", async (_req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (error: any) {
    console.error("Fetch gallery error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
