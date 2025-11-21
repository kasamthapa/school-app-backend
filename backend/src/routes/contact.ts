// backend/routes/contact.ts   ← CREATE THIS FILE
import { Router } from "express";
import Contact from "../models/Contact";

const router = Router();

// POST - Save contact message
router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    const newContact = new Contact({
      name,
      email,
      subject,
      message,
    });

    await newContact.save();
    res
      .status(201)
      .json({ success: true, message: "सन्देश सफलतापूर्वक पठाइयो!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "सर्भरमा समस्या भयो" });
  }
});

// GET - For admin to see all messages
router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json([]);
  }
});

export default router;
