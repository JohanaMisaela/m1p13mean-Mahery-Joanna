import mongoose from "mongoose";

const promotionSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        discountPercentage: { type: Number, required: true, min: 1, max: 100 },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        isActive: { type: Boolean, default: true },
        shop: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Shop",
            required: true,
        },
        products: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
        ],
    },
    { timestamps: true }
);

export default mongoose.model("Promotion", promotionSchema);
