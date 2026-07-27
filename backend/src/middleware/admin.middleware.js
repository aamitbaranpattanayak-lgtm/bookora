import ApiError from "../utils/ApiError.js";

const adminMiddleware = (req, res, next) => {
    if (req.user.role !== "admin") {
        throw new ApiError(403, "Access denied. Admin only.");
    }

    next();
};

export default adminMiddleware;