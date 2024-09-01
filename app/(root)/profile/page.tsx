import Collection from "@/components/shared/Collection";
import { Button } from "@/components/ui/button";
import { getEventsByUser } from "@/lib/actions/event.actions";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import React from "react";

const ProfilePage = async () => {

    const { sessionClaims } = auth();
    const userId = sessionClaims?.userId as string;

    const createdEvents = await getEventsByUser({userId, limit: 3, page: 1});

    return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h1 className="h3-bold text-center md:text-left">My Tickets</h1>
          <Button asChild size="lg" className="button hidden sm:flex">
            <Link href="/#events">Explore More Events</Link>
          </Button>
        </div>
      </section>

      <section className="wrapper my-8">
        <Collection
          data={[]}
          emptyTitle="No event purchased yet"
          emptyStateSubtext="More exciting events is coming. Explore now!"
          collectionType="My_Tickets"
          limit={3}
          page={1}
          urlParamName="ordersPage"
          totalPage={2}
        />
      </section>

      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h1 className="h3-bold text-center md:text-left">Events Organized</h1>
          <Button asChild size="lg" className="button hidden sm:flex">
            <Link href="/events/create">Create New Event</Link>
          </Button>
        </div>
      </section>

      <section className="wrapper my-8">
        <Collection
          data={createdEvents?.data}
          emptyTitle="No event have been created yet"
          emptyStateSubtext="Let's create an event to explore by your audience!"
          collectionType="Events_Organized"
          limit={6}
          page={1}
          urlParamName="eventsPage"
          totalPage={2}
        />
      </section>

    </>
  );
};

export default ProfilePage;
