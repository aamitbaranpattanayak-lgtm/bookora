import { Router } from "express";

import {
    createEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent,
} from "../controllers/event.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import adminMiddleware from "../middleware/admin.middleware.js";
import validate from "../middleware/validate.middleware.js";

import { eventValidation } from "../validators/event.validator.js";

const router = Router();

router.get("/", getEvents);

router.get("/:id", getEventById);

router.post(
    "/",
    authMiddleware,
    adminMiddleware,
    eventValidation,
    validate,
    createEvent
);

router.put(
    "/:id",
    authMiddleware,
    adminMiddleware,
    eventValidation,
    validate,
    updateEvent
);

router.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,
    deleteEvent
);

export default router;