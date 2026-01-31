import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        type: { type: String, enum: ["product", "shop"], required: true },
        icon: { type: String },
    },
    { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
