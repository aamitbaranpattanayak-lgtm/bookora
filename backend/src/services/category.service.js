import Category from "../models/category.model.js";
import ApiError from "../utils/ApiError.js";

export const createCategoryService = async (data) => {

    const exists = await Category.findOne({ name: data.name });

    if (exists) {
        throw new ApiError(409, "Category already exists");
    }

    const category = await Category.create(data);

    return category;
};

export const getCategoriesService = async () => {

    return await Category.find({ isActive: true }).sort({ createdAt: -1 });

};

export const getCategoryByIdService = async (id) => {

    const category = await Category.findById(id);

    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    return category;
};

export const updateCategoryService = async (id, data) => {

    const category = await Category.findById(id);

    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    category.name = data.name ?? category.name;
    category.description = data.description ?? category.description;

    await category.save();

    return category;
};

export const deleteCategoryService = async (id) => {

    const category = await Category.findById(id);

    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    category.isActive = false;

    await category.save();

    return category;
};