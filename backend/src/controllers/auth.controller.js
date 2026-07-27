import asyncHandler from "../middleware/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
    registerService,
    loginService,
} from "../services/auth.service.js";

export const register = asyncHandler(async (req, res) => {
    const result = await registerService(req.body);

    return res.status(201).json(
        new ApiResponse(
            201,
            result,
            "User registered successfully"
        )
    );
});

export const login = asyncHandler(async (req, res) => {
    const result = await loginService(req.body);

    return res.status(200).json(
        new ApiResponse(
            200,
            result,
            "Login successful"
        )
    );
});