import express from "express";
import { protect } from "../../core/middlewares/auth.middleware.js";
import validate from "../../core/middlewares/validate.middleware.js";
import * as controller from "./category.controller.js";
import * as validation from "./category.validation.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Category management for products and shops
 */

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a category (Admin only)
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, type]
 *             properties:
 *               name: { type: string }
 *               type: { type: string, enum: [product, shop] }
 *               icon: { type: string }
 *     responses:
 *       201:
 *         description: Category created
 */
router.post("/", protect(["admin", "shop"]), validate(validation.createCategorySchema), controller.create);

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Category]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [product, shop]
 *       - in: query
 *         name: page
 *         schema: { type: number }
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema: { type: number }
 *         example: 50
 *     responses:
 *       200:
 *         description: Paginated list of categories
 */
router.get("/", controller.getAll);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete a category (Admin only)
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category deleted
 */
router.delete("/:id", protect(["admin"]), controller.remove);

export default router;
