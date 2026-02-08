import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        price: { type: Number, required: true },
        stock: { type: Number, default: 0 },
        images: [{ type: String }],

        categories: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        }],
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
        favoritedBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        averageRating: { type: Number, default: 0 },
        totalRatings: { type: Number, default: 0 },

        // Configuration for variants (e.g., { "color": ["Red", "Blue"], "size": ["42", "43"] })
        attributeConfig: {
            type: Map,
            of: [String],
            default: {},
        },
    },
    { timestamps: true }
);

export default mongoose.model("Product", productSchema);
