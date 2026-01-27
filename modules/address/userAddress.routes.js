import { Router } from "express";
import {
    addAddress,
    updateAddress,
    deleteAddress,
    getAddresses,
} from "./userAddress.controller.js";
import { protect } from "../../core/middlewares/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: UserAddress
 *   description: UserAddress management
 */

/**
 * @swagger
 * /api/addresses:
 *   get:
 *     summary: Get all addresses of current user
 *     tags: [UserAddress]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of addresses
 */
router.get("/", protect(), getAddresses);

/**
 * @swagger
 * /api/addresses:
 *   post:
 *     summary: Add a new address
 *     tags: [UserAddress]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [street, city, zip, country]
 *             properties:
 *               street:
 *                 type: string
 *               city:
 *                 type: string
 *               zip:
 *                 type: string
 *               country:
 *                 type: string
 *               isDefault:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Created address
 */
router.post("/", protect(), addAddress);

/**
 * @swagger
 * /api/addresses/{id}:
 *   put:
 *     summary: Update an address
 *     tags: [UserAddress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Address ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               street:
 *                 type: string
 *               city:
 *                 type: string
 *               zip:
 *                 type: string
 *               country:
 *                 type: string
 *               isDefault:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Updated address
 */
router.put("/:id", protect(), updateAddress);

/**
 * @swagger
 * /api/addresses/{id}:
 *   delete:
 *     summary: Delete an address
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Address ID
 *     responses:
 *       200:
 *         description: Address deleted
 */
router.delete("/:id", protect(), deleteAddress);
export default router;
