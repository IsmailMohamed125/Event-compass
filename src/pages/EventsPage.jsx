import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import SearchBar from "../components/events/SearchBar";
import FilterBar from "../components/events/FilterBar";
import EventCard from "../components/events/EventCard";
import Pagination from "../components/events/Pagination";

const ITEMS_PER_PAGE = 9;

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    dateRange: "all",
    priceRange: "all",
    location: "",
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [events, searchTerm, filters]);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("status", "active")
        .order("date", { ascending: true });

      if (error) throw error;
      setEvents(data || []);
      setFilteredEvents(data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...events];

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply date range filter
    if (filters.dateRange !== "all") {
      const now = new Date();
      filtered = filtered.filter((event) => {
        const eventDate = new Date(event.date);
        switch (filters.dateRange) {
          case "today":
            return eventDate.toDateString() === now.toDateString();
          case "week":
            const weekAgo = new Date(now.setDate(now.getDate() - 7));
            return eventDate >= weekAgo;
          case "month":
            const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
            return eventDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    // Apply price range filter
    if (filters.priceRange !== "all") {
      filtered = filtered.filter((event) => {
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

    // Apply location filter
    if (filters.location) {
      filtered = filtered.filter((event) =>
        event.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedEvents = filteredEvents.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Events</h1>

        {/* Search and Filter Section */}
        <div className="mb-8 space-y-4">
          <SearchBar onSearch={handleSearch} />
          <FilterBar onFilter={handleFilter} />
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No events found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filters to find what you're looking
              for.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
