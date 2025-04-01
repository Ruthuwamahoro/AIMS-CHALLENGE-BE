import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error("MONGODB_URI environment variable is not defined");
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB is successfully connected...");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }

  mongoose.connection.on("disconnected", () => {
    console.log("OOps! MongoDB disconnected...");
  });
};

export default connectDB;
