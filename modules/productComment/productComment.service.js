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

export const getComments = async (productId, query = {}) => {
    const { page = 1, limit = 50 } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const filter = { product: productId };

    const total = await ProductComment.countDocuments(filter);
    const data = await ProductComment.find(filter)
        .populate("user", "name surname")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

    return { data, total };
};

export const updateComment = async (commentId, userId, data) => {
    const comment = await ProductComment.findById(commentId);
    if (!comment) throw new Error("Commentaire non trouvé");

    if (comment.user.toString() !== userId.toString()) {
        throw new Error("Action non autorisée");
    }

    return ProductComment.findByIdAndUpdate(commentId, data, { new: true });
};

export const deleteComment = async (commentId, userId) => {
    const comment = await ProductComment.findById(commentId);
    if (!comment) throw new Error("Commentaire non trouvé");

    if (comment.user.toString() !== userId.toString()) {
        throw new Error("Action non autorisée");
    }

    return ProductComment.findByIdAndDelete(commentId);
};
