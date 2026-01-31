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
    const comments = await service.getComments(req.params.productId);
    res.json(comments);
});
