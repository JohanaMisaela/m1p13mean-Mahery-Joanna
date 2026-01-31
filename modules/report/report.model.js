import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
    {
        reporter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        targetType: {
            type: String,
            enum: ["product", "shop"],
            required: true,
        },
        targetId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        reason: {
            type: String,
            enum: ["scam", "wrong_info", "prohibited", "other"],
            required: true,
        },
        description: {
            type: String,
        },
        status: {
            type: String,
            enum: ["pending", "resolved", "dismissed"],
            default: "pending",
        },
    },
    { timestamps: true }
);

export default mongoose.model("Report", reportSchema);
