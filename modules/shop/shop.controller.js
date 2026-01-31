import * as shopService from "./shop.service.js";

export const create = async (req, res, next) => {
    try {
        if (req.user.role === "admin") {
            req.body.owner = req.params.ownerId;
        } else {
            req.body.owner = req.user._id;
        }

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
        const shop = await shopService.getShopById(req.params._id);
        res.status(200).json(shop);
    } catch (err) {
        next(err);
    }
};

export const update = async (req, res, next) => {
    try {
        const shop = await shopService.getShopById(req.params._id);
        if (!shop) return res.status(404).json({ message: "Shop not found" });

        if (!shop.owner) {
            return res.status(500).json({ message: "Shop data invalid: Owner not found." });
        }

        if (shop.owner._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({ message: "Not authorized" });
        }

        if ("isActive" in req.body && req.user.role !== "admin") {
            delete req.body.isActive;
        }

        const updatedShop = await shopService.updateShop(req.params._id, req.body);
        res.status(200).json(updatedShop);
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
        const shop = await shopService.getShopById(req.params._id);
        if (!shop) return res.status(404).json({ message: "Shop not found" });

        if (!shop.owner) {
            return res.status(500).json({ message: "Shop data invalid: Owner not found." });
        }

        if (shop.owner._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({ message: "Not authorized" });
        }

        const { isActive } = req.body;
        // If owner tries to activate, maybe restrict? 
        // For now, allow owner to toggle their shop status if that's the requirement.
        // Or if 'activate' means 'approve', then only admin.
        // Assuming 'activate' means 'open/close' for owner, 'ban/unban' for admin.

        const updatedShop = await shopService.updateShop(req.params._id, { isActive });
        res.status(200).json(updatedShop);
    } catch (err) {
        next(err);
    }
};
