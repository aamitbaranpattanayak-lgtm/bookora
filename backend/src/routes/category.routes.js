import { Router } from "express";

import {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
} from "../controllers/category.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import adminMiddleware from "../middleware/admin.middleware.js";
import validate from "../middleware/validate.middleware.js";
import { categoryValidation } from "../validators/category.validator.js";

const router = Router();

router.get("/", getCategories);

router.get("/:id", getCategoryById);

router.post(
    "/",
    authMiddleware,
    adminMiddleware,
    categoryValidation,
    validate,
    createCategory
);

router.put(
    "/:id",
    authMiddleware,
    adminMiddleware,
    categoryValidation,
    validate,
    updateCategory
);

router.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,
    deleteCategory
);

export default router;