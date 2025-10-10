// routes/recommendations.js
import express from "express";
import User from "../models/User.js";
import Item from "../models/Item.js";

const router = express.Router();

// GET Recommendations for a user
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const items = await Item.find();

    // Simple content-based recommendation
    const recommended = items.filter(item =>
      item.tags.some(tag =>
        user.skills.includes(tag) || user.interests.includes(tag)
      )
    );

    res.json(recommended);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
