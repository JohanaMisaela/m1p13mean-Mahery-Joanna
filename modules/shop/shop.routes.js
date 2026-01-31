import { Router } from "express";
import {
    create,
    getAll,
    getOne,
    update,
    favorite,
    updateStatus,
    getMyFavorites
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
 *             required: [name, mallBoxNumber]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Ma Boutique Fashion"
 *               mallBoxNumber:
 *                 type: string
 *                 example: "B-102"
 *               logo:
 *                 type: string
 *                 example: "https://example.com/logo.png"
 *               slogan:
 *                 type: string
 *                 example: "Le style à petit prix"
 *               description:
 *                 type: string
 *                 example: "Vente de vêtements et accessoires tendance"
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: "Array of category names or ObjectIds. Missing names will be auto-created."
 *                 example: ["Mode", "Accessoires"]
 *               phone:
 *                 type: string
 *                 example: "+212 600 000 000"
 *               email:
 *                 type: string
 *                 example: "contact@maboutique.com"
 *               socialLinks:
 *                 type: object
 *                 properties:
 *                   facebook: { type: string, example: "facebook.com/maboutique" }
 *                   instagram: { type: string, example: "instagr.am/maboutique" }
 *                   tiktok: { type: string, example: "tiktok.com/@maboutique" }
 *               openingHours:
 *                 type: string
 *                 example: "Lun-Sam: 09:00 - 20:00"
 *               tags:
 *                 type: array
 *                 items: { type: string }
 *                 example: ["fashion", "tendance", "chic"]
 *               gallery:
 *                 type: array
 *                 items: { type: string }
 *                 example: ["https://example.com/img1.jpg", "https://example.com/img2.jpg"]
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
 *     parameters:
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *         example: "Mode"
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         example: "Fashion"
 *       - in: query
 *         name: isActive
 *         schema: { type: string, enum: [true, false] }
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
 *         description: Paginated list of shops
 */
router.get("/", getAll);

/**
 * @swagger
 * /api/shop/my/favorites:
 *   get:
 *     summary: Get shops favorited by current user
 *     tags: [Shop]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: number }
 *       - in: query
 *         name: limit
 *         schema: { type: number }
 *     responses:
 *       200:
 *         description: Paginated list of favorited shops
 */
router.get("/my/favorites", protect(), getMyFavorites);

/**
 * @swagger
 * /api/shop/{id}:
 *   get:
 *     summary: Get a shop by ID
 *     tags: [Shop]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         example: "65af123456789abcd123456"
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
 *         required: true
 *         schema: { type: string }
 *         example: "65af123456789abcd123456"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string, example: "Nouveau Nom Boutique" }
 *               logo: { type: string, example: "https://example.com/new-logo.png" }
 *               slogan: { type: string, example: "Nouveau Slogan" }
 *               description: { type: string, example: "Nouvelle description" }
 *               categories: { type: array, items: { type: string }, example: ["Nouvelle Cat"] }
 *               phone: { type: string, example: "+212 600 111 222" }
 *               email: { type: string, example: "new@maboutique.com" }
 *               socialLinks:
 *                 type: object
 *                 properties:
 *                   facebook: { type: string, example: "fb.com/new" }
 *                   instagram: { type: string, example: "ig.com/new" }
 *                   tiktok: { type: string, example: "tt.com/new" }
 *               openingHours: { type: string, example: "Lun-Dim: 10:00 - 22:00" }
 *               tags: { type: array, items: { type: string }, example: ["new", "tags"] }
 *               gallery: { type: array, items: { type: string }, example: ["https://example.com/new1.jpg"] }
 *               isActive: { type: boolean, description: "Admin only", example: true }
 *               mallBoxNumber: { type: string, description: "Admin only", example: "A-12" }
 *               owner: { type: string, description: "Admin only", example: "65af..." }
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
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [isActive]
 *             properties:
 *               isActive: { type: boolean }
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
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [favorite]
 *             properties:
 *               favorite: { type: boolean }
 *     responses:
 *       200:
 *         description: Favorite toggled
 */
router.post("/:shopId/favorite", protect(), favorite);

export default router;
