import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Filter, MapPin, SlidersHorizontal, RefreshCw } from "lucide-react";
import { useEvents } from "../context/EventContext";
import { useAuth } from "../context/AuthContext";
import EventCard from "../components/events/EventCard";
import BookingModal from "../components/bookings/BookingModal";

export const EventsPage = () => {
  const { events, categories, loading } = useEvents();
  const { openAuth, isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "all");
  const [selectedCity, setSelectedCity] = useState("all");
  const [sortBy, setSortBy] = useState("date"); // 'date' | 'price-low' | 'price-high'

  const [bookingEvent, setBookingEvent] = useState(null);

  const cities = useMemo(() => {
    const list = new Set(events.map((e) => e.city).filter(Boolean));
    return ["all", ...Array.from(list)];
  }, [events]);

  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      const matchSearch =
        !searchTerm ||
        evt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evt.venue.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCat =
        selectedCategory === "all" ||
        evt.category === selectedCategory ||
        evt.category?._id === selectedCategory;

      const matchCity =
        selectedCity === "all" ||
        evt.city.toLowerCase() === selectedCity.toLowerCase();

      return matchSearch && matchCat && matchCity;
    }).sort((a, b) => {
      if (sortBy === "price-low") return a.ticketPrice - b.ticketPrice;
      if (sortBy === "price-high") return b.ticketPrice - a.ticketPrice;
      return new Date(a.startDate) - new Date(b.startDate);
    });
  }, [events, searchTerm, selectedCategory, selectedCity, sortBy]);

  const handleBookClick = (event) => {
    if (!isAuthenticated) {
      openAuth("login");
    } else {
      setBookingEvent(event);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedCity("all");
    setSortBy("date");
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-10">
      
      {/* Header Title */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-[#E11D48] tracking-widest uppercase">
          COMPLETE DISCOVERY CATALOG
        </span>
        <h1 className="text-4xl font-extrabold text-[#FAFAFA]">Explore Experiences</h1>
        <p className="text-xs text-[#A1A1AA]">Filter by category, city, ticket pricing, or search by keyword.</p>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#111113] p-4 rounded-2xl border border-[#27272A] space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Keyword Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search experience..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl editorial-input"
            />
            <Search className="w-4 h-4 text-[#A1A1AA] absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* Category Dropdown */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl editorial-input bg-[#111113] text-[#FAFAFA] cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
            <Filter className="w-4 h-4 text-[#E11D48] absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* City Dropdown */}
          <div className="relative">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl editorial-input bg-[#111113] text-[#FAFAFA] cursor-pointer"
            >
              <option value="all">All Cities</option>
              {cities.filter(c => c !== "all").map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            <MapPin className="w-4 h-4 text-[#A1A1AA] absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* Sort By Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl editorial-input bg-[#111113] text-[#FAFAFA] cursor-pointer"
            >
              <option value="date">Date: Soonest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
            <SlidersHorizontal className="w-4 h-4 text-[#A1A1AA] absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#27272A] text-xs text-[#A1A1AA]">
          <span>Showing <strong>{filteredEvents.length}</strong> experience(s)</span>

          {(searchTerm || selectedCategory !== "all" || selectedCity !== "all") && (
            <button
              onClick={handleResetFilters}
              className="text-[#E11D48] hover:underline flex items-center gap-1 font-semibold"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-80 rounded-2xl bg-[#18181B] animate-pulse" />
          ))}
        </div>
      ) : filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((evt) => (
            <EventCard key={evt._id} event={evt} onBookClick={handleBookClick} />
          ))}
        </div>
      ) : (
        <div className="bg-[#111113] p-12 rounded-2xl text-center space-y-4 border border-[#27272A]">
          <h3 className="text-xl font-bold text-[#FAFAFA]">No Experiences Found</h3>
          <p className="text-xs text-[#A1A1AA] max-w-xs mx-auto">
            Try adjusting your search query or clearing city filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="py-2.5 px-5 rounded-lg bg-[#E11D48] text-white font-semibold text-xs"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Booking Modal */}
      {bookingEvent && (
        <BookingModal
          event={bookingEvent}
          isOpen={!!bookingEvent}
          onClose={() => setBookingEvent(null)}
        />
      )}

    </div>
  );
};

export default EventsPage;
