import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

const getGoogleCalendarUrl = (event) => {
  const start = new Date(event.date).toISOString().replace(/-|:|\.\d\d\d/g, "");
  const end = new Date(new Date(event.date).getTime() + 2 * 60 * 60 * 1000)
    .toISOString()
    .replace(/-|:|\.\d\d\d/g, "");
  const details = [event.description, `Location: ${event.location}`].join(
    "%0A"
  );
  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    event.name
  )}&dates=${start}/${end}&details=${encodeURIComponent(
    details
  )}&location=${encodeURIComponent(event.location)}`;
};

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registered, setRegistered] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEvent();
  }, [id]);

  useEffect(() => {
    if (user && event) checkRegistration();
  }, [user, event]);

  const fetchEvent = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      setError("Event not found.");
      setLoading(false);
      return;
    }
    setEvent(data);
    setLoading(false);
  };

  const checkRegistration = async () => {
    const { data } = await supabase
      .from("registrations")
      .select("*")
      .eq("event_id", id)
      .eq("user_id", user.id)
      .eq("status", "confirmed")
      .single();
    setRegistered(!!data);
  };

  const handleRegister = async () => {
    setRegLoading(true);
    setError("");

    const { error: regError } = await supabase.from("registrations").insert({
      event_id: id,
      user_id: user.id,
      status: "confirmed",
    });

    if (regError) {
      setError(regError.message);
      setRegLoading(false);
      return;
    }

    const { error: updateError } = await supabase
      .from("events")
      .update({ current_attendees: event.current_attendees + 1 })
      .eq("id", id);

    if (updateError) {
      setError(updateError.message);
      await supabase
        .from("registrations")
        .delete()
        .eq("event_id", id)
        .eq("user_id", user.id);
    } else {
      setRegistered(true);
      setEvent((prev) => ({
        ...prev,
        current_attendees: prev.current_attendees + 1,
      }));
    }

    setRegLoading(false);
  };

  const handleUnregister = async () => {
    setRegLoading(true);
    setError("");
    const { error } = await supabase
      .from("registrations")
      .delete()
      .eq("event_id", id)
      .eq("user_id", user.id);
    if (error) setError(error.message);
    else setRegistered(false);
    setRegLoading(false);
  };

  if (loading)
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  if (error)
    return <div className="text-center py-16 text-red-600">{error}</div>;
  if (!event) return null;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-purple-600 hover:underline"
      >
        &larr; Back to Events
      </button>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <img
          src={event.image_url}
          alt={event.name}
          className="w-full h-64 object-cover"
        />
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-gray-900">{event.name}</h1>
            {event.category && (
              <span className="bg-purple-600 text-white px-4 py-1 rounded-full text-xs font-semibold shadow-md">
                {event.category}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 text-gray-500 text-sm mb-4">
            <span>
              <svg
                className="w-4 h-4 inline mr-1"
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
              {new Date(event.date).toLocaleString()}
            </span>
            <span>
              <svg
                className="w-4 h-4 inline mr-1"
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
              {event.location}
            </span>
            <span>
              <svg
                className="w-4 h-4 inline mr-1"
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
              {event.current_attendees}/{event.max_attendees} attendees
            </span>
          </div>
          <p className="text-gray-700 mb-6">{event.description}</p>
          {user ? (
            <div className="flex gap-4 items-center">
              {registered ? (
                <button
                  onClick={handleUnregister}
                  disabled={regLoading}
                  className="bg-red-100 text-red-700 px-6 py-2 rounded-lg font-semibold hover:bg-red-200 transition"
                >
                  {regLoading ? "Unregistering..." : "Unregister"}
                </button>
              ) : (
                <button
                  onClick={handleRegister}
                  disabled={regLoading}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
                >
                  {regLoading ? "Registering..." : "Register"}
                </button>
              )}
              {registered && (
                <a
                  href={getGoogleCalendarUrl(event)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-100 text-green-700 px-6 py-2 rounded-lg font-semibold hover:bg-green-200 transition"
                >
                  Add to Google Calendar
                </a>
              )}
            </div>
          ) : (
            <div className="text-gray-500">
              Sign in to register for this event.
            </div>
          )}
          {error && <div className="text-red-600 mt-4">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
