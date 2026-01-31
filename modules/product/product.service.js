import Product from "./product.model.js";

export const createProduct = (data) => {
    return Product.create(data);
};

export const getAllProducts = (query = {}) => {
    const { category, shop, minPrice, maxPrice, search } = query;
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
        ];
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
