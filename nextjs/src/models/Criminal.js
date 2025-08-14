import mongoose from "mongoose";

const CriminalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  crimes: [{ type: String, required: true }],
  threat: { type: String, enum: ["low", "medium", "high"], default: "low" },
  status: { type: String, enum: ["wanted", "apprehended"], default: "wanted" },
  image: { type: String, required: true }, // Base64 image string
  last_seen_date: { type: Date, default: null },
  last_seen_location: { type: String, default: "Unknown" },
}, { timestamps: true });

export default mongoose.models.Criminal || mongoose.model("Criminal", CriminalSchema);
