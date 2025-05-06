import { Link } from "react-router-dom";

const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const EventCard = ({ event }) => {
  return (
    <Link
      to={`/events/${event.id}`}
      className="block bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl border border-gray-100"
    >
      <div className="relative h-40">
        <img
          src={event.image_url}
          alt={event.name}
          className="w-full h-full object-cover"
        />
        {event.category && (
          <span className="absolute top-3 right-3 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md z-10">
            {event.category}
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col h-48 justify-between">
        <h3 className="text-base font-bold text-gray-900 mb-1 min-h-[2.5rem] flex items-center">
          {event.name}
        </h3>
        <p className="text-gray-600 mb-2 line-clamp-2 text-sm min-h-[2.5rem] flex items-center">
          {event.description}
        </p>
        <div className="flex flex-col gap-1 mt-2">
          <div className="flex items-center gap-2 text-gray-500 text-xs">
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>{formatDateTime(event.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500 text-xs">
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500 text-xs">
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"
              />
            </svg>
            <span>
              {event.current_attendees}/{event.max_attendees} attendees
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
