import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, Calendar, Clock, ArrowUpRight } from "lucide-react";

export const EventCard = ({ event, onBookClick }) => {
  const navigate = useNavigate();
  const {
    _id,
    title,
    bannerImage,
    city,
    venue,
    startDate,
    startTime,
    ticketPrice,
    availableSeats,
    totalSeats,
    featured,
  } = event;

  const formattedDate = new Date(startDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="editorial-card rounded-2xl overflow-hidden flex flex-col group relative">
      
      {/* Event Photograph Container */}
      <div className="relative h-60 w-full overflow-hidden bg-[#111113]">
        <img
          src={bannerImage || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80"}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Featured Tag */}
        {featured && (
          <div className="absolute top-4 left-4 bg-[#09090B]/90 backdrop-blur-sm text-[#FAFAFA] text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-md border border-[#27272A]">
            Curated
          </div>
        )}

        {/* Price Tag Badge */}
        <div className="absolute bottom-4 right-4 bg-[#09090B]/90 backdrop-blur-sm px-3.5 py-1.5 rounded-lg border border-[#27272A] text-[#FAFAFA] text-xs font-bold shadow-md">
          ₹{ticketPrice.toLocaleString()}
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Date & Location */}
          <div className="flex items-center justify-between text-xs text-[#A1A1AA] font-medium mb-2.5">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#A1A1AA]" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#E11D48]" />
              {city}
            </span>
          </div>

          {/* Event Title */}
          <Link to={`/events/${_id}`}>
            <h3 className="text-lg font-bold text-[#FAFAFA] group-hover:text-white transition-colors line-clamp-2 leading-snug">
              {title}
            </h3>
          </Link>

          {/* Venue */}
          <p className="text-xs text-[#A1A1AA] mt-1.5 truncate">
            {venue}
          </p>
        </div>

        {/* Seat Availability & Book Action */}
        <div className="pt-4 border-t border-[#27272A] flex items-center justify-between gap-3">
          <span className="text-xs text-[#A1A1AA]">
            <strong className="text-[#FAFAFA]">{availableSeats}</strong> seats left
          </span>

          <div className="flex items-center gap-2">
            <Link
              to={`/events/${_id}`}
              className="p-2.5 rounded-lg bg-[#111113] hover:bg-[#27272A] text-[#FAFAFA] transition-colors border border-[#27272A]"
              title="View Experience Details"
            >
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <button
              onClick={() => onBookClick ? onBookClick(event) : navigate(`/events/${_id}`)}
              disabled={availableSeats <= 0}
              className="px-4 py-2 text-xs font-bold rounded-lg bg-[#E11D48] hover:bg-[#BE123C] text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {availableSeats > 0 ? "Book Event" : "Sold Out"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EventCard;
