import express from "express";
import { protect } from "../../core/middlewares/auth.middleware.js";
import { create, myOrders, shopOrders, changeStatus } from "./order.controller.js";
import validate from "../../core/middlewares/validate.middleware.js";
import * as validation from "./order.validation.js";

const router = express.Router();

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create order (Pending status)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [shopId, items, addressId]
 *             properties:
 *               shopId:
 *                 type: string
 *               addressId:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [productId, quantity]
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: number
 *     responses:
 *       201:
 *         description: Order created
 */
router.post("/", protect(), validate(validation.createOrderSchema), create);

/**
 * @swagger
 * /api/orders/my:
 *   get:
 *     summary: Get my orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: number }
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema: { type: number }
 *         example: 50
 */
router.get("/my", protect(), myOrders);

/**
 * @swagger
 * /api/orders/shop:
 *   get:
 *     summary: Get shop orders (shop owner or admin)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: shopId
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema: { type: number }
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema: { type: number }
 *         example: 50
 */
router.get("/shop", protect(["shop", "admin"]), shopOrders);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   put:
 *     summary: Update order status (shop owner or admin)
 *     description: Moving to CONFIRMED will deduct stock. CANCELLED is only allowed if current status is PENDING.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: ["PENDING", "CONFIRMED", "SHIPPED", "CANCELLED"]
 *     responses:
 *       200:
 *         description: Order status updated
 */
router.put("/:id/status", protect(["shop", "admin"]), validate(validation.updateOrderStatusSchema), changeStatus);

export default router;
