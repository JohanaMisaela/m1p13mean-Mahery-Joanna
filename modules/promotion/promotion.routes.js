import express from "express";
import { protect } from "../../core/middlewares/auth.middleware.js";
import validate from "../../core/middlewares/validate.middleware.js";
import * as controller from "./promotion.controller.js";
import * as validation from "./promotion.validation.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Promotions
 *   description: Management of shop promotions (Black Friday, Sales)
 */

/**
 * @swagger
 * /api/promotions:
 *   post:
 *     summary: Create a new promotion (Shop Owner or Admin)
 *     tags: [Promotions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, discountPercentage, startDate, endDate, shopId]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Black Friday"
 *               description:
 *                 type: string
 *                 example: "Toute la boutique à -50%"
 *               discountPercentage:
 *                 type: number
 *                 example: 50
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-11-27T00:00:00Z"
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-11-30T23:59:59Z"
 *               shopId:
 *                 type: string
 *               products:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Promotion created successfully
 */
router.post("/", protect(["shop", "admin"]), validate(validation.createPromotionSchema), controller.create);

/**
 * @swagger
 * /api/promotions/{id}:
 *   put:
 *     summary: Update a promotion or status (Shop Owner or Admin)
 *     tags: [Promotions]
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
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               discountPercentage: { type: number }
 *               startDate: { type: string, format: date-time }
 *               endDate: { type: string, format: date-time }
 *               isActive: { type: boolean }
 *     responses:
 *       200:
 *         description: Promotion updated
 */
router.put("/:id", protect(["shop", "admin"]), validate(validation.updatePromotionSchema), controller.update);

/**
 * @swagger
 * /api/promotions/{id}/products/add:
 *   patch:
 *     summary: Add products to a promotion
 *     tags: [Promotions]
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
 *             required: [productIds]
 *             properties:
 *               productIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Products added to promotion
 */
router.patch("/:id/products/add", protect(["shop", "admin"]), validate(validation.updatePromotionProductsSchema), controller.addProducts);

/**
 * @swagger
 * /api/promotions/{id}/products/remove:
 *   patch:
 *     summary: Remove products from a promotion (Break the link)
 *     tags: [Promotions]
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
 *             required: [productIds]
 *             properties:
 *               productIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Products removed from promotion
 */
router.patch("/:id/products/remove", protect(["shop", "admin"]), validate(validation.updatePromotionProductsSchema), controller.removeProducts);

/**
 * @swagger
 * /api/promotions/shop/{shopId}:
 *   get:
 *     summary: Get all promotions for a shop
 *     tags: [Promotions]
 *     parameters:
 *       - in: path
 *         name: shopId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of shop promotions
 */
router.get("/shop/:shopId", controller.getShopPromos);

export default router;
