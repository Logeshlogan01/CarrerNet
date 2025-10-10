import express from "express";
import Scholarship from "../models/Scholarship.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// 📂 File upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // make sure uploads/ exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ➕ Add Scholarship
router.post("/", upload.single("brochure"), async (req, res) => {
  try {
    const { title, eligibility, deadline, benefits, description } = req.body;

    const newScholarship = new Scholarship({
      title,
      eligibility,
      deadline,
       amount,
      description,
      brochure: req.file ? req.file.filename : null,
      createdBy: req.user?.id, // if auth middleware available
    });

    await newScholarship.save();
    res.status(201).json(newScholarship);
  } catch (error) {
    console.error("Error adding scholarship:", error);
    res.status(500).json({ error: "Failed to add scholarship" });
  }
});

// 📌 Get all scholarships
router.get("/", async (req, res) => {
  try {
    const scholarships = await Scholarship.find().sort({ createdAt: -1 });
    res.json(scholarships);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch scholarships" });
  }
});

export default router;
