import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const mongoURI = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@ktabk.realcbv.mongodb.net/${process.env.DATABASE_NAME}`;
const mongoURILocal = `mongodb://localhost:27017/${process.env.DATABASE_NAME}`;
let isConnected = null;

export const dbConn = async () => {
  if (isConnected) {
    return isConnected;
  }

  try {
    const db = await mongoose.connect(mongoURI);
    isConnected = db.connection;
    console.log("✅ MongoDB Connected");
    return isConnected;
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw err;
  }
};
