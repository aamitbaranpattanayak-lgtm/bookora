import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { TicketCheck, ArrowRight, RefreshCw, AlertCircle, QrCode } from "lucide-react";
import { bookingService } from "../services/api";
import TicketCard from "../components/bookings/TicketCard";

export const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterTab, setFilterTab] = useState("all");

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await bookingService.getMyBookings();
      if (res.data) setBookings(res.data);
    } catch (err) {
      setError(err.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleCancelSuccess = (cancelledId) => {
    setBookings((prev) =>
      prev.map((b) => (b._id === cancelledId ? { ...b, bookingStatus: "cancelled" } : b))
    );
  };

  const filteredBookings = bookings.filter((b) => {
    if (filterTab === "confirmed") return b.bookingStatus === "confirmed";
    if (filterTab === "cancelled") return b.bookingStatus === "cancelled";
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#27272A] pb-6">
        <div>
          <span className="text-xs font-bold text-[#E11D48] tracking-widest uppercase mb-1 block">
            DIGITAL TICKET WALLET
          </span>
          <h1 className="text-3xl font-extrabold text-[#FAFAFA]">My Bookings</h1>
          <p className="text-xs text-[#A1A1AA]">Manage entry passes, QR codes, and active reservations.</p>
        </div>

        <button
          onClick={fetchBookings}
          className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#18181B] hover:bg-[#27272A] text-[#FAFAFA] border border-[#27272A] transition-colors flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh List
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex p-1 rounded-lg bg-[#111113] border border-[#27272A] text-xs font-semibold max-w-sm">
        <button
          onClick={() => setFilterTab("all")}
          className={`flex-1 py-2 rounded-md transition-all ${
            filterTab === "all" ? "bg-[#18181B] text-[#FAFAFA] shadow-sm" : "text-[#A1A1AA] hover:text-[#FAFAFA]"
          }`}
        >
          All ({bookings.length})
        </button>
        <button
          onClick={() => setFilterTab("confirmed")}
          className={`flex-1 py-2 rounded-md transition-all ${
            filterTab === "confirmed" ? "bg-[#18181B] text-[#FAFAFA] shadow-sm" : "text-[#A1A1AA] hover:text-[#FAFAFA]"
          }`}
        >
          Active ({bookings.filter((b) => b.bookingStatus === "confirmed").length})
        </button>
        <button
          onClick={() => setFilterTab("cancelled")}
          className={`flex-1 py-2 rounded-md transition-all ${
            filterTab === "cancelled" ? "bg-[#18181B] text-[#FAFAFA] shadow-sm" : "text-[#A1A1AA] hover:text-[#FAFAFA]"
          }`}
        >
          Cancelled ({bookings.filter((b) => b.bookingStatus === "cancelled").length})
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-40 rounded-2xl bg-[#18181B] animate-pulse" />
          ))}
        </div>
      ) : filteredBookings.length > 0 ? (
        <div className="space-y-6">
          {filteredBookings.map((bk) => (
            <TicketCard key={bk._id} booking={bk} onCancelSuccess={handleCancelSuccess} />
          ))}
        </div>
      ) : (
        <div className="bg-[#111113] p-12 rounded-2xl text-center space-y-4 border border-[#27272A]">
          <h3 className="text-xl font-bold text-[#FAFAFA]">No Tickets in Wallet</h3>
          <p className="text-xs text-[#A1A1AA] max-w-xs mx-auto">
            You haven't reserved any tickets yet. Explore upcoming experiences!
          </p>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 py-2.5 px-5 rounded-lg bg-[#E11D48] text-white font-bold text-xs"
          >
            Explore Experiences <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

    </div>
  );
};

export default MyBookingsPage;
