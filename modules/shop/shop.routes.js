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

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Shop
 *   description: Shop management
 */

/**
 * @swagger
 * /api/shop:
 *   post:
 *     summary: Create a new shop (admin only)
 *     tags: [Shop]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, owner, mallBoxNumber]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "La Belle Mode"
 *               logo:
 *                 type: string
 *                 example: "https://example.com/logo.png"
 *               slogan:
 *                 type: string
 *                 example: "La mode au quotidien"
 *               description:
 *                 type: string
 *                 example: "Boutique de vêtements pour hommes et femmes"
 *               owner:
 *                 type: string
 *                 example: "64d5f3e8a1b2c3d4e5f67890"
 *               mallBoxNumber:
 *                 type: string
 *                 example: "B12"
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["vêtements", "accessoires"]
 *               phone:
 *                 type: string
 *                 example: "+261341234567"
 *               email:
 *                 type: string
 *                 example: "contact@labellemode.mg"
 *               socialLinks:
 *                 type: object
 *                 properties:
 *                   facebook:
 *                     type: string
 *                   instagram:
 *                     type: string
 *                   tiktok:
 *                     type: string
 *               openingHours:
 *                 type: string
 *                 example: "Lun-Ven 9h-18h"
 *               isActive:
 *                 type: boolean
 *                 example: true
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["mode", "tendance"]
 *     responses:
 *       201:
 *         description: Shop created successfully
 */
router.post("/", protect("admin"), create);

/**
 * @swagger
 * /api/shop:
 *   get:
 *     summary: Get all shops
 *     tags: [Shop]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
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
 *         description: Shop ID
 *     responses:
 *       200:
 *         description: Shop details
 */
router.get("/:_id", getOne);

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
 *         description: Shop ID
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
 *               owner:
 *                 type: string
 *               mallBoxNumber:
 *                 type: string
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               socialLinks:
 *                 type: object
 *                 properties:
 *                   facebook:
 *                     type: string
 *                   instagram:
 *                     type: string
 *                   tiktok:
 *                     type: string
 *               openingHours:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Shop updated
 */
router.put("/:_id", protect(), update);

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
 *         description: Shop ID
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
 *         description: Shop status updated
 */
router.patch("/:_id/status", protect('admin'), updateStatus);

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
 *         description: Shop ID
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
router.post("/:shopId/favorite", protect(), favorite);

export default router;
