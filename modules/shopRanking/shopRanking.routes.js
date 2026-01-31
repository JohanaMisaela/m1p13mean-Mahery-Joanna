import express from "express";
import { protect } from "../../core/middlewares/auth.middleware.js";
import validate from "../../core/middlewares/validate.middleware.js";
import * as controller from "./shopRanking.controller.js";
import * as validation from "./shopRanking.validation.js";

const router = express.Router();

/**
 * @swagger
 * /api/shop-ranking/{shopId}:
 *   post:
 *     summary: Rate a shop (1-5)
 *     tags: [ShopRanking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: shopId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [rating]
 *             properties:
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *     responses:
 *       200:
 *         description: Shop rated successfully
 */
router.post("/:shopId", protect(), validate(validation.shopRatingSchema), controller.rateShop);

/**
 * @swagger
 * /api/shop-ranking/my/{shopId}:
 *   get:
 *     summary: Get my rating for a shop
 *     tags: [ShopRanking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: shopId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User's rating for the shop
 */
router.get("/my/:shopId", protect(), controller.getMyRating);

export default router;
