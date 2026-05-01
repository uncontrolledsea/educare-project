const mongoose = require("mongoose");

const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://shuham:shubham123@cluster0.edrt2ka.mongodb.net/gamifiedDB";
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("MongoDB Error:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
