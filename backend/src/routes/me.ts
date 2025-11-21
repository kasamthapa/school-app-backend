import { Router } from "express";
import { protect } from "../middleware/auth";

const router = Router();

router.get("/me", protect, (req, res) => {
  res.json({ user: (req as any).user });
});

export default router;
