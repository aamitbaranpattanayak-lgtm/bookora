import React, { useState } from "react";
import { Calendar, MapPin, Ticket, QrCode, Clock, Trash2, AlertCircle } from "lucide-react";
import { bookingService } from "../../services/api";

export const TicketCard = ({ booking, onCancelSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { _id, event, quantity, totalAmount, bookingStatus, paymentStatus, createdAt } = booking;

  const isCancelled = bookingStatus === "cancelled";

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    setLoading(true);
    setError("");

    try {
      await bookingService.cancelBooking(_id);
      if (onCancelSuccess) onCancelSuccess(_id);
    } catch (err) {
      setError(err.message || "Failed to cancel booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`bg-[#18181B] border rounded-2xl overflow-hidden transition-all duration-300 ${
      isCancelled ? "opacity-50 border-[#27272A]" : "border-[#27272A] hover:border-[#3F3F46]"
    }`}>
      <div className="flex flex-col md:flex-row">
        
        {/* Left Photograph Strip */}
        <div className="md:w-1/3 relative h-40 md:h-auto min-h-[160px] bg-[#111113] overflow-hidden">
          <img
            src={event?.bannerImage || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80"}
            alt={event?.title}
            className="w-full h-full object-cover"
          />
          
          <div className="absolute top-3 left-3">
            <span className={`text-[10px] uppercase tracking-widest font-bold px-2.5 py-0.5 rounded-md ${
              isCancelled ? "bg-red-500/20 text-red-300 border border-red-500/30" : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
            }`}>
              {bookingStatus}
            </span>
          </div>
        </div>

        {/* Details Main Body */}
        <div className="p-6 md:w-2/3 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs text-[#A1A1AA] mb-1">
              <span className="font-mono text-[#FAFAFA]">REF: #{_id}</span>
              <span>Booked {new Date(createdAt).toLocaleDateString()}</span>
            </div>

            <h3 className="text-xl font-bold text-[#FAFAFA] mb-2">{event?.title || "Event Pass"}</h3>

            <div className="grid grid-cols-2 gap-2 text-xs text-[#A1A1AA] py-2 border-y border-[#27272A] my-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-[#A1A1AA]" />
                <span>{event?.startDate ? new Date(event.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "N/A"}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#E11D48]" />
                <span className="truncate">{event?.city || "Venue Location"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Ticket className="w-3.5 h-3.5 text-[#A1A1AA]" />
                <span><strong>{quantity}</strong> Pass(es)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#FAFAFA] text-sm">₹{totalAmount?.toLocaleString()}</span>
                <span className="text-[10px] text-[#A1A1AA]">({paymentStatus})</span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-[#A1A1AA]">
              <QrCode className="w-5 h-5 text-[#FAFAFA]" />
              <span className="hidden sm:inline text-[11px]">Present QR code at venue gate</span>
            </div>

            {!isCancelled && (
              <button
                onClick={handleCancel}
                disabled={loading}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                {loading ? "Cancelling..." : "Cancel Booking"}
              </button>
            )}
          </div>

          {error && (
            <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {error}
            </p>
          )}
        </div>

      </div>
    </div>
  );
};

export default TicketCard;
