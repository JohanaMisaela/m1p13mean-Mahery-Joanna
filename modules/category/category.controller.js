import * as categoryService from "./category.service.js";
import asyncHandler from "../../core/utils/asyncHandler.js";

export const create = asyncHandler(async (req, res) => {
    const category = await categoryService.createCategory(req.body);
    res.status(201).json(category);
});

export const getAll = asyncHandler(async (req, res) => {
    const { page = 1, limit = 50 } = req.query;
    const { data, total } = await categoryService.getCategories(req.query);
    res.json({
        data,
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
    });
});

export const remove = asyncHandler(async (req, res) => {
    await categoryService.deleteCategory(req.params.id);
    res.json({ message: "Category deleted" });
});
