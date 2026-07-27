import asyncHandler from "../middleware/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
    createCategoryService,
    getCategoriesService,
    getCategoryByIdService,
    updateCategoryService,
    deleteCategoryService,
} from "../services/category.service.js";

export const createCategory = asyncHandler(async (req, res) => {

    const category = await createCategoryService(req.body);

    res.status(201).json(new ApiResponse(201, category, "Category created"));

});

export const getCategories = asyncHandler(async (req, res) => {

    const categories = await getCategoriesService();

    res.status(200).json(new ApiResponse(200, categories));

});

export const getCategoryById = asyncHandler(async (req, res) => {

    const category = await getCategoryByIdService(req.params.id);

    res.status(200).json(new ApiResponse(200, category));

});

export const updateCategory = asyncHandler(async (req, res) => {

    const category = await updateCategoryService(req.params.id, req.body);

    res.status(200).json(new ApiResponse(200, category, "Category updated"));

});

export const deleteCategory = asyncHandler(async (req, res) => {

    await deleteCategoryService(req.params.id);

    res.status(200).json(new ApiResponse(200, null, "Category deleted"));

});