import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  title: String,
  description: String,
  tags: [String],
});

const Item = mongoose.model("Item", itemSchema);

// ✅ Export default
export default Item;
