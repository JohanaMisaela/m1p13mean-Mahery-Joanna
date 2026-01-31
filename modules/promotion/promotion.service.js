import Promotion from "./promotion.model.js";

export const createPromotion = async (data) => {
    return Promotion.create(data);
};

export const getPromotionById = async (id) => {
    return Promotion.findById(id).populate("products");
};

export const getShopPromotions = async (shopId, query = {}) => {
    const { page = 1, limit = 50 } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const filter = { shop: shopId };

    const total = await Promotion.countDocuments(filter);
    const data = await Promotion.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

    return { data, total };
};

export const updatePromotion = async (id, data) => {
    return Promotion.findByIdAndUpdate(id, data, { new: true });
};

export const addProductsToPromotion = async (promotionId, productIds) => {
    return Promotion.findByIdAndUpdate(
        promotionId,
        { $addToSet: { products: { $each: productIds } } },
        { new: true }
    );
};

export const removeProductsFromPromotion = async (promotionId, productIds) => {
    return Promotion.findByIdAndUpdate(
        promotionId,
        { $pull: { products: { $in: productIds } } },
        { new: true }
    );
};

// Helper to find an active promotion for a product
export const getActiveProductPromotion = async (productId) => {
    const now = new Date();
    return Promotion.findOne({
        products: productId,
        isActive: true,
        startDate: { $lte: now },
        endDate: { $gte: now }
    });
};
