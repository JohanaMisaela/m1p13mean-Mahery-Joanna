import * as shopService from "./shop.service.js";

export const create = async (req, res, next) => {
    try {
        const shop = await shopService.createShop(req.body);
        res.status(201).json(shop);
    } catch (err) {
        next(err);
    }
};

export const getAll = async (req, res, next) => {
    try {
        const filters = {};
        if (req.query.category) filters.categories = req.query.category;
        if (req.query.isActive) filters.isActive = req.query.isActive === "true";
        const shops = await shopService.getShops(filters);
        res.status(200).json(shops);
    } catch (err) {
        next(err);
    }
};

export const getOne = async (req, res, next) => {
    try {
        const shop = await shopService.getShopById(req.params.id);
        res.status(200).json(shop);
    } catch (err) {
        next(err);
    }
};

export const update = async (req, res, next) => {
    try {
        const shop = await shopService.getShopById(req.params.id);
        if (!shop) return res.status(404).json({ message: "Shop not found" });

        if (shop.owner.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({ message: "Not authorized" });
        }

        if ("isActive" in req.body && req.user.role !== "admin") {
            delete req.body.isActive;
        }

        const updatedShop = await shopService.updateShop(req.params.id, req.body);
        res.status(200).json(updatedShop);
    } catch (err) {
        next(err);
    }
};

export const remove = async (req, res, next) => {
    try {
        await shopService.deleteShop(req.params.id);
        res.status(200).json({ message: "Shop deleted" });
    } catch (err) {
        next(err);
    }
};

export const favorite = async (req, res, next) => {
    try {
        const { shopId } = req.params;
        const userId = req.user._id;
        const shop = req.body.favorite
            ? await shopService.addFavorite(shopId, userId)
            : await shopService.removeFavorite(shopId, userId);
        res.status(200).json(shop);
    } catch (err) {
        next(err);
    }
};

export const updateStatus = async (req, res, next) => {
    try {
        const { isActive } = req.body;
        const shop = await shopService.updateShop(req.params.id, { isActive });
        res.status(200).json(shop);
    } catch (err) {
        next(err);
    }
};
