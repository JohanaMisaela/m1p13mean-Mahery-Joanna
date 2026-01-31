import * as orderService from "./order.service.js";
import * as shopService from "../shop/shop.service.js";

export const create = async (req, res, next) => {
    try {
        const { shopId, items, addressId } = req.body;

        const order = await orderService.createOrder(
            req.user._id,
            shopId,
            items,
            addressId
        );

        res.status(201).json(order);
    } catch (e) {
        next(e);
    }
};

export const myOrders = async (req, res, next) => {
    try {
        const orders = await orderService.getOrdersByUser(req.user._id);
        res.json(orders);
    } catch (e) {
        next(e);
    }
};

export const shopOrders = async (req, res, next) => {
    try {
        let shopId = req.query.shopId;

        if (req.user.role === "shop") {
            const shop = await shopService.getShopByOwner(req.user._id);
            if (!shop) return res.status(404).json({ message: "Shop not found for this user" });
            shopId = shop._id;
        }

        if (req.user.role === "admin" && !shopId) {
            // Admin can see all orders or filtered by shopId
            // If no shopId, maybe they want all? 
            // The service getOrdersByShop requires a shopId.
            // Let's assume for /shop route they must provide shopId if admin.
        }

        if (!shopId) {
            return res.status(400).json({ message: "Shop ID is required" });
        }

        const orders = await orderService.getOrdersByShop(shopId);
        res.json(orders);
    } catch (e) {
        next(e);
    }
};

export const changeStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const orderId = req.params.id;

        const order = await orderService.getOrderById(orderId);
        if (!order) return res.status(404).json({ message: "Order not found" });

        if (req.user.role === "shop") {
            const shop = await shopService.getShopByOwner(req.user._id);
            if (!shop || order.shop.toString() !== shop._id.toString()) {
                return res.status(403).json({ message: "Forbidden: You don't own the shop for this order" });
            }
        }

        // Admin defaults to authorized

        const updated = await orderService.updateOrderStatus(orderId, status);
        res.json(updated);
    } catch (e) {
        next(e);
    }
};
