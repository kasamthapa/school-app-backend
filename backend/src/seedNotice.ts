import { connectDB } from "./config/db";
import Notice from "./models/Notice";
import dotenv from "dotenv";

dotenv.config();
connectDB();

const run = async () => {
  const notice = new Notice({
    title: "Happy New Year",
    content: "We wish a great and joyful happy new Year!!",
    date: "2082-07-29",
  });

  await notice.save();
  console.log("Notice saved succesfully");
  process.exit();
};

run();
