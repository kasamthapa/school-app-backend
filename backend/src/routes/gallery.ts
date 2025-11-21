// backend/routes/gallery.ts
import { Router } from "express";
import multer from "multer";
import path from "path";
import { protect } from "../middleware/auth";
import Gallery from "../models/Gallery";

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "image-" + unique + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post("/", protect, upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file" });

  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
    req.file.filename
  }`;

  const img = new Gallery({
    title: req.body.title || "Untitled",
    description: req.body.description || "",
    imageUrl,
  });
  await img.save();

  res.json({ message: "Uploaded", image: img });
});

// THIS LINE WAS MISSING — ADD IT
router.get("/", async (req, res) => {
  const images = await Gallery.find().sort({ createdAt: -1 });
  res.json(images);
});

export default router;
