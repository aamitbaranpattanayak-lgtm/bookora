import Booking from "../models/booking.model.js";
import Event from "../models/event.model.js";
import ApiError from "../utils/ApiError.js";

export const createBookingService = async (
    userId,
    eventId,
    quantity
) => {

    const event = await Event.findById(eventId);

    if (!event) {
        throw new ApiError(404, "Event not found");
    }

    if (event.availableSeats < quantity) {
        throw new ApiError(400, "Not enough seats available");
    }

    event.availableSeats -= quantity;

    await event.save();

    const booking = await Booking.create({

        user: userId,

        event: eventId,

        quantity,

        totalAmount: quantity * event.ticketPrice,

        paymentStatus: "paid",

    });

    return booking;

};

export const getMyBookingsService = async (userId) => {

    return await Booking.find({
        user: userId,
    })
        .populate("event")
        .sort({ createdAt: -1 });

};

export const getAllBookingsService = async () => {

    return await Booking.find()
        .populate("user", "name email")
        .populate("event", "title");

};

export const cancelBookingService = async (
    bookingId,
    currentUser
) => {

    const booking = await Booking.findById(bookingId);

    if (!booking) {
        throw new ApiError(404, "Booking not found");
    }

    // Normal users can only cancel their own bookings
    if (
        currentUser.role !== "admin" &&
        booking.user.toString() !== currentUser._id.toString()
    ) {
        throw new ApiError(
            403,
            "You can only cancel your own bookings"
        );
    }

    if (booking.bookingStatus === "cancelled") {
        throw new ApiError(
            400,
            "Booking already cancelled"
        );
    }

    const event = await Event.findById(booking.event);

    if (!event) {
        throw new ApiError(404, "Event not found");
    }

    event.availableSeats += booking.quantity;

    await event.save();

    booking.bookingStatus = "cancelled";

    await booking.save();

    return booking;
};