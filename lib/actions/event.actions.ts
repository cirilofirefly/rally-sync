"use server"

import { CreateEventParams, DeleteEventParams, GetAllEventsParams } from "@/types"
import { connectToDatabase } from "../mongodb/database"
import { cloneObject, handleError } from "../utils";
import User from "../mongodb/database/models/user.model";
import Event from "../mongodb/database/models/event.model";
import Category from "../mongodb/database/models/category.model";
import { revalidatePath } from "next/cache";


const populateEvent = async (query: any) => {
    return query
        .populate({ 
            path: 'organizer', 
            model: User,
            select: '_id firstName lastName'
        })
        .populate({
            path: 'category', 
            model: Category,
            select: '_id name'
        });
}

export const createEvent = async ({ event, userId, path } : CreateEventParams) => {
    try {

        await connectToDatabase();

        const organizer = await User.findById(userId);

        if(!organizer) {
            throw new Error("Organizer not found");
        }

        const newEvent = await Event.create({
            ...event, 
            category: event.categoryId, 
            organizer: userId
        });

        return cloneObject(newEvent);

    } catch(error) {
        handleError(error)
    }
}

export const getEventById = async (id: string) => {
    try {
        await connectToDatabase();

        const event = await populateEvent(Event.findById(id));

        if(!event) {
            throw new Error("Event not found");
        }

        return cloneObject(event);

    } catch(error) {
        handleError(error);
    }
}

export async function deleteEvent({ eventId, path }: DeleteEventParams) {
    try {

        await connectToDatabase();
        
        const deletedEvent = await Event.findByIdAndDelete(eventId);
        if (deletedEvent) revalidatePath(path);

    } catch (error) {
        handleError(error)
    }
}

export const getAllEvents = async ({ query, limit = 6, page, category } : GetAllEventsParams) => {
    try {
        await connectToDatabase();

        const conditions = {};
        const eventQuery = Event.find(conditions)
            .sort({ createdAt: 'desc' })
            .skip(0)
            .limit(limit);

        const events = await populateEvent(eventQuery)
        const eventsCount = await Event.countDocuments(conditions);

        return {
            data: cloneObject(events),
            totalPages: Math.ceil(eventsCount / limit)
        };

    } catch(error) {
        handleError(error);
    }
}

