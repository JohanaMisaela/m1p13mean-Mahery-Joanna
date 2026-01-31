import express from "express";
import { protect } from "../../core/middlewares/auth.middleware.js";
import validate from "../../core/middlewares/validate.middleware.js";
import * as controller from "./report.controller.js";
import * as validation from "./report.validation.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Reporting system for moderation
 */

/**
 * @swagger
 * /api/reports/{targetType}/{targetId}:
 *   post:
 *     summary: Create a report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: targetType
 *         required: true
 *         schema:
 *           type: string
 *           enum: [product, shop]
 *       - in: path
 *         name: targetId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [reason]
 *             properties:
 *               reason:
 *                 type: string
 *                 enum: [scam, wrong_info, prohibited, other]
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Report created successfully
 */
router.post("/:targetType/:targetId", protect(), validate(validation.createReportSchema), controller.createReport);

/**
 * @swagger
 * /api/reports/my:
 *   get:
 *     summary: Get my reports
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         description: List of user's reports
 */
router.get("/my", protect(), controller.getMyReports);

/**
 * @swagger
 * /api/reports:
 *   get:
 *     summary: Get all reports (Admin only)
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, resolved, dismissed]
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
 *         description: Paginated list of all reports
 */
router.get("/", protect(["admin"]), controller.getReports);

/**
 * @swagger
 * /api/reports/{id}:
 *   put:
 *     summary: Update report status (Admin only)
 *     tags: [Reports]
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
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, resolved, dismissed]
 *     responses:
 *       200:
 *         description: Report status updated
 */
router.put("/:id", protect(["admin"]), validate(validation.updateReportSchema), controller.updateStatus);

export default router;
