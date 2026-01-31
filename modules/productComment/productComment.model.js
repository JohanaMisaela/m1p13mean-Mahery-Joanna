import mongoose from "mongoose";

const productCommentSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        comment: { type: String, required: true },
        images: [{ type: String }],
        isVerifiedPurchase: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export default mongoose.model("ProductComment", productCommentSchema);
