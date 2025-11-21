import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import authRouter from "./routes/auth";
import noticeRouter from "./routes/notices";
import galleryRouter from "./routes/gallery";
import contactRouter from "./routes/contact";
import meRouter from "./routes/me";
connectDB();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(require("cookie-parser")());
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRouter);
app.use("/api/notices", noticeRouter);
app.use("/api/auth", meRouter);
app.use("/api/gallery", galleryRouter);
app.use("/api/contact", contactRouter);

app.get("/", (req, res) => {
  res.send("School API Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
