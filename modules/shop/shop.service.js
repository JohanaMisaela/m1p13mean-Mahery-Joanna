import Shop from "./shop.model.js";

export const createShop = async (data) => {
    return await Shop.create(data);
};

export const getShops = async (filters = {}) => {
    return await Shop.find(filters).populate("owner", "name surname email").populate("favoritedBy", "name surname");
};

export const getShopById = async (id) => {
    return await Shop.findById(id).populate("owner", "name surname email").populate("favoritedBy", "name surname");
};

export const updateShop = async (id, data) => {
    return await Shop.findByIdAndUpdate(id, data, { new: true });
};

export const deleteShop = async (id) => {
    return await Shop.findByIdAndDelete(id);
};

export const addFavorite = async (shopId, userId) => {
    const shop = await Shop.findById(shopId);
    if (!shop.favoritedBy.some(id => id.toString() === userId.toString())) {
        shop.favoritedBy.push(userId);
        await shop.save();
    }
    return shop;
};

export const removeFavorite = async (shopId, userId) => {
    const shop = await Shop.findById(shopId);
    shop.favoritedBy = shop.favoritedBy.filter(id => id.toString() !== userId.toString());
    await shop.save();
    return shop;
};
