import * as promotionService from "./promotion.service.js";
import * as shopService from "../shop/shop.service.js";
import asyncHandler from "../../core/utils/asyncHandler.js";

export const create = asyncHandler(async (req, res) => {
    const { shopId } = req.params;

    if (req.user.role === "shop") {
        const shop = await shopService.getShopByOwner(req.user._id);
        if (!shop || shop._id.toString() !== shopId) {
            return res.status(403).json({ message: "Forbidden: You don't own this shop" });
        }
    }

    const promotion = await promotionService.createPromotion({
        ...req.body,
        shop: shopId
    });
    res.status(201).json(promotion);
});

export const update = asyncHandler(async (req, res) => {
    const promo = await promotionService.getPromotionById(req.params.id);
    if (!promo) return res.status(404).json({ message: "Promotion not found" });

    if (req.user.role === "shop") {
        const shop = await shopService.getShopByOwner(req.user._id);
        if (!shop || promo.shop.toString() !== shop._id.toString()) {
            return res.status(403).json({ message: "Forbidden: You don't own the shop for this promotion" });
        }
    }

    const updated = await promotionService.updatePromotion(req.params.id, req.body);
    res.json(updated);
});

export const addProducts = asyncHandler(async (req, res) => {
    const { productIds } = req.body;
    const updated = await promotionService.addProductsToPromotion(req.params.id, productIds);
    res.json(updated);
});

export const removeProducts = asyncHandler(async (req, res) => {
    const { productIds } = req.body;
    const updated = await promotionService.removeProductsFromPromotion(req.params.id, productIds);
    res.json(updated);
});

export const getShopPromos = asyncHandler(async (req, res) => {
    const shopId = req.params.shopId;

    const promos = await promotionService.getShopPromotions(shopId);
    res.json(promos);
});
