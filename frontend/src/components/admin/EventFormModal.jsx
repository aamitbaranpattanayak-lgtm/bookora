import React, { useState, useEffect } from "react";
import { X, AlertCircle } from "lucide-react";
import { eventService } from "../../services/api";

export const EventFormModal = ({ event, categories, isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    venue: "",
    city: "",
    startDate: "",
    endDate: "",
    startTime: "18:00",
    endTime: "22:00",
    ticketPrice: 1999,
    totalSeats: 250,
    bannerImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80",
    backgroundStyle: "gradient",
    featured: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || "",
        description: event.description || "",
        category: event.category?._id || event.category || "",
        venue: event.venue || "",
        city: event.city || "",
        startDate: event.startDate ? event.startDate.split("T")[0] : "",
        endDate: event.endDate ? event.endDate.split("T")[0] : "",
        startTime: event.startTime || "18:00",
        endTime: event.endTime || "22:00",
        ticketPrice: event.ticketPrice || 0,
        totalSeats: event.totalSeats || 100,
        bannerImage: event.bannerImage || "",
        backgroundStyle: event.backgroundStyle || "gradient",
        featured: !!event.featured,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        category: categories?.[0]?._id || "",
        venue: "",
        city: "",
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date().toISOString().split("T")[0],
        startTime: "18:00",
        endTime: "22:00",
        ticketPrice: 1999,
        totalSeats: 250,
        bannerImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80",
        backgroundStyle: "gradient",
        featured: false,
      });
    }
  }, [event, categories]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (event?._id) {
        await eventService.updateEvent(event._id, formData);
      } else {
        await eventService.createEvent(formData);
      }
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || "Failed to save event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#111113] rounded-2xl p-6 sm:p-8 border border-[#27272A] shadow-2xl overflow-y-auto max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#27272A]">
          <div>
            <span className="text-[10px] font-bold text-[#E11D48] tracking-widest uppercase">Experience Creator</span>
            <h2 className="text-xl font-extrabold text-[#FAFAFA]">{event ? "Edit Experience" : "Create New Experience"}</h2>
          </div>
          <button onClick={onClose} className="p-2 text-[#A1A1AA] hover:text-[#FAFAFA] rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div>
            <label className="font-semibold text-[#FAFAFA] block mb-1">Title</label>
            <input
              type="text"
              required
              placeholder="Moonlit Music Festival"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg editorial-input"
            />
          </div>

          <div>
            <label className="font-semibold text-[#FAFAFA] block mb-1">Description</label>
            <textarea
              required
              rows={3}
              placeholder="Editorial description..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg editorial-input"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-[#FAFAFA] block mb-1">Category</label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg editorial-input bg-[#111113] text-[#FAFAFA]"
              >
                <option value="" disabled>Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-[#FAFAFA] block mb-1">City</label>
              <input
                type="text"
                required
                placeholder="Bhubaneswar"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg editorial-input"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-[#FAFAFA] block mb-1">Venue Name</label>
            <input
              type="text"
              required
              placeholder="Cosmo Dome Arena"
              value={formData.venue}
              onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg editorial-input"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="font-semibold text-[#FAFAFA] block mb-1">Start Date</label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-2.5 py-2 rounded-lg editorial-input"
              />
            </div>
            <div>
              <label className="font-semibold text-[#FAFAFA] block mb-1">End Date</label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-2.5 py-2 rounded-lg editorial-input"
              />
            </div>
            <div>
              <label className="font-semibold text-[#FAFAFA] block mb-1">Start Time</label>
              <input
                type="time"
                required
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-2.5 py-2 rounded-lg editorial-input"
              />
            </div>
            <div>
              <label className="font-semibold text-[#FAFAFA] block mb-1">End Time</label>
              <input
                type="time"
                required
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full px-2.5 py-2 rounded-lg editorial-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-[#FAFAFA] block mb-1">Ticket Price (₹)</label>
              <input
                type="number"
                min={0}
                required
                value={formData.ticketPrice}
                onChange={(e) => setFormData({ ...formData, ticketPrice: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-lg editorial-input"
              />
            </div>
            <div>
              <label className="font-semibold text-[#FAFAFA] block mb-1">Total Capacity</label>
              <input
                type="number"
                min={1}
                required
                value={formData.totalSeats}
                onChange={(e) => setFormData({ ...formData, totalSeats: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-lg editorial-input"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-[#FAFAFA] block mb-1">Banner Photograph URL</label>
            <input
              type="url"
              required
              placeholder="https://images.unsplash.com/..."
              value={formData.bannerImage}
              onChange={(e) => setFormData({ ...formData, bannerImage: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg editorial-input"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="featuredCheck"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-4 h-4 rounded accent-[#E11D48]"
            />
            <label htmlFor="featuredCheck" className="text-[#FAFAFA] font-semibold cursor-pointer">
              Curated / Featured Selection
            </label>
          </div>

          <div className="flex gap-3 pt-4 border-t border-[#27272A]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-lg bg-[#18181B] text-[#A1A1AA] hover:text-[#FAFAFA] font-semibold border border-[#27272A]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-lg bg-[#E11D48] hover:bg-[#BE123C] text-white font-bold disabled:opacity-50"
            >
              {loading ? "Saving..." : event ? "Update Experience" : "Create Experience"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default EventFormModal;
