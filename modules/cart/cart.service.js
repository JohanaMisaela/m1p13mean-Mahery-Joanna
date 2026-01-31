import Cart from "./cart.model.js";
import Product from "../product/product.model.js";

export const getCartByUser = async (userId) => {
    let cart = await Cart.findOne({ user: userId })
        .populate("items.product");

    if (!cart) {
        cart = await Cart.create({ user: userId, items: [] });
    }

    return cart;
};

export const addToCart = async (userId, productId, quantity = 1) => {
    const product = await Product.findById(productId);
    if (!product) throw new Error("Product not found");

    const cart = await getCartByUser(userId);

    const item = cart.items.find(
        (i) => (i.product._id || i.product).toString() === productId
    );

    if (item) {
        item.quantity += quantity;
    } else {
        cart.items.push({ product: productId, quantity });
    }

    return cart.save();
};

export const updateQuantity = async (userId, productId, quantity) => {
    const cart = await getCartByUser(userId);

    const item = cart.items.find(
        (i) => (i.product._id || i.product).toString() === productId
    );

    if (!item) throw new Error("Item not found in cart");

    item.quantity = quantity;
    return cart.save();
};

export const removeFromCart = async (userId, productId) => {
    const cart = await getCartByUser(userId);

    cart.items = cart.items.filter(
        (i) => (i.product._id || i.product).toString() !== productId
    );

    return cart.save();
};

export const clearCart = async (userId) => {
    const cart = await getCartByUser(userId);
    cart.items = [];
    return cart.save();
};
