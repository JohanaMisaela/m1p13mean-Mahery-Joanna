import Order from "./order.model.js";
import Product from "../product/product.model.js";
import { getActiveProductPromotion } from "../promotion/promotion.service.js";

export const createOrder = async (userId, shopId, items, addressId) => {
    if (!items || items.length === 0) {
        throw new Error("Order must contain items");
    }

    let total = 0;
    const orderItems = [];

    for (const item of items) {
        const product = await Product.findById(item.productId);
        if (!product) throw new Error(`Product ${item.productId} not found`);

        if (product.stock < item.quantity) {
            throw new Error(`Not enough stock for ${product.name}`);
        }

        // Check for active promotion
        const promotion = await getActiveProductPromotion(product._id);
        let finalPrice = product.price;
        let appliedPromoId = null;

        if (promotion) {
            finalPrice = product.price * (1 - promotion.discountPercentage / 100);
            appliedPromoId = promotion._id;
        }

        total += finalPrice * item.quantity;

        orderItems.push({
            product: product._id,
            quantity: item.quantity,
            price: finalPrice,
            originalPrice: product.price,
            promotion: appliedPromoId,
        });
    }

    return Order.create({
        user: userId,
        shop: shopId,
        items: orderItems,
        totalAmount: total,
        shippingAddress: addressId,
        status: "PENDING"
    });
};

export const getOrdersByUser = async (userId, query = {}) => {
    const { page = 1, limit = 50 } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const filter = { user: userId };

    const total = await Order.countDocuments(filter);
    const data = await Order.find(filter)
        .populate("items.product")
        .populate("shop")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

    return { data, total };
};

export const getOrdersByShop = async (shopId, query = {}) => {
    const { page = 1, limit = 50 } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const filter = { shop: shopId };

    const total = await Order.countDocuments(filter);
    const data = await Order.find(filter)
        .populate("items.product")
        .populate("user")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

    return { data, total };
};

export const updateOrderStatus = async (orderId, newStatus) => {
    const order = await Order.findById(orderId);
    if (!order) throw new Error("Order not found");

    const oldStatus = order.status;

    // RULE: Only PENDING orders can be cancelled
    if (newStatus === "CANCELLED" && oldStatus !== "PENDING") {
        throw new Error("Only pending orders can be cancelled");
    }

    // RULE: Deduct stock only on CONFIRMED from PENDING
    if (newStatus === "CONFIRMED" && oldStatus === "PENDING") {
        for (const item of order.items) {
            const product = await Product.findById(item.product);
            if (!product) throw new Error(`Product ${item.product} not found`);

            if (product.stock < item.quantity) {
                throw new Error(`Not enough stock for ${product.name} to confirm order`);
            }

            product.stock -= item.quantity;
            await product.save();
        }
    }

    order.status = newStatus;
    return order.save();
};

export const getOrderById = (id) => {
    return Order.findById(id);
};
