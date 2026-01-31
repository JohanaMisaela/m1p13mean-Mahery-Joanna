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
    const reports = await reportService.getAllReports(req.query.status);
    res.json(reports);
});

export const updateStatus = asyncHandler(async (req, res) => {
    const report = await reportService.updateReportStatus(req.params.id, req.body.status);
    res.json(report);
});

export const getMyReports = asyncHandler(async (req, res) => {
    const reports = await reportService.getUserReports(req.user._id);
    res.json(reports);
});
