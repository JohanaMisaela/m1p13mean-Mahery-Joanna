import * as orderService from "./order.service.js";
import * as shopService from "../shop/shop.service.js";
import asyncHandler from "../../core/utils/asyncHandler.js";

export const create = asyncHandler(async (req, res) => {
    const { shopId, items, addressId } = req.body;

    const order = await orderService.createOrder(
        req.user._id,
        shopId,
        items,
        addressId
    );

    res.status(201).json(order);
});

export const myOrders = asyncHandler(async (req, res) => {
    const { page = 1, limit = 50 } = req.query;
    const { data, total } = await orderService.getOrdersByUser(req.user._id, req.query);
    res.json({
        data,
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
    });
});

export const shopOrders = asyncHandler(async (req, res) => {
    const { page = 1, limit = 50 } = req.query;
    let shopId = req.query.shopId;

    if (req.user.role === "shop") {
        const shop = await shopService.getShopByOwner(req.user._id);
        if (!shop) return res.status(404).json({ message: "Shop not found for this user" });
        shopId = shop._id;
    }

    if (!shopId) {
        return res.status(400).json({ message: "Shop ID is required" });
    }

    const { data, total } = await orderService.getOrdersByShop(shopId, req.query);
    res.json({
        data,
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
    });
});

export const changeStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const orderId = req.params.id;

    const order = await orderService.getOrderById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Authorization check
    if (req.user.role === "shop") {
        const shop = await shopService.getShopByOwner(req.user._id);
        if (!shop || order.shop.toString() !== shop._id.toString()) {
            return res.status(403).json({ message: "Forbidden: You don't own the shop for this order" });
        }
    }

    const updated = await orderService.updateOrderStatus(orderId, status);
    res.json(updated);
});
