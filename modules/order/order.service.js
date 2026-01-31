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
        if (!product) throw new Error("Product not found");

        if (product.stock < item.quantity) {
            throw new Error("Not enough stock");
        }

        total += product.price * item.quantity;

        orderItems.push({
            product: product._id,
            quantity: item.quantity,
            price: product.price,
        });

        product.stock -= item.quantity;
        await product.save();
    }

    return Order.create({
        user: userId,
        shop: shopId,
        items: orderItems,
        totalAmount: total,
        shippingAddress: addressId,
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

export const updateOrderStatus = (orderId, status) => {
    return Order.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
    );
};
