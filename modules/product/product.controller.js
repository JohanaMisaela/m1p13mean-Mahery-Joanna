import * as productService from "./product.service.js";
import * as shopService from "../shop/shop.service.js";

export const create = async (req, res, next) => {
    try {
        const { shopId } = req.params;
        if (!shopId) {
            return res.status(400).json({ message: "Shop ID is required" });
        }

        const shopExists = await shopService.getShopById(shopId);

        if (!shopExists) {
            return res.status(404).json({ message: "Shop not found" });
        }

        if (!shopExists.owner) {
            return res.status(500).json({ message: "Shop data invalid: Owner not found." });
        }

        if (
            shopExists.owner._id.toString() !== req.user._id.toString() &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({ message: "You are not authorized to add products to this shop" });
        }

        const product = await productService.createProduct({
            ...req.body,
            shop: shopId,
            createdBy: req.user._id,
        });
        res.status(201).json(product);
    } catch (e) {
        next(e);
    }
};

export const getAll = async (req, res, next) => {
    try {
        const products = await productService.getAllProducts(req.query);
        res.json(products);
    } catch (e) {
        next(e);
    }
};

export const getOne = async (req, res, next) => {
    try {
        const product = await productService.getProductById(req.params._id);
        if (!product) return res.status(404).json({ message: "Not found" });
        res.json(product);
    } catch (e) {
        next(e);
    }
};

export const update = async (req, res, next) => {
    try {
        const product = await productService.getProductById(req.params._id);
        if (!product) return res.status(404).json({ message: "Not found" });

        // Owner of the product or Owner of the shop or admin
        const isProductOwner = product.createdBy._id.toString() === req.user._id.toString();
        const isShopOwner = product.shop && product.shop.owner && product.shop.owner.toString() === req.user._id.toString();
        const isAdmin = req.user.role === "admin";

        if (!isProductOwner && !isShopOwner && !isAdmin) {
            return res.status(403).json({ message: "Forbidden" });
        }

        // isActive réservé admin
        if ("isActive" in req.body && req.user.role !== "admin") {
            delete req.body.isActive;
        }

        const updated = await productService.updateProduct(req.params._id, req.body);
        res.json(updated);
    } catch (e) {
        next(e);
    }
};

export const activate = async (req, res, next) => {
    try {
        const product = await productService.getProductById(req.params._id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        const isShopOwner = product.shop && product.shop.owner && product.shop.owner.toString() === req.user._id.toString();
        const isAdmin = req.user.role === "admin";

        if (!isAdmin && !isShopOwner) {
            return res.status(403).json({ message: "Admin or Shop Owner only" });
        }

        const updated = await productService.setProductActive(
            req.params._id,
            req.body.isActive
        );
        res.json(updated);
    } catch (e) {
        next(e);
    }
};
