import * as productVariantService from "./productVariant.service.js";
import * as productService from "../product/product.service.js";
import * as shopService from "../shop/shop.service.js";
import asyncHandler from "../../core/utils/asyncHandler.js";

export const create = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const product = await productService.getProductById(productId);

    if (!product) return res.status(404).json({ message: "Product not found" });

    const isProductOwner = product.createdBy._id.toString() === req.user._id.toString();
    const shop = await shopService.getShopById(product.shop._id);
    const isRealShopOwner = shop?.owner?._id?.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isProductOwner && !isRealShopOwner && !isAdmin) {
        return res.status(403).json({ message: "Forbidden" });
    }

    const variant = await productVariantService.createVariant(productId, req.body);
    res.status(201).json(variant);
});

export const update = asyncHandler(async (req, res) => {
    const { variantId } = req.params;
    const variant = await productVariantService.getVariantById(variantId);
    if (!variant) return res.status(404).json({ message: "Variant not found" });

    const product = variant.product;
    const shop = await shopService.getShopById(product.shop);

    const isProductOwner = product.createdBy.toString() === req.user._id.toString();
    const isShopOwner = shop?.owner?.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isProductOwner && !isShopOwner && !isAdmin) {
        return res.status(403).json({ message: "Forbidden" });
    }

    const updated = await productVariantService.updateVariant(variantId, req.body);
    res.json(updated);
});

export const remove = asyncHandler(async (req, res) => {
    const { variantId } = req.params;
    const variant = await productVariantService.getVariantById(variantId);
    if (!variant) return res.status(404).json({ message: "Variant not found" });

    const product = variant.product;
    const shop = await shopService.getShopById(product.shop);

    const isProductOwner = product.createdBy.toString() === req.user._id.toString();
    const isShopOwner = shop?.owner?.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isProductOwner && !isShopOwner && !isAdmin) {
        return res.status(403).json({ message: "Forbidden" });
    }

    await productVariantService.deleteVariant(variantId);
    res.json({ message: "Variant deleted" });
});

export const list = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const variants = await productVariantService.getVariantsByProduct(productId);
    res.json(variants);
});
