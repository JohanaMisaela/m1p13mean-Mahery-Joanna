import Order from "./order.model.js";
import Product from "../product/product.model.js";
import ProductVariant from "../productVariant/productVariant.model.js";
import { getActiveProductPromotion } from "../promotion/promotion.service.js";

export const createOrder = async (userId, shopId, items, addressId) => {
    if (!items || items.length === 0) {
        throw new Error("Order must contain items");
    }

    let total = 0;
    const orderItems = [];

    for (const item of items) {
        const product = await Product.findById(item.product); // Changed from productId to product to match model
        if (!product) throw new Error(`Product ${item.product} not found`);

        let variant = null;
        if (item.variant) {
            variant = await ProductVariant.findById(item.variant);
            if (!variant) throw new Error(`Variant ${item.variant} not found`);
            if (variant.product.toString() !== product._id.toString()) {
                throw new Error(`Variant ${item.variant} does not belong to product ${product._id}`);
            }
        }

        // PRICE & STOCK: Solely from variant if product fields are empty/deleted
        const stockToCheck = variant ? variant.stock : (product.stock || 0);
        const basePrice = variant ? variant.price : (product.price || 0);

        if (stockToCheck < item.quantity) {
            throw new Error(`Not enough stock for ${product.name}${variant ? ' (Variant)' : ''}`);
        }

        if (basePrice <= 0 && !variant) {
            throw new Error(`Product ${product.name} must have a variant selected for pricing`);
        }

        // Check for active promotion
        const promotion = await getActiveProductPromotion(product._id);
        let finalPrice = basePrice;
        let appliedPromoId = null;

        if (promotion) {
            finalPrice = basePrice * (1 - promotion.discountPercentage / 100);
            appliedPromoId = promotion._id;
        }

        total += finalPrice * item.quantity;

        orderItems.push({
            product: product._id,
            variant: variant ? variant._id : null,
            quantity: item.quantity,
            price: finalPrice,
            originalPrice: basePrice,
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
        .populate("items.variant")
        .populate("shop")
        .populate("shippingAddress")
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
        .populate("items.variant")
        .populate("user")
        .populate("shippingAddress")
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
            if (item.variant) {
                const variantFound = await ProductVariant.findById(item.variant);
                if (!variantFound || variantFound.product.toString() !== item.product.toString()) {
                    throw new Error("Invalid variant for product");
                }
                if (variantFound.stock < item.quantity) {
                    throw new Error(`Insufficient stock for variant ${variantFound.sku || item.variant}`);
                }

                // Deduct stock for variant
                variantFound.stock -= item.quantity;
                await variantFound.save();
            } else {
                const productFound = await Product.findById(item.product);
                if (!productFound) throw new Error(`Product ${item.product} not found`);

                if (productFound.stock < item.quantity) {
                    throw new Error(`Insufficient stock for product ${productFound.name}`);
                }

                // Deduct stock for product
                productFound.stock -= item.quantity;
                await productFound.save();
            }
        }
    }

    order.status = newStatus;
    return order.save();
};

export const getOrderById = (id) => {
    return Order.findById(id);
};
