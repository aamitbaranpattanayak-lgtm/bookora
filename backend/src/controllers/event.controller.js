import asyncHandler from "../middleware/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
    createEventService,
    getEventsService,
    getEventByIdService,
    updateEventService,
    deleteEventService,
} from "../services/event.service.js";

export const createEvent = asyncHandler(async (req, res) => {

    const event = await createEventService(req.body, req.user._id);

    res.status(201).json(
        new ApiResponse(201, event, "Event created successfully")
    );
});

export const getEvents = asyncHandler(async (req, res) => {

    const events = await getEventsService(req.query);

    res.status(200).json(
        new ApiResponse(200, events)
    );
});

export const getEventById = asyncHandler(async (req, res) => {

    const event = await getEventByIdService(req.params.id);

    res.status(200).json(
        new ApiResponse(200, event)
    );
});

export const updateEvent = asyncHandler(async (req, res) => {

    const event = await updateEventService(req.params.id, req.body);

    res.status(200).json(
        new ApiResponse(200, event, "Event updated successfully")
    );
});

export const deleteEvent = asyncHandler(async (req, res) => {

    await deleteEventService(req.params.id);

    res.status(200).json(
        new ApiResponse(200, null, "Event deleted successfully")
    );
});