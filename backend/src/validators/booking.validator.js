import { body } from "express-validator";

export const bookingValidation = [

    body("event")
        .notEmpty()
        .withMessage("Event is required"),

    body("quantity")
        .isInt({ min: 1 })
        .withMessage("Quantity must be at least 1"),

];