import mongoose from "mongoose";

const scholarshipSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // Scholarship name
    eligibility: { type: String, required: true },
    deadline: { type: Date, required: true },
    amount: { type: String }, // amount / perks
    description: { type: String },
    brochure: { type: String }, // file path for PDF/image
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Scholarship = mongoose.model("Scholarship", scholarshipSchema);

export default Scholarship;
