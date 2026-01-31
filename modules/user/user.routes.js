import { Router } from "express";
import {
    getMe,
    updateProfile,
    updatePassword,
    changeRole,
    listUsers,
    updateStatus,
    getUserById,
} from "./user.controller.js";
import { protect, authorize } from "../../core/middlewares/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User profile management
 */

/**
 * @swagger
 * /api/user/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user info
 */
router.get("/me", protect(), getMe);

/**
 * @swagger
 * /api/user/all:
 *   get:
 *     summary: List all users (admin only)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of users
 */
router.get("/all", protect(), authorize("admin"), listUsers);

/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     summary: Get user by id (admin only)
 *     tags: [User]
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
 *         description: User info
 */
router.get("/:id", protect(), authorize("admin"), getUserById);

/**
 * @swagger
 * /api/user/update:
 *   put:
 *     summary: Update user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               surname:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated user info
 */
router.put("/update", protect(), updateProfile);

/**
 * @swagger
 * /api/user/change-password:
 *   put:
 *     summary: Change password
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [oldPassword, newPassword]
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated
 */
router.put("/change-password", protect(), updatePassword);

/**
 * @swagger
 * /api/user/change-role/{userId}:
 *   put:
 *     summary: Change role of a user (admin only)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [role]
 *             properties:
 *               role:  
 *                 type: string
 *                 enum: [admin, shop, user]
 *     responses:
 *       200:
 *         description: Role updated
 */
router.put("/change-role/:userId", protect(), authorize("admin"), changeRole);

/**
 * @swagger
 * /api/user/update-status/{userId}:
 *   put:
 *     summary: Update user status (admin or self)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
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
router.put("/update-status/:userId", protect(), updateStatus);



export default router;
