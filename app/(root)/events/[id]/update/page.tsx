import EventForm from "@/components/shared/EventForm";
import { getEventById } from "@/lib/actions/event.actions";
import { auth } from "@clerk/nextjs/server";

const UpdateEvent = async({ params: { id } }: { params: { id: string }}) => {

    const { sessionClaims } = auth();
    const userId = sessionClaims?.userId as string;
    const event = await getEventById(id);
    
    return (
        <>
            <section className="bg-primary-50 bg-dotted-pattern bg-cover py-5 md:py-10">
                <h3 className="wrapper h3-bold text-center sm:text-left">
                    Update Event
                </h3>
            </section>
    
            <div className="wrapper my-8">
                <EventForm userId={userId} event={event} type="Update" />
            </div>
        </>
      );
};

export default UpdateEvent;
