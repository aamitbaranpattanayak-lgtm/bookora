import { body } from "express-validator";

export const eventValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required"),

  body("category")
    .notEmpty()
    .withMessage("Category is required"),

  body("venue")
    .trim()
    .notEmpty()
    .withMessage("Venue is required"),

  body("city")
    .trim()
    .notEmpty()
    .withMessage("City is required"),

  body("startDate")
    .notEmpty()
    .withMessage("Start date is required"),

  body("endDate")
    .notEmpty()
    .withMessage("End date is required"),

  body("startTime")
    .notEmpty()
    .withMessage("Start time is required"),

  body("endTime")
    .notEmpty()
    .withMessage("End time is required"),

  body("ticketPrice")
    .isNumeric()
    .withMessage("Ticket price must be a number"),

  body("totalSeats")
    .isInt({ min: 1 })
    .withMessage("Total seats must be at least 1"),

  body("availableSeats")
    .isInt({ min: 0 })
    .withMessage("Available seats cannot be negative"),

  body("bannerImage")
    .isURL()
    .withMessage("Banner image must be a valid URL"),
];