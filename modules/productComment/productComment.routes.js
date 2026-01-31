import express from "express";
import { protect } from "../../core/middlewares/auth.middleware.js";
import validate from "../../core/middlewares/validate.middleware.js";
import * as controller from "./productComment.controller.js";
import * as validation from "./productComment.validation.js";

const router = express.Router();

/**
 * @swagger
 * /api/product-comments/{productId}:
 *   post:
 *     summary: Add a comment to a product
 *     tags: [ProductComment]
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
 *             required: [comment]
 *             properties:
 *               comment:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Comment added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id: { type: string }
 *                 comment: { type: string }
 *                 user: { type: string }
 *                 product: { type: string }
 */
router.post("/:productId", protect(), validate(validation.productCommentSchema), controller.addComment);

/**
 * @swagger
 * /api/product-comments/{productId}:
 *   get:
 *     summary: Get all comments for a product
 *     tags: [ProductComment]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id: { type: string }
 *                   comment: { type: string }
 *                   user: { type: object }
 */
router.get("/:productId", controller.getComments);

export default router;
