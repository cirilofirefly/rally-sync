import Collection from "@/components/shared/Collection";
import { Button } from "@/components/ui/button";
import { getAllEvents } from "@/lib/actions/event.actions";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {

  const events = await getAllEvents({
    query: '',
    category: '',
    page: 1,
    limit: 6
  });

  return (
    <>
    <section className="bg-primary-50 bg-dotted-pattern bg-contain py-5 md:py-10">
      <div className="wrapper grid grid-cols-1 gap-5 md:grid-cols-2 2xl:gap-0">
        <div className="flex flex-col justify-center gap-8">
          <h1 className="h1-bold">Elevate Your Events with Seamless Coordination</h1>
          <p className="p-regular-20 md:p-regular-24">Transform your event planning into a flawless experience. With RallySync, every detail is effortlessly managed, ensuring your events are unforgettable from start to finish.</p>
          <Button size="lg" asChild className="button w-full sm:w-fit">
            <Link href="#events">Explore Now</Link>
          </Button>
        </div>
        <Image 
          alt="Rally Sync's Hero" 
          src="/assets/images/hero.png"
          height={1000}
          width={1000}
          className="max-h-[70vh] object-contain object-center 2xl:max-h-[50vh]"
        />
      </div>
    </section>

    <section id="events" className="wrapper my-8 flex flex-col gap-8 md:gap-12">
      <h2 className="h2-bold">Trusted with Thousands of Events</h2>
      <div className="flex w-full flex-col gap-5 md:flex-row">
        Search
        Category
      </div>

      <Collection
        data={events?.data}
        emptyTitle="No Events Found"
        emptyStateSubtext="Coming soon..."
        collectionType="All_Events"
        limit={6}
        page={1}
        totalPage={2}
      />
    </section>
    </>
  );
}
