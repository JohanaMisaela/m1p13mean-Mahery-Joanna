import ProductComment from "./productComment.model.js";
import Product from "../product/product.model.js";
import Order from "../order/order.model.js";

export const addComment = async (userId, productId, data) => {
    const product = await Product.findById(productId);
    if (!product) throw new Error("Product not found");

    const order = await Order.findOne({
        user: userId,
        "items.product": productId,
        status: { $in: ["CONFIRMED", "SHIPPED"] }
    });

    return ProductComment.create({
        user: userId,
        product: productId,
        ...data,
        isVerifiedPurchase: !!order
    });
};

export const getComments = async (productId) => {
    return ProductComment.find({ product: productId })
        .populate("user", "name surname")
        .sort({ createdAt: -1 });
};
