import { Router } from "express";
import {
    create,
    getAll,
    getOne,
    update,
    favorite,
    updateStatus
} from "./shop.controller.js";
import { protect } from "../../core/middlewares/auth.middleware.js";
import validate from "../../core/middlewares/validate.middleware.js";
import * as validation from "./shop.validation.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Shop
 *   description: Shop management
 */

/**
 * @swagger
 * /api/shop/{ownerId}:
 *   post:
 *     summary: Create a new shop (admin only)
 *     tags: [Shop]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ownerId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               logo:
 *                 type: string
 *               slogan:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Shop created
 */
router.post("/:ownerId", protect(["admin"]), validate(validation.createShopSchema), create);

/**
 * @swagger
 * /api/shop:
 *   get:
 *     summary: Get all shops
 *     tags: [Shop]
 *     responses:
 *       200:
 *         description: List of shops
 */
router.get("/", getAll);

/**
 * @swagger
 * /api/shop/{id}:
 *   get:
 *     summary: Get a shop by ID
 *     tags: [Shop]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Shop details
 */
router.get("/:id", getOne);

/**
 * @swagger
 * /api/shop/{id}:
 *   put:
 *     summary: Update a shop (owner and admin)
 *     tags: [Shop]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               logo:
 *                 type: string
 *               slogan:
 *                 type: string
 *               description:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Shop updated
 */
router.put("/:id", protect(), validate(validation.updateShopSchema), update);

/**
 * @swagger
 * /api/shop/{id}/status:
 *   patch:
 *     summary: Update shop status (admin only)
 *     tags: [Shop]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
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
 *     responses:
 *       200:
 *         description: Status updated
 */
router.patch("/:id/status", protect(['admin']), updateStatus);

/**
 * @swagger
 * /api/shop/{shopId}/favorite:
 *   post:
 *     summary: Add or remove a shop from user's favorites
 *     tags: [Shop]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: shopId
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
 *     responses:
 *       200:
 *         description: Favorite toggled
 */
router.post("/:shopId/favorite", protect(), favorite);

export default router;
