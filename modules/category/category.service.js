import Category from "./category.model.js";

export const createCategory = async (data) => {
    return Category.create(data);
};

export const getCategories = async (type) => {
    const filter = type ? { type } : {};
    return Category.find(filter).sort({ name: 1 });
};

export const deleteCategory = async (id) => {
    return Category.findByIdAndDelete(id);
};

export const getCategoryByName = async (name, type) => {
    return Category.findOne({ name, type });
};

export const findOrCreateCategory = async (input, type) => {
    if (!input) return null;

    // Check if input is a valid ObjectId
    const isValidId = /^[0-9a-fA-F]{24}$/.test(input);
    if (isValidId) {
        const category = await Category.findById(input);
        if (category) return category._id;
    }

    // Otherwise treat as name
    let category = await Category.findOne({ name: input, type });
    if (!category) {
        category = await Category.create({ name: input, type });
    }
    return category._id;
};
