import { IEvent } from "@/lib/mongodb/database/models/event.model";
import { formatDateTime, formatPrice } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { DeleteConfirmation } from "./DeleteConfirmation";
import { deleteEvent } from "@/lib/actions/event.actions";

type CardProps = {
  event: IEvent;
  hasOrderLink?: boolean;
  hidePrice?: boolean;
};

const Card = ({ event, hasOrderLink, hidePrice }: CardProps) => {

  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;
  const isEventCreator = userId === event.organizer._id.toString();

  return (
    <div className="group relative flex min-h-[380px] w-full max-w-[400px] flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg md:min-h-[438px]">
      <div
        style={{ backgroundImage: `url(${event.imageUrl})` }}
        className="flex-center flex-grow bg-gray-50 bg-cover bg-center text-grey-500"
      >
        {isEventCreator && !hidePrice && (
          <div className="absolute right-2 top-2 flex flex-col gap-4 rounded-xl bg-white p-3 shadow-sm transition-all">
            <Link href={`/events/${event._id}/update`}>
              <Image 
                src="/assets/icons/edit.svg" 
                alt="Edit Logo" 
                width={20} 
                height={20}
              />
            </Link>
            <DeleteConfirmation 
              id={event._id} 
              title="Are you sure you want to delete?"
              description="This will permanently delete this event"
            />
          </div>
        )}
      </div>
      <div
        className="flex min-h-[230px] flex-col gap-3 p-5 md:gap-4"
      >
        {hidePrice && (
          <div className="flex gap-2">
            <span className="p-semibold-14 w-min rounded-full bg-green-100 px-4 py-1 text-green-60">
              {event.isFree ? "FREE" : `${formatPrice(event.price as string)}`}
            </span>
            <p className="p-semibold-14 w-min line-clamp-1 rounded-full bg-green-500/10 px-4 py-1 text-grey-500">
              {event.category.name}
            </p>
          </div>
        )}
        <p className="p-medium-16 text-grey-500">
          {formatDateTime(event.startDateTime).dateTime}
        </p>
        <Link href={`/events/${event._id}`}>
          <p className="p-medium-16 md:p-medium-20 line-clamp-2 flex-1 text-black">
            {event.title}
          </p>
        </Link>
        <div className="flex-between w-full">
          <p className="p-medium-14 md:p-medium-16 text-grey-600">
            {`${event.organizer.firstName} ${event.organizer.lastName}`}
          </p>
          {hasOrderLink && (
            <Link className="fle gap-2" href={`/orders?eventId=${event._id}`}>
              <p className="text-primary-500">Order Details</p>
              <Image
                src="/assets/icons/arrow.svg"
                alt="Arrow icon"
                width={10}
                height={10}
              />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
