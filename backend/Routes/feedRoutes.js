import express from "express";
import Feed from "../models/Feed.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 📌 Get all feeds
router.get("/", async (req, res) => {
  try {
    const feeds = await Feed.find()
      .populate("createdBy", "name email") // show user info
      .sort({ createdAt: -1 });

    res.json(feeds);
  } catch (err) {
    console.error("Error fetching feeds:", err);
    res.status(500).json({ msg: "Failed to fetch feeds" });
  }
});

// ➕ Create new feed
router.post("/", protect, async (req, res) => {
  try {
    const { name, title, content } = req.body;

    // Validate input fields
    if (!name || !title || !content) {
      return res.status(400).json({ msg: "Missing fields" });
    }

    if (title.length > 100) {
      return res.status(400).json({ msg: "Title too long" });
    }

    const feed = new Feed({
      name,
      title,
      content,
      createdBy: req.user,
    });

    await feed.save();
    res.status(201).json(feed);
  } catch (err) {
    console.error("Error creating feed:", err);
    res.status(500).json({ msg: "Failed to create feed" });
  }
});

export default router;
