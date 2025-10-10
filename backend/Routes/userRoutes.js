import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

/* ==========================
   SIGNUP (Updated)
========================== */
router.post("/signup", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      age,
      gender,
      institution,
      skills,
      interests,
      completedCourses,
    } = req.body;

    // 🔍 Check if user already exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    // 🔑 Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Include the array fields
    user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      age,
      gender,
      institution,
      skills: skills || [],
      interests: interests || [],
      completedCourses: completedCourses || [],
    });

    await user.save();

    // 🔐 Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // ✅ Respond with token and user data (include arrays)
    res.status(201).json({
      msg: "✅ User registered successfully",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        age: user.age,
        gender: user.gender,
        institution: user.institution,
        skills: user.skills,
        interests: user.interests,
        completedCourses: user.completedCourses,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});


/* ==========================
   LOGIN
========================== */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔍 Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    // 🔐 Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    // 🔐 Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // ✅ Respond with token and user info
    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        age: user.age,
        gender: user.gender,
        institution: user.institution,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* ==========================
   GET USER PROFILE
========================== */
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password"); // Don’t return password
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("Fetch profile error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* ==========================
   UPDATE PROFILE
========================== */
router.put("/:id", async (req, res) => {
  try {
    const { name, email, phone, age, gender, institution } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, age, gender, institution },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ msg: "User not found" });

    res.json(updatedUser);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/* ==========================
   RESET PASSWORD
========================== */
router.put("/:id/reset-password", async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    // 🔐 Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ msg: "Current password is incorrect" });

    // 🔑 Hash new password and save
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ msg: "✅ Password updated successfully" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
