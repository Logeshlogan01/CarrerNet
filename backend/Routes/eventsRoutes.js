import express from "express";
import multer from "multer";
import Event from "../models/Event.js";

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // save to "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ✅ Create new event with brochure
router.post("/", upload.single("brochure"), async (req, res) => {
  try {
    const { title, date, location, description } = req.body;

    const event = new Event({
      title,
      date,
      location,
      description,
      brochure: req.file ? req.file.path : null, // save path
    });

    await event.save();
    res.json({ event });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// ✅ Get all events
router.get("/", async (req, res) => {
  const events = await Event.find();
  res.json(events);
});

export default router;
