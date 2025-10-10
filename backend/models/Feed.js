// models/Feed.js
import mongoose from "mongoose";

const feedSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // link post to user
  },
  { timestamps: true }
);

const Feed = mongoose.model("Feed", feedSchema);
export default Feed;
