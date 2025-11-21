import { Router } from "express";
import { protect } from "../middleware/auth";
import Notice from "../models/Notice";

const router = Router();

// GET all notices (public)
router.get("/", async (_req, res) => {
  const notices = await Notice.find().sort({ timestamp: -1 });
  res.json(notices);
});

// Protected routes below
router.use(protect);

router.post("/", async (req, res) => {
  const notice = new Notice(req.body);
  await notice.save();
  res.status(201).json(notice);
});

router.delete("/:id", async (req, res) => {
  await Notice.findByIdAndDelete(req.params.id);
  res.json({ message: "Notice deleted" });
});

export default router;
