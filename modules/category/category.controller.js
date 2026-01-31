import * as categoryService from "./category.service.js";
import asyncHandler from "../../core/utils/asyncHandler.js";

export const create = asyncHandler(async (req, res) => {
    const category = await categoryService.createCategory(req.body);
    res.status(201).json(category);
});

export const getAll = asyncHandler(async (req, res) => {
    const categories = await categoryService.getCategories(req.query.type);
    res.json(categories);
});

export const remove = asyncHandler(async (req, res) => {
    await categoryService.deleteCategory(req.params.id);
    res.json({ message: "Category deleted" });
});
