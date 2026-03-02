import Promotion from "./promotion.model.js";
import Order from "../order/order.model.js";

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
    .limit(Number(limit))
    .lean();

  // Check if each promotion is used in orders
  for (const promo of data) {
    const orderCount = await Order.countDocuments({
      "items.promotion": promo._id,
    });
    promo.isLocked = orderCount > 0;
  }

  return { data, total };
};

export const updatePromotion = async (id, data) => {
  const isLocked = await Order.exists({ "items.promotion": id });
  if (isLocked) {
    const promo = await Promotion.findById(id);
    if (
      data.discountPercentage !== undefined &&
      data.discountPercentage !== promo.discountPercentage
    ) {
      throw new Error(
        "Cannot change discount percentage of a promotion already in use by orders",
      );
    }
  }
  return Promotion.findByIdAndUpdate(id, data, { new: true });
};

export const addProductsToPromotion = async (promotionId, productIds) => {
  return Promotion.findByIdAndUpdate(
    promotionId,
    { $addToSet: { products: { $each: productIds } } },
    { new: true },
  );
};

export const removeProductsFromPromotion = async (promotionId, productIds) => {
  const isLocked = await Order.exists({ "items.promotion": promotionId });
  if (isLocked) {
    throw new Error(
      "Cannot remove products from a promotion already in use by orders",
    );
  }
  return Promotion.findByIdAndUpdate(
    promotionId,
    { $pull: { products: { $in: productIds } } },
    { new: true },
  );
};

// Helper to find an active promotion for a product or variant
export const getActiveProductPromotion = async (itemId) => {
  const now = new Date();
  return Promotion.findOne({
    products: itemId,
    isActive: true,
    startDate: { $lte: now },
    endDate: { $gte: now },
  });
};
