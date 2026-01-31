import * as reportService from "./report.service.js";
import asyncHandler from "../../core/utils/asyncHandler.js";

export const createReport = asyncHandler(async (req, res) => {
    const { targetType, targetId } = req.params;
    const report = await reportService.createReport(req.user._id, {
        ...req.body,
        targetType,
        targetId
    });
    res.status(201).json(report);
});

export const getReports = asyncHandler(async (req, res) => {
    const { page = 1, limit = 50 } = req.query;
    const { data, total } = await reportService.getAllReports(req.query);
    res.json({
        data,
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
    });
});

export const updateStatus = asyncHandler(async (req, res) => {
    const report = await reportService.updateReportStatus(req.params.id, req.body.status);
    res.json(report);
});

export const getMyReports = asyncHandler(async (req, res) => {
    const { page = 1, limit = 50 } = req.query;
    const { data, total } = await reportService.getUserReports(req.user._id, req.query);
    res.json({
        data,
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
    });
});
