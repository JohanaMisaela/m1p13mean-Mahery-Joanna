import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        price: { type: Number, required: true },
        stock: { type: Number, default: 0 },

        images: [{ type: String }],

        category: { type: String },
        tags: [{ type: String }],

        shop: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Shop",
            required: true,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.model("Product", productSchema);
