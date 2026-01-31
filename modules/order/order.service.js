import Order from "./order.model.js";
import Product from "../product/product.model.js";

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

        total += product.price * item.quantity;

        orderItems.push({
            product: product._id,
            quantity: item.quantity,
            price: product.price,
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

export const getOrdersByUser = (userId) => {
    return Order.find({ user: userId })
        .populate("items.product")
        .populate("shop")
        .sort({ createdAt: -1 });
};

export const getOrdersByShop = (shopId) => {
    return Order.find({ shop: shopId })
        .populate("items.product")
        .populate("user")
        .sort({ createdAt: -1 });
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
