import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";

const DashboardPage = () => {
  const { user } = useAuth();
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const fetchRegisteredEvents = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data: registrations, error: regError } = await supabase
        .from("registrations")
        .select(
          `
          id,
          event_id,
          user_id,
          events!inner (
            id,
            name,
            date,
            location,
            status,
            description,
            category
          )
        `
        )
        .eq("user_id", user.id);

      if (regError) {
        console.error("Error fetching registrations:", regError);
        throw regError;
      }

      const events = registrations.map((reg) => ({
        ...reg.events,
        registration_id: reg.id,
      }));

      setRegisteredEvents(events);
    } catch (error) {
      console.error("Error in fetchRegisteredEvents:", error);
      setError(
        "Failed to load your registered events. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchRegisteredEvents();
  }, [fetchRegisteredEvents]);

  const cancelRegistration = async (registrationId) => {
    if (!confirm("Are you sure you want to cancel this registration?")) {
      return;
    }

    try {
      setError(null);
      const { error } = await supabase
        .from("registrations")
        .delete()
        .eq("id", registrationId);

      if (error) throw error;
      fetchRegisteredEvents();
    } catch (error) {
      setError("Failed to cancel registration. Please try again.");
    }
  };

  const filteredEvents = registeredEvents.filter((event) => {
    const eventDate = new Date(event.date);
    const today = new Date();

    if (activeFilter === "upcoming") {
      return eventDate >= today;
    } else if (activeFilter === "past") {
      return eventDate < today;
    }
    return true;
  });

  filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="py-6 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Your Dashboard</h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="sm:flex-auto">
              <h2 className="text-xl font-semibold text-gray-900">
                Your Registered Events
              </h2>
              <p className="mt-2 text-sm text-gray-700">
                View and manage events you've registered for
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Link
                to="/events"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-shadow-amber-50 bg-indigo-600 hover:bg-indigo-700"
              >
                Find New Events
              </Link>
            </div>
          </div>

          <div className="mt-4 flex space-x-2">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                activeFilter === "all"
                  ? "bg-indigo-100 text-indigo-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Events
            </button>
            <button
              onClick={() => setActiveFilter("upcoming")}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                activeFilter === "upcoming"
                  ? "bg-indigo-100 text-indigo-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setActiveFilter("past")}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                activeFilter === "past"
                  ? "bg-indigo-100 text-indigo-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Past
            </button>
          </div>

          {error && (
            <div className="mt-4 rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          {loading ? (
            <div className="mt-8 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="mt-12 text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                No events found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {activeFilter !== "all"
                  ? `You don't have any ${activeFilter} events.`
                  : "You haven't registered for any events yet."}
              </p>
              <div className="mt-6">
                <Link
                  to="/events"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Browse Events
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-8 flex flex-col">
              <div className="-my-2 -mx-4 sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle">
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                          >
                            Event Name
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Date
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Location
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Category
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Status
                          </th>
                          <th
                            scope="col"
                            className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                          >
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {filteredEvents.map((event) => {
                          const eventDate = new Date(event.date);
                          const isPast = eventDate < new Date();

                          return (
                            <tr
                              key={event.id}
                              className={isPast ? "bg-gray-50" : ""}
                            >
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                <Link
                                  to={`/events/${event.id}`}
                                  className="text-indigo-600 hover:text-indigo-900"
                                >
                                  {event.name}
                                </Link>
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {eventDate.toLocaleDateString(undefined, {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                                <div className="text-xs text-gray-400">
                                  {eventDate.toLocaleTimeString(undefined, {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </div>
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {event.location}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {event.category || "N/A"}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                <span
                                  className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                    isPast
                                      ? "bg-gray-100 text-gray-800"
                                      : event.status === "active"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {isPast ? "Completed" : event.status}
                                </span>
                              </td>
                              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                {!isPast && (
                                  <button
                                    onClick={() =>
                                      cancelRegistration(event.registration_id)
                                    }
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    Cancel
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
