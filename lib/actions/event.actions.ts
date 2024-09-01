"use server"

import { CreateEventParams, DeleteEventParams, GetAllEventsParams, GetEventsByUserParams, GetRelatedEventsByCategoryParams, UpdateEventParams } from "@/types"
import { connectToDatabase } from "../mongodb/database"
import { cloneObject, handleError } from "../utils";
import User from "../mongodb/database/models/user.model";
import Event, { IEvent } from "../mongodb/database/models/event.model";
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

export async function updateEvent({ userId, event, path }: UpdateEventParams) {
    try {
        await connectToDatabase()

        const eventToUpdate = await Event.findById(event._id)
        if (!eventToUpdate || eventToUpdate.organizer.toHexString() !== userId) {
            throw new Error('Unauthorized or event not found')
        }

        const updatedEvent = await Event.findByIdAndUpdate(
            event._id,
            { ...event, category: event.categoryId },
            { new: true }
        );

        revalidatePath(path)

        return cloneObject(updatedEvent)
    } catch (error) {
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

export async function getEventsByUser({ userId, limit = 6, page }: GetEventsByUserParams) {
    try {
        await connectToDatabase()

        const conditions = { organizer: userId }
        const skipAmount = (page - 1) * limit

        const eventsQuery = Event.find(conditions)
            .sort({ createdAt: 'desc' })
            .skip(skipAmount)
            .limit(limit)

        const events = await populateEvent(eventsQuery)
        const eventsCount = await Event.countDocuments(conditions)

        return { data: cloneObject(events), totalPages: Math.ceil(eventsCount / limit) }
    } catch (error) {
        handleError(error)
    }
}


export async function getRelatedEventsByCategory({
    categoryId,
    eventId,
    limit = 3,
    page = 1,
}: GetRelatedEventsByCategoryParams) {
    try {
        await connectToDatabase()

        const skipAmount = (Number(page) - 1) * limit
        const conditions = { $and: [{ category: categoryId }, { _id: { $ne: eventId } }] }

        const eventsQuery = Event.find(conditions)
            .sort({ createdAt: 'desc' })
            .skip(skipAmount)
            .limit(limit)

        const events = await populateEvent(eventsQuery)
        const eventsCount = await Event.countDocuments(conditions)

        return { data: cloneObject<IEvent[]>(events), totalPages: Math.ceil(eventsCount / limit) }
    } catch (error) {
        handleError(error)
    }
}