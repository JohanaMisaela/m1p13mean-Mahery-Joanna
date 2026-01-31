import Category from "./category.model.js";

export const createCategory = async (data) => {
    return Category.create(data);
};

export const getCategories = async (query = {}) => {
    const { type, page = 1, limit = 50 } = query;
    const filter = type ? { type } : {};
    const skip = (Number(page) - 1) * Number(limit);

    const total = await Category.countDocuments(filter);
    const data = await Category.find(filter)
        .sort({ name: 1 })
        .skip(skip)
        .limit(Number(limit));

    return { data, total };
};

export const deleteCategory = async (id) => {
    return Category.findByIdAndDelete(id);
};

export const getCategoryByName = async (name, type) => {
    return Category.findOne({ name, type });
};

export const findOrCreateCategory = async (input, type) => {
    if (!input) return null;

    const isValidId = /^[0-9a-fA-F]{24}$/.test(input);
    if (isValidId) {
        const category = await Category.findById(input);
        if (category) return category._id;
    }

    let category = await Category.findOne({ name: input, type });
    if (!category) {
        category = await Category.create({ name: input, type });
    }
    return category._id;
};
