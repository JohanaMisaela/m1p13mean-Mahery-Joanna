import * as service from "./productComment.service.js";
import asyncHandler from "../../core/utils/asyncHandler.js";

export const addComment = asyncHandler(async (req, res) => {
    const comment = await service.addComment(
        req.user._id,
        req.params.productId,
        req.body
    );
    res.status(201).json(comment);
});

export const getComments = asyncHandler(async (req, res) => {
    const { page = 1, limit = 50 } = req.query;
    const { data, total } = await service.getComments(req.params.productId, req.query);
    res.json({
        data,
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
    });
});

export const updateComment = asyncHandler(async (req, res) => {
    const comment = await service.updateComment(
        req.params.commentId,
        req.user._id,
        req.body
    );
    res.json(comment);
});

export const deleteComment = asyncHandler(async (req, res) => {
    await service.deleteComment(req.params.commentId, req.user._id);
    res.json({ success: true, message: "Commentaire supprimé" });
});
