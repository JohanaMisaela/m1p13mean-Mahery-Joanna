import { Router } from "express";
import { create, update, remove, list } from "./productVariant.controller.js";
import { protect } from "../../core/middlewares/auth.middleware.js";
import validate from "../../core/middlewares/validate.middleware.js";
import * as validation from "./productVariant.validation.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: ProductVariant
 *   description: Product Variant management
 */

/**
 * @swagger
 * /api/product-variants/{productId}:
 *   get:
 *     summary: Get all variants for a product
 *     tags: [ProductVariant]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: List of variants }
 */
router.get("/:productId", list);

/**
 * @swagger
 * /api/product-variants/{productId}:
 *   post:
 *     summary: Add a variant to a product
 *     tags: [ProductVariant]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [price]
 *             properties:
 *               attributes: { type: object, example: { color: "Red", size: "42" } }
 *               price: { type: number, example: 35000 }
 *               stock: { type: number, example: 10 }
 *               sku: { type: string, example: "NIKE-RED-42" }
 *               images: { type: array, items: { type: string } }
 *     responses:
 *       201: { description: Variant created }
 */
router.post("/:productId", protect(), validate(validation.createVariantSchema), create);

/**
 * @swagger
 * /api/product-variants/{variantId}:
 *   put:
 *     summary: Update a product variant
 *     tags: [ProductVariant]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: variantId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               attributes: { type: object }
 *               price: { type: number }
 *               stock: { type: number }
 *               sku: { type: string }
 *               images: { type: array, items: { type: string } }
 *     responses:
 *       200: { description: Variant updated }
 */
router.put("/:variantId", protect(), validate(validation.updateVariantSchema), update);

/**
 * @swagger
 * /api/product-variants/{variantId}:
 *   delete:
 *     summary: Soft delete a product variant
 *     tags: [ProductVariant]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: variantId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Variant deleted }
 */
router.delete("/:variantId", protect(), remove);

export default router;
