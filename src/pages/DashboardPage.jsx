import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";

const DashboardPage = () => {
  const { user } = useAuth();
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRegisteredEvents = async () => {
    try {
      setLoading(true);
      console.log("Fetching events for user:", user.id);

      // First, let's check if we have any registrations
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
            description
          )
        `
        )
        .eq("user_id", user.id);

      console.log("Registrations data:", registrations);

      if (regError) {
        console.error("Error fetching registrations:", regError);
        throw regError;
      }

      // Transform the data to get the event details
      const events = registrations.map((reg) => ({
        ...reg.events,
        registration_id: reg.id,
      }));

      console.log("Transformed events:", events);
      setRegisteredEvents(events);
    } catch (error) {
      console.error("Error in fetchRegisteredEvents:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchRegisteredEvents();
    }
  }, [user]);

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h2 className="text-xl font-semibold text-gray-900">
                Your Registered Events
              </h2>
              <p className="mt-2 text-sm text-gray-700">
                A list of all events you've registered for
              </p>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          {loading ? (
            <div className="mt-8 text-center">Loading events...</div>
          ) : registeredEvents.length === 0 ? (
            <div className="mt-8 text-center text-gray-500">
              You haven't registered for any events yet.
              <div className="mt-4">
                <Link
                  to="/events"
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  Browse Events
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-8 flex flex-col">
              <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
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
                        {registeredEvents.map((event) => (
                          <tr key={event.id}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                              <Link
                                to={`/events/${event.id}`}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                {event.name}
                              </Link>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {new Date(event.date).toLocaleDateString()}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {event.location}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              <span
                                className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                  event.status === "active"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {event.status}
                              </span>
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              <button
                                onClick={async () => {
                                  try {
                                    const { error } = await supabase
                                      .from("registrations")
                                      .delete()
                                      .eq("id", event.registration_id);
                                    if (error) throw error;
                                    fetchRegisteredEvents();
                                  } catch (error) {
                                    setError(error.message);
                                  }
                                }}
                                className="text-red-600 hover:text-red-900"
                              >
                                Cancel Registration
                              </button>
                            </td>
                          </tr>
                        ))}
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
