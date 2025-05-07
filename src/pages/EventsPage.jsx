import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import SearchBar from "../components/events/SearchBar";
import FilterBar from "../components/events/FilterBar";
import EventCard from "../components/events/EventCard";
import Pagination from "../components/events/Pagination";

const ITEMS_PER_PAGE = 8;

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [filters, setFilters] = useState({
    dateRange: "all",
    priceRange: "all",
    location: "",
  });
  const [error, setError] = useState(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const timeoutId = setTimeout(() => {
        console.log("Events fetch taking longer than expected...");
      }, 3000);

      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("status", "active")
        .order("date", { ascending: true });

      clearTimeout(timeoutId);

      if (error) throw error;

      setEvents(data || []);
      setFilteredEvents(data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
      setError("Failed to load events. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();

    return () => {};
  }, [fetchEvents]);

  const applyFilters = useCallback(() => {
    let filtered = [...events];

    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (category) {
      filtered = filtered.filter((event) => event.category === category);
    }

    if (filters.dateRange !== "all") {
      const now = new Date();
      let weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      let monthAgo = new Date();
      monthAgo.setMonth(now.getMonth() - 1);
      filtered = filtered.filter((event) => {
        if (!event.date) return false;
        const eventDate = new Date(event.date);
        switch (filters.dateRange) {
          case "today":
            return eventDate.toDateString() === now.toDateString();
          case "week":
            return eventDate >= weekAgo;
          case "month":
            return eventDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    if (filters.priceRange !== "all") {
      filtered = filtered.filter((event) => {
        if (event.price === undefined) return false;
        switch (filters.priceRange) {
          case "free":
            return event.price === 0;
          case "paid":
            return event.price > 0;
          case "under50":
            return event.price < 50;
          case "under100":
            return event.price < 100;
          default:
            return true;
        }
      });
    }

    if (filters.location) {
      filtered = filtered.filter((event) =>
        event.location?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
    setCurrentPage(1);
  }, [events, searchTerm, category, filters]);

  useEffect(() => {
    applyFilters();
  }, [events, searchTerm, filters, category, applyFilters]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleCategoryChange = (cat) => {
    setCategory(cat);
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRefresh = () => {
    fetchEvents();
  };

  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedEvents = filteredEvents.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Events</h1>
          {!loading && (
            <button
              onClick={handleRefresh}
              className="flex items-center text-purple-600 hover:text-purple-800"
            >
              <svg
                className="w-5 h-5 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </button>
          )}
        </div>

        <div className="mb-8 flex flex-col gap-4">
          <SearchBar
            onSearch={handleSearch}
            onCategoryChange={handleCategoryChange}
            disabled={loading}
          />
          <FilterBar onFilter={handleFilter} disabled={loading} />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
            <p className="text-gray-600">Loading events...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-red-50 rounded-lg">
            <h3 className="text-lg font-medium text-red-800 mb-2">{error}</h3>
            <button
              onClick={handleRefresh}
              className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
            >
              Try Again
            </button>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-12 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No events found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search or filters to find what you're looking
              for.
            </p>
            {(searchTerm ||
              category ||
              filters.dateRange !== "all" ||
              filters.priceRange !== "all" ||
              filters.location) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setCategory("");
                  setFilters({
                    dateRange: "all",
                    priceRange: "all",
                    location: "",
                  });
                }}
                className="px-4 py-2 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
