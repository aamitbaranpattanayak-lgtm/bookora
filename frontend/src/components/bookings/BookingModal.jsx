import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Calendar, MapPin, Plus, Minus, CheckCircle, AlertCircle } from "lucide-react";
import { bookingService } from "../../services/api";

export const BookingModal = ({ event, isOpen, onClose, onBookingSuccess }) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const navigate = useNavigate();

  if (!isOpen || !event) return null;

  const totalAmount = (event.ticketPrice || 0) * quantity;

  const handleConfirm = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await bookingService.createBooking({
        eventId: event._id,
        quantity,
      });

      if (res.data) {
        setConfirmedBooking(res.data);
        if (onBookingSuccess) onBookingSuccess(res.data);
      }
    } catch (err) {
      setError(err.message || "Failed to confirm booking");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setConfirmedBooking(null);
    setQuantity(1);
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#111113] rounded-2xl p-6 sm:p-8 border border-[#27272A] shadow-2xl overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 text-[#A1A1AA] hover:text-[#FAFAFA] rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {!confirmedBooking ? (
          <div className="space-y-6">
            <div>
              <span className="text-[11px] font-bold text-[#E11D48] tracking-widest uppercase">
                Reservation Summary
              </span>
              <h3 className="text-xl font-extrabold text-[#FAFAFA] mt-1 line-clamp-1">{event.title}</h3>
            </div>

            {/* Event Info Card */}
            <div className="p-4 rounded-xl bg-[#18181B] border border-[#27272A] space-y-2 text-xs">
              <div className="flex items-center justify-between text-[#FAFAFA]">
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-[#A1A1AA]" /> {new Date(event.startDate).toLocaleDateString()}</span>
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#E11D48]" /> {event.city}</span>
              </div>
              <div className="flex items-center justify-between text-[#A1A1AA] pt-2 border-t border-[#27272A]">
                <span>Available Seats: <strong className="text-[#FAFAFA]">{event.availableSeats}</strong></span>
                <span>Price per pass: <strong className="text-[#FAFAFA]">₹{event.ticketPrice}</strong></span>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Counter */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#FAFAFA]">Select Quantity</span>
                <div className="flex items-center gap-3 bg-[#18181B] p-1.5 rounded-xl border border-[#27272A]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#111113] text-[#FAFAFA] border border-[#27272A] disabled:opacity-30"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center font-bold text-sm text-[#FAFAFA]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(event.availableSeats, quantity + 1))}
                    disabled={quantity >= event.availableSeats}
                    className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#E11D48] text-white disabled:opacity-30"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Total Calculation */}
              <div className="p-4 rounded-xl bg-[#18181B] border border-[#27272A] flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#A1A1AA] block font-medium">Total Price</span>
                  <span className="text-[10px] text-[#A1A1AA]">Includes digital entry pass</span>
                </div>
                <span className="text-2xl font-extrabold text-[#FAFAFA]">
                  ₹{totalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={handleConfirm}
              disabled={loading || event.availableSeats <= 0}
              className="w-full py-3.5 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white font-bold text-xs transition-colors disabled:opacity-40"
            >
              {loading ? "Confirming..." : `Confirm Booking — ₹${totalAmount.toLocaleString()}`}
            </button>
          </div>
        ) : (
          /* Success State */
          <div className="text-center space-y-4 py-4 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-extrabold text-[#FAFAFA]">Reservation Confirmed</h3>
            <p className="text-xs text-[#A1A1AA] max-w-xs mx-auto">
              Your pass for <strong className="text-[#FAFAFA]">{event.title}</strong> is ready in your wallet.
            </p>

            <div className="p-4 rounded-xl bg-[#18181B] border border-[#27272A] text-left space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-[#A1A1AA]">Reference Code:</span>
                <span className="font-mono text-[#FAFAFA] font-bold">{confirmedBooking._id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A1A1AA]">Passes Reserved:</span>
                <span className="text-[#FAFAFA] font-bold">{quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A1A1AA]">Total Paid:</span>
                <span className="text-[#FAFAFA] font-bold">₹{confirmedBooking.totalAmount}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleClose}
                className="flex-1 py-2.5 rounded-xl bg-[#18181B] text-[#A1A1AA] hover:text-[#FAFAFA] text-xs font-semibold border border-[#27272A]"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleClose();
                  navigate("/my-bookings");
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#E11D48] text-white text-xs font-bold hover:bg-[#BE123C]"
              >
                View Ticket Wallet
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default BookingModal;
