import Cart from "./cart.model.js";
import Product from "../product/product.model.js";
import ProductVariant from "../productVariant/productVariant.model.js";

export const getCartByUser = async (userId) => {
    let cart = await Cart.findOne({ user: userId })
        .populate("items.product")
        .populate("items.variant")
        .populate("items.promotion");

    if (!cart) {
        cart = await Cart.create({ user: userId, items: [] });
    }

    return cart;
};

export const addToCart = async (userId, productId, variantId = null, quantity = 1, promotionId = null) => {
    const product = await Product.findById(productId);
    if (!product) throw new Error("Product not found");

    if (variantId) {
        const variant = await ProductVariant.findById(variantId);
        if (!variant) throw new Error("Variant not found");
        if (variant.product.toString() !== productId) {
            throw new Error("Variant does not belong to this product");
        }
    }

    const cart = await getCartByUser(userId);

    // Find item matching both product AND variant
    const item = cart.items.find((i) => {
        const pMatch = (i.product._id || i.product).toString() === productId;
        const vMatch = variantId
            ? (i.variant?._id || i.variant)?.toString() === variantId.toString()
            : !i.variant;
        return pMatch && vMatch;
    });

    if (item) {
        item.quantity += quantity;
        if (promotionId) item.promotion = promotionId; // Update promotion if provided
    } else {
        cart.items.push({ product: productId, variant: variantId, quantity, promotion: promotionId });
    }

    return cart.save();
};

export const updateQuantity = async (userId, productId, variantId, quantity) => {
    const cart = await getCartByUser(userId);

    const item = cart.items.find((i) => {
        const pMatch = (i.product._id || i.product).toString() === productId;
        const vMatch = variantId
            ? (i.variant?._id || i.variant)?.toString() === variantId.toString()
            : !i.variant;
        return pMatch && vMatch;
    });

    if (!item) throw new Error("Item not found in cart");

    item.quantity = quantity;
    return cart.save();
};

export const removeFromCart = async (userId, productId, variantId) => {
    const cart = await getCartByUser(userId);

    cart.items = cart.items.filter((i) => {
        const pMatch = (i.product._id || i.product).toString() === productId;
        const vMatch = variantId
            ? (i.variant?._id || i.variant)?.toString() === variantId.toString()
            : !i.variant;
        return !(pMatch && vMatch);
    });

    return cart.save();
};

export const clearCart = async (userId) => {
    const cart = await getCartByUser(userId);
    cart.items = [];
    return cart.save();
};
