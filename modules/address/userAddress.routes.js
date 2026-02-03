import { Router } from "express";
import {
    addAddress,
    updateAddress,
    updateStatus,
    getAddresses,
    setDefault,
} from "./userAddress.controller.js";
import { protect } from "../../core/middlewares/auth.middleware.js";
import validate from "../../core/middlewares/validate.middleware.js";
import * as validation from "./address.validation.js";

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
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: number }
 *       - in: query
 *         name: limit
 *         schema: { type: number }
 *     responses:
 *       200:
 *         description: Paginated list of user addresses
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
 */
router.post("/", protect(), validate(validation.addAddressSchema), addAddress);

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
 *         required: true
 *         schema:
 *           type: string
 */
router.put("/:id", protect(), validate(validation.updateAddressSchema), updateAddress);

/**
 * @swagger
 * /api/addresses/{id}/status:
 *   patch:
 *     summary: Update address status
 *     tags: [UserAddress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.patch("/:id/status", protect(), validate(validation.updateAddressStatusSchema), updateStatus);

/**
 * @swagger
 * /api/addresses/{id}/default:
 *   patch:
 *     summary: Set address as default
 *     tags: [UserAddress]
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
 *         description: Address set as default
 */
router.patch("/:id/default", protect(), validate(validation.setDefaultAddressSchema), setDefault);

export default router;
