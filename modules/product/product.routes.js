import { Router } from "express";
import {
    create,
    getAll,
    getOne,
    update,
    activate,
} from "./product.controller.js";
import { protect } from "../../core/middlewares/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Product
 *   description: Product management
 */

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a product (owner or admin)
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, price, shop]
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
 *                 example:
 *                   - "https://example.com/img1.jpg"
 *                   - "https://example.com/img2.jpg"
 *               category:
 *                 type: string
 *                 example: "Vêtements"
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["mode", "homme"]
 *               shop:
 *                 type: string
 *                 example: "65af123456789abcd123456"
 *     responses:
 *       201:
 *         description: Product created
 */
router.post("/", protect(), create);

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
 *         example: "Vêtements"
 *       - in: query
 *         name: shop
 *         schema:
 *           type: string
 *         example: "65af123456789abcd123456"
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         example: 10000
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         example: 50000
 *     responses:
 *       200:
 *         description: List of products
 */
router.get("/", getAll);

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
 *         example: "65af123456789abcd123456"
 *     responses:
 *       200:
 *         description: Product detail
 *       404:
 *         description: Product not found
 */
router.get("/:_id", getOne);

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
router.put("/:_id", protect(), update);

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
router.patch("/:_id/activate", protect(), activate);

export default router;
