import { Schema, model } from "mongoose";

interface INotice {
  title: string;
  content: string;
  date: string;
  timestamp?: number;
}

const noticeSchema = new Schema<INotice>({
  title: { type: String, required: [true, "Title is required"] },
  content: { type: String, required: [true, "Content is required"] },
  date: { type: String, required: [true, "Date is required"] },
  timestamp: { type: Number, default: Date.now },
});

export default model("Notice", noticeSchema);
