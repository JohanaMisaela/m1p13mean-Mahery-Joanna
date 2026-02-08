import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        attributes: {
            type: Map,
            of: String,
        },
        price: {
            type: Number,
            required: true,
        },
        stock: {
            type: Number,
            default: 0,
        },
        sku: {
            type: String,
            unique: true,
            sparse: true,
        },
        images: [{ type: String }],
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.model("ProductVariant", variantSchema);
