import Product from "./product.model.js";
import Promotion from "../promotion/promotion.model.js";

export const createProduct = (data) => {
    return Product.create(data);
};

export const getAllProducts = async (query = {}) => {
    const { category, shop, minPrice, maxPrice, search, isOnSale } = query;
    const filter = { isActive: true };

    if (category) filter.category = category;
    if (shop) filter.shop = shop;

    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { tags: { $in: [new RegExp(search, "i")] } },
        ];
    }

    if (isOnSale === "true") {
        const now = new Date();
        const activePromos = await Promotion.find({
            isActive: true,
            startDate: { $lte: now },
            endDate: { $gte: now }
        }).select("products");

        const promotedProductIds = activePromos.flatMap(p => p.products);
        filter._id = { $in: promotedProductIds };
    }

    return Product.find(filter)
        .populate("shop", "name")
        .populate("createdBy", "name surname");
};

export const getProductById = (id) => {
    return Product.findById(id)
        .populate("shop")
        .populate("createdBy", "name surname");
};

export const updateProduct = (id, data) => {
    return Product.findByIdAndUpdate(id, data, { new: true });
};

export const deleteProduct = (id) => {
    return Product.findByIdAndDelete(id);
};

export const setProductActive = (id, isActive) => {
    return Product.findByIdAndUpdate(id, { isActive }, { new: true });
};

export const toggleProductFavorite = (productId, userId, isFavorite) => {
    const update = isFavorite
        ? { $addToSet: { favoritedBy: userId } }
        : { $pull: { favoritedBy: userId } };
    return Product.findByIdAndUpdate(productId, update, { new: true });
};

export const getUserFavorites = (userId) => {
    return Product.find({ favoritedBy: userId, isActive: true })
        .populate("shop", "name")
        .sort({ createdAt: -1 });
};
