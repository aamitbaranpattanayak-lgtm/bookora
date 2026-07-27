import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: true,
        },

        quantity: {
            type: Number,
            required: true,
            min: 1,
        },

        totalAmount: {
            type: Number,
            required: true,
        },

        bookingStatus: {
            type: String,
            enum: ["confirmed", "cancelled"],
            default: "confirmed",
        },

        paymentStatus: {
            type: String,
            enum: ["pending", "paid"],
            default: "paid",
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Booking", bookingSchema);