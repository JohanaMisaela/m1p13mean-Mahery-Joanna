import Product from "./product.model.js";
import * as productVariantService from "../productVariant/productVariant.service.js";
import Promotion from "../promotion/promotion.model.js";
import Report from "../report/report.model.js";

export const createProduct = (data) => {
    return Product.create(data);
};

export const getAllProducts = async (query = {}) => {
    const { category, shop, minPrice, maxPrice, search, isOnSale, page = 1, limit = 50, isActive } = query;
    const filter = {};

    if (isActive !== undefined) {
        if (isActive !== "all") {
            filter.isActive = isActive === "true" || isActive === true;
        }
    } else {
        filter.isActive = true;
    }

    if (category) {
        filter.$or = [
            { category: category },
            { categories: { $in: [category] } }
        ];
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

        const promotedProductIds = activePromos.flatMap(p => p.products || []);
        filter._id = { $in: promotedProductIds };
    } else if (isOnSale === "false") {
        const now = new Date();
        const activePromos = await Promotion.find({
            isActive: true,
            startDate: { $lte: now },
            endDate: { $gte: now }
        }).select("products");

        const promotedProductIds = activePromos.flatMap(p => p.products || []);
        filter._id = { $nin: promotedProductIds };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(filter);

    const products = await Product.find(filter)
        .populate({ path: "shop", select: "name owner" })
        .populate("createdBy", "name surname")
        .populate("categories")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean();

    // Population of variants and report count for each product
    const productsWithVariantsAndReports = await Promise.all(products.map(async (p) => {
        const variantQuery = isActive === "all" ? {} : { isActive: true };
        const variants = await productVariantService.getVariantsByProduct(p._id, variantQuery);
        const reportCount = await Report.countDocuments({ targetId: p._id, targetType: 'product' });
        return { ...p, variants, reportCount };
    }));

    const now = new Date();
    const activePromos = await Promotion.find({
        isActive: true,
        startDate: { $lte: now },
        endDate: { $gte: now }
    }).lean();

    const data = productsWithVariantsAndReports.map(product => {
        const promo = activePromos.find(p =>
            p.products?.some(id => id.toString() === product._id.toString())
        );

        // Use first variant for representative data if root is empty
        const firstVariant = product.variants?.[0];

        return {
            ...product,
            price: product.price || firstVariant?.price || 0,
            stock: product.stock || product.variants?.reduce((acc, v) => acc + v.stock, 0) || 0,
            images: (product.images && product.images.length > 0) ? product.images : (firstVariant?.images || []),
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
        .populate({ path: "shop", select: "name owner" })
        .populate("createdBy", "name surname")
        .populate("categories")
        .lean();

    if (!product) return null;

    // For single product, we often want all variants in admin/owner mode
    // but the service generally defaults to active. 
    // Let's make it smarter: if this is used for shop management, we might want all.
    // However, the current callers of getProductById don't pass an isActive flag.
    // Let's allow getProductById to accept a query param if needed.
    const variants = await productVariantService.getVariantsByProduct(id, {}); // Default to all for detail view for now to be safe, or we can keep it active-only.

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
    return Product.findByIdAndUpdate(id, data, { new: true }).populate("categories");
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

export const getUserFavorites = async (userId, query = {}) => {
    const { page = 1, limit = 50 } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const filter = { favoritedBy: userId, isActive: true };

    const total = await Product.countDocuments(filter);
    const data = await Product.find(filter)
        .populate({ path: "shop", select: "name owner" })
        .populate("categories")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean();

    // Map promotions if needed, similar to getAllProducts
    const now = new Date();
    const activePromos = await Promotion.find({
        isActive: true,
        startDate: { $lte: now },
        endDate: { $gte: now }
    }).select("products name discountPercentage endDate").lean();

    const enrichedData = data.map(product => {
        const promo = activePromos.find(p =>
            p.products?.some(id => id.toString() === product._id.toString())
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

    return { data: enrichedData, total };
};
