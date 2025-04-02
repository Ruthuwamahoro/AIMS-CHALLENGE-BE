import mongoose from "mongoose";
import User from "../models/user.model";
import { RoleType } from "../models/role.model";
import bcrypt from "bcryptjs";

const seedAdmin = async () => {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ email: "admin@example.com" });

    if (adminExists) {
      console.log("Admin user already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const adminUser = new User({
      username: "admin",
      email: "admin@example.com",
      gender: "other",
      telephone: "+250780000000",
      password: hashedPassword,
      role: RoleType.ADMIN,
    });

    await adminUser.save();
    console.log("Admin user created successfully");
  } catch (error) {
    console.error("Error seeding admin user:", error);
  }
};

seedAdmin();
