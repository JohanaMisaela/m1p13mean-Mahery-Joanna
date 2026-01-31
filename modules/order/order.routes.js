import express from "express";
import { protect } from "../../core/middlewares/auth.middleware.js";
import { create, myOrders, shopOrders, changeStatus } from "./order.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create order
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
 *                 example: "65af123456789abcd123456"
 *               addressId:
 *                 type: string
 *                 example: "65af987654321fedc654321"
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [productId, quantity]
 *                   properties:
 *                     productId:
 *                       type: string
 *                       example: "65af11223344556677889900"
 *                     quantity:
 *                       type: number
 *                       example: 2
 *     responses:
 *       201:
 *         description: Order created
 */
router.post("/", protect(), create);

/**
 * @swagger
 * /api/orders/my:
 *   get:
 *     summary: Get my orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of my orders
 */
router.get("/my", protect(), myOrders);

/**
 * @swagger
 * /api/orders/shop:
 *   get:
 *     summary: Get shop orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of shop orders
 */
router.get("/shop", protect("shop"), shopOrders);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   put:
 *     summary: Update order status
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
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
 *                 enum: ["PENDING", "CONFIRMED", "SHIPPED"]
 *                 example: "CONFIRMED"
 *     responses:
 *       200:
 *         description: Order status updated
 */
router.put("/:id/status", protect("shop"), changeStatus);

export default router;
