import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

import User from "../src/models/user.model.js";

dotenv.config();

const resetPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const email = "aamit2@gmail.com";
    const newPassword = "Admin@123";

    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ User not found");
      process.exit(1);
    }

    user.password = newPassword;
    await user.save();

    console.log("✅ Password reset successfully!");
    console.log("Email:", email);
    console.log("New Password:", newPassword);

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

resetPassword();