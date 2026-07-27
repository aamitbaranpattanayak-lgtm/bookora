import { Router } from "express";

import {
    createBooking,
    getMyBookings,
    getAllBookings,
    cancelBooking,
} from "../controllers/booking.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import adminMiddleware from "../middleware/admin.middleware.js";
import validate from "../middleware/validate.middleware.js";
import { bookingValidation } from "../validators/booking.validator.js";

const router = Router();

router.post(
    "/",
    authMiddleware,
    bookingValidation,
    validate,
    createBooking
);

router.get(
    "/my-bookings",
    authMiddleware,
    getMyBookings
);

router.get(
    "/",
    authMiddleware,
    adminMiddleware,
    getAllBookings
);

router.put(
    "/:id/cancel",
    authMiddleware,
    cancelBooking
);

export default router;