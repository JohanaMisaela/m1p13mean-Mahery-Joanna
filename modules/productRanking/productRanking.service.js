import ProductRanking from "./productRanking.model.js";
import Product from "../product/product.model.js";

const updateProductAggregate = async (productId) => {
    const ratings = await ProductRanking.find({ product: productId });
    const totalRatings = ratings.length;
    const averageRating = totalRatings > 0
        ? ratings.reduce((acc, curr) => acc + curr.rating, 0) / totalRatings
        : 0;

    await Product.findByIdAndUpdate(productId, { averageRating, totalRatings });
};

export const rateProduct = async (userId, productId, rating) => {
    const product = await Product.findById(productId);
    if (!product) throw new Error("Product not found");

    await ProductRanking.findOneAndUpdate(
        { user: userId, product: productId },
        { rating },
        { upsert: true, new: true }
    );

    await updateProductAggregate(productId);
    return { message: "Product rated successfully" };
};

export const getUserRating = async (userId, productId) => {
    return ProductRanking.findOne({ user: userId, product: productId });
};
