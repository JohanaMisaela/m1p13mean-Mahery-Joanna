import ShopRanking from "./shopRanking.model.js";
import Shop from "../shop/shop.model.js";

const updateShopAggregate = async (shopId) => {
    const ratings = await ShopRanking.find({ shop: shopId });
    const totalRatings = ratings.length;
    const averageRating = totalRatings > 0
        ? ratings.reduce((acc, curr) => acc + curr.rating, 0) / totalRatings
        : 0;

    await Shop.findByIdAndUpdate(shopId, { averageRating, totalRatings });
};

export const rateShop = async (userId, shopId, rating) => {
    const shop = await Shop.findById(shopId);
    if (!shop) throw new Error("Shop not found");

    await ShopRanking.findOneAndUpdate(
        { user: userId, shop: shopId },
        { rating },
        { upsert: true, new: true }
    );

    await updateShopAggregate(shopId);
    return { message: "Shop rated successfully" };
};

export const getUserRating = async (userId, shopId) => {
    return ShopRanking.findOne({ user: userId, shop: shopId });
};
