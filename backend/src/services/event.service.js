import Event from "../models/event.model.js";
import ApiError from "../utils/ApiError.js";

export const createEventService = async (data, userId) => {

    const event = await Event.create({
        ...data,
        createdBy: userId,
    });

    return event;
};

export const getEventsService = async (query) => {

    const filter = { isActive: true };

    if (query.search) {
        filter.title = {
            $regex: query.search,
            $options: "i",
        };
    }

    if (query.category) {
        filter.category = query.category;
    }

    if (query.featured) {
        filter.featured = true;
    }

    const events = await Event.find(filter)
        .populate("category", "name")
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 });

    return events;
};

export const getEventByIdService = async (id) => {

    const event = await Event.findById(id)
        .populate("category")
        .populate("createdBy", "name email");

    if (!event) {
        throw new ApiError(404, "Event not found");
    }

    return event;
};

export const updateEventService = async (id, data) => {

    const event = await Event.findById(id);

    if (!event) {
        throw new ApiError(404, "Event not found");
    }

    Object.assign(event, data);

    await event.save();

    return event;
};

export const deleteEventService = async (id) => {

    const event = await Event.findById(id);

    if (!event) {
        throw new ApiError(404, "Event not found");
    }

    event.isActive = false;

    await event.save();

    return event;
};