import * as orderService from "./order.service.js";

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
        const orders = await orderService.getOrdersByShop(req.user.shop);
        res.json(orders);
    } catch (e) {
        next(e);
    }
};

export const changeStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        const updated = await orderService.updateOrderStatus(
            req.params.id,
            status
        );

        res.json(updated);
    } catch (e) {
        next(e);
    }
};
