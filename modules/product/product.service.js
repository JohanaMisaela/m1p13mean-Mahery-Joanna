import Product from "./product.model.js";
import * as productVariantService from "../productVariant/productVariant.service.js";
import Promotion from "../promotion/promotion.model.js";

export const createProduct = (data) => {
    return Product.create(data);
};

export const getAllProducts = async (query = {}) => {
    const { category, shop, minPrice, maxPrice, search, isOnSale, page = 1, limit = 50, isActive } = query;
    const filter = {};

    if (category) {
        filter.category = category;
    }
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
        }).select("products name discountPercentage");

        const promotedProductIds = activePromos.flatMap(p => p.products);
        filter._id = { $in: promotedProductIds };
    } else if (isOnSale === "false") {
        const now = new Date();
        const activePromos = await Promotion.find({
            isActive: true,
            startDate: { $lte: now },
            endDate: { $gte: now }
        }).select("products");

        const promotedProductIds = activePromos.flatMap(p => p.products);
        filter._id = { $nin: promotedProductIds };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(filter);

    const products = await Product.find(filter)
        .populate("shop", "name")
        .populate("createdBy", "name surname")
        .populate("category")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean();

    const now = new Date();
    const activePromos = await Promotion.find({
        isActive: true,
        startDate: { $lte: now },
        endDate: { $gte: now }
    }).lean();

    const data = products.map(product => {
        const promo = activePromos.find(p =>
            p.products.some(id => id.toString() === product._id.toString())
        );
        return {
            ...product,
            activePromotion: promo ? {
                name: promo.name,
                discountPercentage: promo.discountPercentage,
                endDate: promo.endDate
            } : null,
            isOnSale: !!promo
        };
    });

    return { data, total };
};

export const getProductById = async (id) => {
    const product = await Product.findById(id)
        .populate("shop", "name")
        .populate("createdBy", "name surname")
        .populate("category")
        .lean();

    if (!product) return null;

    const variants = await productVariantService.getVariantsByProduct(id);

    const now = new Date();
    const promo = await Promotion.findOne({
        isActive: true,
        startDate: { $lte: now },
        endDate: { $gte: now },
        products: product._id
    }).lean();

    return {
        ...product,
        variants,
        activePromotion: promo ? {
            name: promo.name,
            discountPercentage: promo.discountPercentage,
            endDate: promo.endDate
        } : null,
        isOnSale: !!promo
    };
};

export const updateProduct = (id, data) => {
    return Product.findByIdAndUpdate(id, data, { new: true }).populate("category");
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
