import mongoose from "mongoose";

const shopSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        logo: { type: String },
        slogan: { type: String },
        description: { type: String },
        owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        mallBoxNumber: { type: String, required: true },
        categories: [{ type: String }],
        phone: { type: String },
        email: { type: String },
        socialLinks: {
            facebook: { type: String },
            instagram: { type: String },
            tiktok: { type: String },
        },
        openingHours: { type: String },
        isActive: { type: Boolean, default: true },
        tags: [{ type: String }],
        favoritedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        gallery: [{ type: String }],
        averageRating: { type: Number, default: 0 },
        totalRatings: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export default mongoose.models.Shop || mongoose.model("Shop", shopSchema);
