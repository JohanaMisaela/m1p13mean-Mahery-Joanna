import ProductVariant from "./productVariant.model.js";

export const createVariant = (productId, data) => {
    return ProductVariant.create({ ...data, product: productId });
};

export const updateVariant = (variantId, data) => {
    return ProductVariant.findByIdAndUpdate(variantId, data, { new: true });
};

export const deleteVariant = (variantId) => {
    return ProductVariant.findByIdAndUpdate(variantId, { isActive: false }, { new: true });
};

export const getVariantById = (variantId) => {
    return ProductVariant.findById(variantId).populate("product");
};

export const getVariantsByProduct = (productId, query = { isActive: true }) => {
    return ProductVariant.find({ product: productId, ...query }).lean();
};
