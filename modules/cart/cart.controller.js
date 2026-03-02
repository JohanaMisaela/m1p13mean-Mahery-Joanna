import * as cartService from "./cart.service.js";
import asyncHandler from "../../core/utils/asyncHandler.js";

export const getMyCart = asyncHandler(async (req, res) => {
  const cart = await cartService.getCartByUser(req.user._id);
  res.json(cart);
});

export const addItem = asyncHandler(async (req, res) => {
  const { productId, variantId, quantity, promotionId } = req.body;

  const cart = await cartService.addToCart(
    req.user._id,
    productId,
    variantId,
    quantity || 1,
    promotionId,
  );

  res.json(cart);
});

export const updateItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const { productId } = req.params;
  const { variantId } = req.query;

  const cart = await cartService.updateQuantity(
    req.user._id,
    productId,
    variantId,
    quantity,
  );

  res.json(cart);
});

export const removeItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { variantId } = req.query;

  const cart = await cartService.removeFromCart(
    req.user._id,
    productId,
    variantId,
  );

  res.json(cart);
});

export const clearCart = asyncHandler(async (req, res) => {
  const cart = await cartService.clearCart(req.user._id);
  res.json(cart);
});
