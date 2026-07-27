import React, { useState, useEffect, useCallback } from "react";
import { ShieldCheck, Plus, Edit3, Trash2, RefreshCw } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useEvents } from "../context/EventContext";
import { eventService, categoryService, bookingService } from "../services/api";
import EventFormModal from "../components/admin/EventFormModal";

export const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const { refreshAll } = useEvents();

  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const [activeTab, setActiveTab] = useState("events");
  const [newCatName, setNewCatName] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");
  const [catMsg, setCatMsg] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [evtRes, catRes, bkRes] = await Promise.all([
        eventService.getEvents(),
        categoryService.getCategories(),
        bookingService.getAllBookings(),
      ]);
      if (evtRes.data) setEvents(evtRes.data);
      if (catRes.data) setCategories(catRes.data);
      if (bkRes.data) setAllBookings(bkRes.data);
    } catch (err) {
      console.error("Admin data error", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await eventService.deleteEvent(id);
      setEvents((prev) => prev.filter((e) => e._id !== id));
      refreshAll();
    } catch (err) {
      alert(err.message || "Failed to delete event");
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCatName) return;
    try {
      const res = await categoryService.createCategory({ name: newCatName, description: newCatDesc || "Event category" });
      if (res.data) {
        setCategories((prev) => [...prev, res.data]);
        setNewCatName("");
        setNewCatDesc("");
        setCatMsg("Category created.");
        setTimeout(() => setCatMsg(""), 3000);
      }
    } catch (err) {
      alert(err.message || "Failed to create category");
    }
  };

  const totalRevenue = allBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const totalTickets = allBookings.reduce((sum, b) => sum + (b.quantity || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#27272A] pb-6">
        <div>
          <span className="text-xs font-bold text-[#E11D48] tracking-widest uppercase mb-1 block">
            ORGANIZER MANAGEMENT PORTAL
          </span>
          <h1 className="text-3xl font-extrabold text-[#FAFAFA]">Organizer Dashboard</h1>
          <p className="text-xs text-[#A1A1AA]">Manage experiences, ticket inventory, categories, and revenue.</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={loadData}
            className="px-3.5 py-2 rounded-lg bg-[#18181B] hover:bg-[#27272A] text-[#FAFAFA] text-xs font-semibold border border-[#27272A] transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Sync Data
          </button>
          <button
            onClick={() => {
              setEditingEvent(null);
              setIsEventModalOpen(true);
            }}
            className="px-4 py-2 rounded-lg bg-[#E11D48] hover:bg-[#BE123C] text-white font-bold text-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Create Experience
          </button>
        </div>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#18181B] p-5 rounded-2xl border border-[#27272A] space-y-1">
          <span className="text-xs font-medium text-[#A1A1AA] block">Total Revenue</span>
          <span className="text-2xl font-extrabold text-[#FAFAFA]">₹{totalRevenue.toLocaleString()}</span>
        </div>
        <div className="bg-[#18181B] p-5 rounded-2xl border border-[#27272A] space-y-1">
          <span className="text-xs font-medium text-[#A1A1AA] block">Tickets Sold</span>
          <span className="text-2xl font-extrabold text-[#FAFAFA]">{totalTickets}</span>
        </div>
        <div className="bg-[#18181B] p-5 rounded-2xl border border-[#27272A] space-y-1">
          <span className="text-xs font-medium text-[#A1A1AA] block">Active Events</span>
          <span className="text-2xl font-extrabold text-[#FAFAFA]">{events.length}</span>
        </div>
        <div className="bg-[#18181B] p-5 rounded-2xl border border-[#27272A] space-y-1">
          <span className="text-xs font-medium text-[#A1A1AA] block">Categories</span>
          <span className="text-2xl font-extrabold text-[#FAFAFA]">{categories.length}</span>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex p-1 rounded-lg bg-[#111113] border border-[#27272A] text-xs font-semibold max-w-md">
        <button
          onClick={() => setActiveTab("events")}
          className={`flex-1 py-2 rounded-md transition-all ${
            activeTab === "events" ? "bg-[#18181B] text-[#FAFAFA] shadow-sm" : "text-[#A1A1AA] hover:text-[#FAFAFA]"
          }`}
        >
          Event Inventory ({events.length})
        </button>
        <button
          onClick={() => setActiveTab("categories")}
          className={`flex-1 py-2 rounded-md transition-all ${
            activeTab === "categories" ? "bg-[#18181B] text-[#FAFAFA] shadow-sm" : "text-[#A1A1AA] hover:text-[#FAFAFA]"
          }`}
        >
          Categories ({categories.length})
        </button>
        <button
          onClick={() => setActiveTab("bookings")}
          className={`flex-1 py-2 rounded-md transition-all ${
            activeTab === "bookings" ? "bg-[#18181B] text-[#FAFAFA] shadow-sm" : "text-[#A1A1AA] hover:text-[#FAFAFA]"
          }`}
        >
          Bookings ({allBookings.length})
        </button>
      </div>

      {/* Tab 1: Events Inventory */}
      {activeTab === "events" && (
        <div className="bg-[#18181B] rounded-2xl border border-[#27272A] overflow-hidden">
          <div className="p-5 border-b border-[#27272A]">
            <h3 className="text-sm font-bold text-[#FAFAFA]">Event Inventory</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#A1A1AA]">
              <thead className="bg-[#111113] text-[#FAFAFA] uppercase tracking-wider font-semibold border-b border-[#27272A]">
                <tr>
                  <th className="p-4">Event</th>
                  <th className="p-4">Date & City</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Seats Left</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272A]">
                {events.map((evt) => (
                  <tr key={evt._id} className="hover:bg-[#111113] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={evt.bannerImage}
                          alt={evt.title}
                          className="w-10 h-10 rounded-lg object-cover border border-[#27272A] shrink-0"
                        />
                        <span className="font-bold text-[#FAFAFA] line-clamp-1">{evt.title}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-[#FAFAFA]">{new Date(evt.startDate).toLocaleDateString()}</p>
                      <p className="text-[10px] text-[#A1A1AA]">{evt.city}</p>
                    </td>
                    <td className="p-4 font-bold text-[#FAFAFA]">₹{evt.ticketPrice}</td>
                    <td className="p-4 text-[#A1A1AA]">{evt.availableSeats} / {evt.totalSeats}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingEvent(evt);
                            setIsEventModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-[#111113] text-[#FAFAFA] hover:bg-[#27272A] border border-[#27272A]"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(evt._id)}
                          className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Categories */}
      {activeTab === "categories" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#18181B] p-6 rounded-2xl border border-[#27272A] space-y-4">
            <h3 className="text-sm font-bold text-[#FAFAFA]">Add Category</h3>
            {catMsg && <p className="text-xs text-emerald-400">{catMsg}</p>}
            <form onSubmit={handleCreateCategory} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-[#FAFAFA] block mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cinema & Film"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg editorial-input"
                />
              </div>
              <div>
                <label className="font-semibold text-[#FAFAFA] block mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Summary..."
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg editorial-input"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-[#E11D48] text-white font-bold text-xs hover:bg-[#BE123C]"
              >
                Create Category
              </button>
            </form>
          </div>

          <div className="md:col-span-2 bg-[#18181B] p-6 rounded-2xl border border-[#27272A] space-y-4">
            <h3 className="text-sm font-bold text-[#FAFAFA]">Active Categories</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categories.map((c) => (
                <div key={c._id} className="p-4 rounded-xl bg-[#111113] border border-[#27272A] space-y-1">
                  <span className="font-bold text-[#FAFAFA] text-xs block">{c.name}</span>
                  <p className="text-[11px] text-[#A1A1AA]">{c.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Bookings */}
      {activeTab === "bookings" && (
        <div className="bg-[#18181B] rounded-2xl border border-[#27272A] overflow-hidden">
          <div className="p-5 border-b border-[#27272A]">
            <h3 className="text-sm font-bold text-[#FAFAFA]">Customer Bookings</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#A1A1AA]">
              <thead className="bg-[#111113] text-[#FAFAFA] uppercase tracking-wider font-semibold border-b border-[#27272A]">
                <tr>
                  <th className="p-4">Ref ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Event</th>
                  <th className="p-4">Tickets</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272A]">
                {allBookings.map((bk) => (
                  <tr key={bk._id} className="hover:bg-[#111113] transition-colors">
                    <td className="p-4 font-mono text-[#FAFAFA]">#{bk._id}</td>
                    <td className="p-4">
                      <p className="font-bold text-[#FAFAFA]">{bk.user?.name || "Attendee"}</p>
                      <p className="text-[10px] text-[#A1A1AA]">{bk.user?.email}</p>
                    </td>
                    <td className="p-4 font-medium text-[#FAFAFA]">{bk.event?.title || "Event"}</td>
                    <td className="p-4 font-bold text-[#FAFAFA]">{bk.quantity} pass(es)</td>
                    <td className="p-4 font-bold text-[#FAFAFA]">₹{bk.totalAmount}</td>
                    <td className="p-4">
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${
                        bk.bookingStatus === "confirmed" ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300"
                      }`}>
                        {bk.bookingStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {isEventModalOpen && (
        <EventFormModal
          event={editingEvent}
          categories={categories}
          isOpen={isEventModalOpen}
          onClose={() => {
            setIsEventModalOpen(false);
            setEditingEvent(null);
          }}
          onSuccess={() => {
            loadData();
            refreshAll();
          }}
        />
      )}

    </div>
  );
};

export default AdminDashboard;
