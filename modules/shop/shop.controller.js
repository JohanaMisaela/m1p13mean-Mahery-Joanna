import * as shopService from "./shop.service.js";
import * as categoryService from "../category/category.service.js";
import asyncHandler from "../../core/utils/asyncHandler.js";

export const create = asyncHandler(async (req, res) => {
    if (req.user.role === "admin") {
        req.body.owner = req.params.ownerId;
    } else {
        req.body.owner = req.user._id;
    }

    // Categories find-or-create logic
    if (req.body.categories && Array.isArray(req.body.categories)) {
        req.body.categories = await Promise.all(
            req.body.categories.map(cat => categoryService.findOrCreateCategory(cat, "shop"))
        );
    }

    const shop = await shopService.createShop(req.body);
    res.status(201).json(shop);
});

export const getAll = asyncHandler(async (req, res) => {
    const filters = {};
    if (req.query.category) filters.categories = req.query.category;
    if (req.query.isActive) filters.isActive = req.query.isActive === "true";
    const shops = await shopService.getShops(filters, req.query);
    res.status(200).json(shops);
});

export const getOne = asyncHandler(async (req, res) => {
    const shop = await shopService.getShopById(req.params.id);
    res.status(200).json(shop);
});

export const update = asyncHandler(async (req, res) => {
    const shop = await shopService.getShopById(req.params.id);
    if (!shop) return res.status(404).json({ message: "Shop not found" });

    if (!shop.owner) {
        return res.status(500).json({ message: "Shop data invalid: Owner not found." });
    }

    if (shop.owner._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized" });
    }

    // Restrictions: Only admin can change owner, mallBoxNumber or isActive
    const restrictedFields = ["owner", "mallBoxNumber", "isActive"];
    if (req.user.role !== "admin") {
        restrictedFields.forEach(field => delete req.body[field]);
    }

    // Categories find-or-create logic
    if (req.body.categories && Array.isArray(req.body.categories)) {
        req.body.categories = await Promise.all(
            req.body.categories.map(cat => categoryService.findOrCreateCategory(cat, "shop"))
        );
    }

    const updatedShop = await shopService.updateShop(req.params.id, req.body);
    res.status(200).json(updatedShop);
});

export const favorite = asyncHandler(async (req, res) => {
    const { shopId } = req.params;
    const userId = req.user._id;
    const shop = req.body.favorite
        ? await shopService.addFavorite(shopId, userId)
        : await shopService.removeFavorite(shopId, userId);
    res.status(200).json(shop);
});

export const updateStatus = asyncHandler(async (req, res) => {
    const shop = await shopService.getShopById(req.params.id);
    if (!shop) return res.status(404).json({ message: "Shop not found" });

    if (!shop.owner) {
        return res.status(500).json({ message: "Shop data invalid: Owner not found." });
    }

    if (shop.owner._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized" });
    }

    const { isActive } = req.body;
    const updatedShop = await shopService.updateShop(req.params.id, { isActive });
    res.status(200).json(updatedShop);
});

export const getMyFavorites = asyncHandler(async (req, res) => {
    const shops = await shopService.getUserFavorites(req.user._id);
    res.json(shops);
});
