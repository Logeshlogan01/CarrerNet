import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    age: { type: Number },
    gender: { type: String },
    institution: { type: String },

    // ✅ Add these fields for AI recommendations
    skills: { type: [String], default: [] },
    interests: { type: [String], default: [] },
    completedCourses: { type: [String], default: [] },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
