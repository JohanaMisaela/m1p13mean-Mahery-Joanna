import Shop from "./shop.model.js";

export const createShop = async (data) => {
    return await Shop.create(data);
};

export const getShops = async (filters = {}, query = {}) => {
    const { search, category, page = 1, limit = 50 } = query;
    const finalFilter = { ...filters };

    if (category) {
        finalFilter.categories = category;
    }

    if (search) {
        finalFilter.$or = [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { tags: { $in: [new RegExp(search, "i")] } },
        ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Shop.countDocuments(finalFilter);

    const data = await Shop.find(finalFilter)
        .populate("owner", "name surname email")
        .populate("categories")
        .populate("favoritedBy", "name surname")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

    return { data, total };
};

export const getShopById = async (id) => {
    return await Shop.findById(id)
        .populate("owner", "name surname email")
        .populate("categories")
        .populate("favoritedBy", "name surname");
};

export const updateShop = async (id, data) => {
    return await Shop.findByIdAndUpdate(id, data, { new: true }).populate("categories");
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

export const getShopByOwner = async (ownerId) => {
    return await Shop.findOne({ owner: ownerId });
};

export const getUserFavorites = async (userId) => {
    return await Shop.find({ favoritedBy: userId, isActive: true }).sort({ createdAt: -1 });
};
