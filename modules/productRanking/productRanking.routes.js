import express from "express";
import { protect } from "../../core/middlewares/auth.middleware.js";
import validate from "../../core/middlewares/validate.middleware.js";
import * as controller from "./productRanking.controller.js";
import * as validation from "./productRanking.validation.js";

const router = express.Router();

/**
 * @swagger
 * /api/product-ranking/{productId}:
 *   post:
 *     summary: Rate a product (1-5)
 *     tags: [ProductRanking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
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
 *         description: Product rated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.post("/:productId", protect(), validate(validation.productRatingSchema), controller.rateProduct);

export default router;
