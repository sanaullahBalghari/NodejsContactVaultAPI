import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },

     
  // ✨ User reference
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
