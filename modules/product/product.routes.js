import { Router } from "express";
import {
    create,
    getAll,
    getOne,
    update,
    activate,
    favorite,
    getMyFavorites,
} from "./product.controller.js";
import { protect } from "../../core/middlewares/auth.middleware.js";
import validate from "../../core/middlewares/validate.middleware.js";
import * as validation from "./product.validation.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Product
 *   description: Product management
 */

/**
 * @swagger
 * /api/products/{shopId}:
 *   post:
 *     summary: Create a product (owner or admin)
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: shopId
 *         required: true
 *         schema:
 *           type: string
 *         example: "65af123456789abcd123456"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, price]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "T-shirt Nike"
 *               description:
 *                 type: string
 *                 example: "T-shirt coton de bonne qualité"
 *               price:
 *                 type: number
 *                 example: 25000
 *               stock:
 *                 type: number
 *                 example: 20
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               category:
 *                 type: string
 *                 example: "Vêtements"
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Product created
 */
router.post("/:shopId", protect(), validate(validation.createProductSchema), create);

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all active products
 *     tags: [Product]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: shop
 *         schema:
 *           type: string
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: isOnSale
 *         schema:
 *           type: string
 *           enum: [true, false]
 *     responses:
 *       200:
 *         description: List of products
 */
router.get("/", getAll);

/**
 * @swagger
 * /api/products/my/favorites:
 *   get:
 *     summary: Get all my favorite products
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of favorite products
 */
router.get("/my/favorites", protect(), getMyFavorites);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product detail
 *       404:
 *         description: Product not found
 */
router.get("/:id", getOne);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update product (owner or admin)
 *     tags: [Product]
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: number
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               category:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Product updated
 *       403:
 *         description: Forbidden
 */
router.put("/:id", protect(), validate(validation.updateProductSchema), update);

/**
 * @swagger
 * /api/products/{productId}/favorite:
 *   post:
 *     summary: Add or remove a product from user's favorites
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [favorite]
 *             properties:
 *               favorite:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Shop updated with favorite
 */
router.post("/:productId/favorite", protect(), validate(validation.favoriteProductSchema), favorite);

/**
 * @swagger
 * /api/products/{id}/activate:
 *   patch:
 *     summary: Activate or deactivate product (admin only)
 *     tags: [Product]
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
 *             required: [isActive]
 *             properties:
 *               isActive:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Product status updated
 */
router.patch("/:id/activate", protect(), validate(validation.setProductActiveSchema), activate);

export default router;
