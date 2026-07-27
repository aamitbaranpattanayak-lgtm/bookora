import asyncHandler from "../middleware/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
    createBookingService,
    getMyBookingsService,
    getAllBookingsService,
    cancelBookingService,
} from "../services/booking.service.js";

export const createBooking = asyncHandler(async (req, res) => {

    const booking = await createBookingService(
        req.user._id,
        req.body.event,
        req.body.quantity
    );

    res.status(201).json(
        new ApiResponse(201, booking, "Booking created successfully")
    );
});

export const getMyBookings = asyncHandler(async (req, res) => {

    const bookings = await getMyBookingsService(req.user._id);

    res.status(200).json(
        new ApiResponse(200, bookings)
    );
});

export const getAllBookings = asyncHandler(async (req, res) => {

    const bookings = await getAllBookingsService();

    res.status(200).json(
        new ApiResponse(200, bookings)
    );
});

export const cancelBooking = asyncHandler(async (req, res) => {

    const booking = await cancelBookingService(
    req.params.id,
    req.user
);

    res.status(200).json(
        new ApiResponse(200, booking, "Booking cancelled successfully")
    );
});