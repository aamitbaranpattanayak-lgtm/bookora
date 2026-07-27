import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Calendar, Clock, MapPin, Ticket, Shield, ArrowLeft, CheckCircle, Info } from "lucide-react";
import { eventService } from "../services/api";
import { useAuth } from "../context/AuthContext";
import BookingModal from "../components/bookings/BookingModal";

export const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, openAuth } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    eventService
      .getEventById(id)
      .then((res) => {
        if (res.data) setEvent(res.data);
      })
      .catch((err) => {
        setError(err.message || "Failed to load event details");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center space-y-4">
        <div className="w-10 h-10 rounded-full border-2 border-[#E11D48] border-t-transparent animate-spin mx-auto" />
        <p className="text-xs text-[#A1A1AA]">Loading experience details...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="max-w-md mx-auto px-6 py-24 text-center space-y-4">
        <div className="p-4 rounded-xl bg-red-500/10 text-red-300 text-xs">
          {error || "Event not found"}
        </div>
        <Link to="/events" className="inline-flex items-center gap-2 text-xs text-[#E11D48] hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Catalog
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(event.startDate).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const handleBookTrigger = () => {
    if (!isAuthenticated) {
      openAuth("login");
    } else {
      setIsBookingOpen(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-12">
      
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Experiences
      </button>

      {/* Main Header & Image Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left: Cinematic Photograph */}
        <div className="lg:col-span-8 space-y-6">
          <div className="relative rounded-[24px] overflow-hidden bg-[#111113] border border-[#27272A] shadow-2xl h-[380px] sm:h-[480px]">
            <img
              src={event.bannerImage || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80"}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Title & Metadata */}
          <div className="space-y-4">
            <span className="text-xs font-bold text-[#E11D48] tracking-widest uppercase">
              {event.city} • EXPERIENCE
            </span>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#FAFAFA] leading-tight">
              {event.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-xs text-[#A1A1AA] pt-2 font-medium">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#FAFAFA]" />
                {formattedDate}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#FAFAFA]" />
                {event.startTime} - {event.endTime}
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#E11D48]" />
                {event.venue}, {event.city}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Reservation Card */}
        <div className="lg:col-span-4 bg-[#18181B] p-6 sm:p-8 rounded-2xl border border-[#27272A] shadow-2xl space-y-6">
          <div>
            <span className="text-xs text-[#A1A1AA] block font-medium">Ticket Price</span>
            <span className="text-4xl font-extrabold text-[#FAFAFA]">₹{event.ticketPrice?.toLocaleString()}</span>
          </div>

          <div className="space-y-2 text-xs border-y border-[#27272A] py-4 text-[#A1A1AA]">
            <div className="flex justify-between">
              <span>Available Capacity</span>
              <strong className="text-[#FAFAFA]">{event.availableSeats} / {event.totalSeats}</strong>
            </div>
            <div className="flex justify-between">
              <span>Pass Type</span>
              <strong className="text-[#FAFAFA]">Digital Entry QR</strong>
            </div>
          </div>

          <button
            onClick={handleBookTrigger}
            disabled={event.availableSeats <= 0}
            className="w-full py-3.5 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-40"
          >
            <Ticket className="w-4 h-4" />
            {event.availableSeats > 0 ? "Book Tickets Now" : "Sold Out"}
          </button>

          <p className="text-[11px] text-center text-[#A1A1AA]">
            Instant confirmation & QR code entry pass
          </p>
        </div>

      </div>

      {/* Description Section */}
      <div className="max-w-4xl space-y-4 pt-6 border-t border-[#27272A]">
        <h2 className="text-xl font-bold text-[#FAFAFA]">About This Experience</h2>
        <p className="text-sm text-[#A1A1AA] leading-relaxed whitespace-pre-line">
          {event.description}
        </p>
      </div>

      {/* Booking Modal */}
      {isBookingOpen && (
        <BookingModal
          event={event}
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
        />
      )}

    </div>
  );
};

export default EventDetailPage;
