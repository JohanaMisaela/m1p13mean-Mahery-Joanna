import Product from "./product.model.js";

export const createProduct = (data) => {
    return Product.create(data);
};

export const getAllProducts = (filter = {}) => {
    return Product.find({ isActive: true, ...filter })
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
