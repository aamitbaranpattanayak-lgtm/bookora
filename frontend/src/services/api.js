import axios from "axios";
import { initialCategories, initialEvents, initialBookings } from "./mockData.js";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to attach Authorization Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("bookora_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Fallback Local Storage Storage Manager for offline demo mode
const getStored = (key, fallback) => {
  const data = localStorage.getItem(`bookora_${key}`);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return fallback;
    }
  }
  localStorage.setItem(`bookora_${key}`, JSON.stringify(fallback));
  return fallback;
};

const setStored = (key, data) => {
  localStorage.setItem(`bookora_${key}`, JSON.stringify(data));
};

// Initialize mock storage if not set
getStored("events", initialEvents);
getStored("categories", initialCategories);
getStored("bookings", initialBookings);

// Auth Services
export const authService = {
  async register(userData) {
    try {
      const res = await api.post("/auth/register", userData);
      return res.data;
    } catch (err) {
      if (!err.response || err.code === "ERR_NETWORK") {
        // Fallback Mock Register
        const users = getStored("users", []);
        const existing = users.find(u => u.email === userData.email);
        if (existing) throw new Error("User already exists");

        const newUser = {
          _id: `usr_${Date.now()}`,
          name: userData.name,
          email: userData.email,
          role: userData.email.includes("admin") ? "admin" : "user",
          profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userData.name)}`
        };
        users.push({ ...newUser, password: userData.password });
        setStored("users", users);

        const token = `mock_jwt_token_${newUser._id}`;
        return { success: true, data: { user: newUser, token }, message: "User registered successfully (Demo Mode)" };
      }
      throw new Error(err.response?.data?.message || "Registration failed");
    }
  },

  async login(credentials) {
    try {
      const res = await api.post("/auth/login", credentials);
      return res.data;
    } catch (err) {
      if (!err.response || err.code === "ERR_NETWORK") {
        // Fallback Mock Login
        const users = getStored("users", []);
        let user = users.find(u => u.email === credentials.email);

        // Predefined Admin demo login bypass
        if (credentials.email === "admin@bookora.com" && credentials.password === "admin123") {
          user = {
            _id: "usr_admin",
            name: "Admin Organizer",
            email: "admin@bookora.com",
            role: "admin",
            profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
          };
        } else if (!user) {
          user = {
            _id: `usr_${Date.now()}`,
            name: credentials.email.split("@")[0],
            email: credentials.email,
            role: credentials.email.includes("admin") ? "admin" : "user",
            profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(credentials.email)}`
          };
        }

        const token = `mock_jwt_token_${user._id}`;
        return { success: true, data: { user, token }, message: "Login successful (Demo Mode)" };
      }
      throw new Error(err.response?.data?.message || "Invalid credentials");
    }
  },

  async getCurrentUser() {
    try {
      const res = await api.get("/users/me");
      return res.data;
    } catch (err) {
      if (!err.response || err.code === "ERR_NETWORK") {
        const currentUser = getStored("current_user", {
          _id: "usr_demo",
          name: "Demo User",
          email: "demo@bookora.com",
          role: "user",
          profileImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"
        });
        return { success: true, data: currentUser };
      }
      throw new Error(err.response?.data?.message || "Failed to fetch user");
    }
  }
};

// Event Services
export const eventService = {
  async getEvents(params = {}) {
    try {
      const res = await api.get("/events", { params });
      return res.data;
    } catch (err) {
      if (!err.response || err.code === "ERR_NETWORK") {
        let events = getStored("events", initialEvents);

        // Apply local filtering
        if (params.category) {
          events = events.filter(e => e.category === params.category || e.category?._id === params.category);
        }
        if (params.city) {
          events = events.filter(e => e.city.toLowerCase().includes(params.city.toLowerCase()));
        }
        if (params.search) {
          const q = params.search.toLowerCase();
          events = events.filter(e => e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q));
        }
        if (params.featured !== undefined) {
          events = events.filter(e => e.featured === (params.featured === "true" || params.featured === true));
        }

        return { success: true, data: events };
      }
      throw new Error(err.response?.data?.message || "Failed to fetch events");
    }
  },

  async getEventById(id) {
    try {
      const res = await api.get(`/events/${id}`);
      return res.data;
    } catch (err) {
      if (!err.response || err.code === "ERR_NETWORK") {
        const events = getStored("events", initialEvents);
        const event = events.find(e => e._id === id || e.slug === id);
        if (!event) throw new Error("Event not found");
        return { success: true, data: event };
      }
      throw new Error(err.response?.data?.message || "Failed to fetch event");
    }
  },

  async createEvent(eventData) {
    try {
      const res = await api.post("/events", eventData);
      return res.data;
    } catch (err) {
      if (!err.response || err.code === "ERR_NETWORK") {
        const events = getStored("events", initialEvents);
        const newEvent = {
          _id: `evt_${Date.now()}`,
          ...eventData,
          slug: eventData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          availableSeats: eventData.totalSeats,
          createdBy: "usr_admin",
          createdAt: new Date().toISOString()
        };
        events.unshift(newEvent);
        setStored("events", events);
        return { success: true, data: newEvent, message: "Event created successfully" };
      }
      throw new Error(err.response?.data?.message || "Failed to create event");
    }
  },

  async updateEvent(id, eventData) {
    try {
      const res = await api.put(`/events/${id}`, eventData);
      return res.data;
    } catch (err) {
      if (!err.response || err.code === "ERR_NETWORK") {
        let events = getStored("events", initialEvents);
        events = events.map(e => (e._id === id ? { ...e, ...eventData } : e));
        setStored("events", events);
        const updated = events.find(e => e._id === id);
        return { success: true, data: updated, message: "Event updated successfully" };
      }
      throw new Error(err.response?.data?.message || "Failed to update event");
    }
  },

  async deleteEvent(id) {
    try {
      const res = await api.delete(`/events/${id}`);
      return res.data;
    } catch (err) {
      if (!err.response || err.code === "ERR_NETWORK") {
        let events = getStored("events", initialEvents);
        events = events.filter(e => e._id !== id);
        setStored("events", events);
        return { success: true, message: "Event deleted successfully" };
      }
      throw new Error(err.response?.data?.message || "Failed to delete event");
    }
  }
};

// Category Services
export const categoryService = {
  async getCategories() {
    try {
      const res = await api.get("/categories");
      return res.data;
    } catch (err) {
      if (!err.response || err.code === "ERR_NETWORK") {
        const categories = getStored("categories", initialCategories);
        return { success: true, data: categories };
      }
      throw new Error(err.response?.data?.message || "Failed to fetch categories");
    }
  },

  async createCategory(categoryData) {
    try {
      const res = await api.post("/categories", categoryData);
      return res.data;
    } catch (err) {
      if (!err.response || err.code === "ERR_NETWORK") {
        const categories = getStored("categories", initialCategories);
        const newCategory = {
          _id: `cat_${Date.now()}`,
          ...categoryData,
          slug: categoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          isActive: true
        };
        categories.push(newCategory);
        setStored("categories", categories);
        return { success: true, data: newCategory, message: "Category created successfully" };
      }
      throw new Error(err.response?.data?.message || "Failed to create category");
    }
  }
};

// Booking Services
export const bookingService = {
  async createBooking({ eventId, quantity }) {
    try {
      const res = await api.post("/bookings", { event: eventId, quantity });
      return res.data;
    } catch (err) {
      if (!err.response || err.code === "ERR_NETWORK") {
        const events = getStored("events", initialEvents);
        const event = events.find(e => e._id === eventId);
        if (!event) throw new Error("Event not found");

        if (event.availableSeats < quantity) {
          throw new Error("Not enough seats available");
        }

        // Deduct available seats
        event.availableSeats -= quantity;
        setStored("events", events);

        const currentUser = getStored("current_user", { _id: "usr_demo", name: "Demo User", email: "demo@bookora.com" });
        const bookings = getStored("bookings", initialBookings);

        const newBooking = {
          _id: `bk_${Date.now()}`,
          user: currentUser,
          event: event,
          quantity: Number(quantity),
          totalAmount: event.ticketPrice * Number(quantity),
          bookingStatus: "confirmed",
          paymentStatus: "paid",
          createdAt: new Date().toISOString()
        };

        bookings.unshift(newBooking);
        setStored("bookings", bookings);

        return { success: true, data: newBooking, message: "Booking created successfully!" };
      }
      throw new Error(err.response?.data?.message || "Failed to book tickets");
    }
  },

  async getMyBookings() {
    try {
      const res = await api.get("/bookings/my-bookings");
      return res.data;
    } catch (err) {
      if (!err.response || err.code === "ERR_NETWORK") {
        const bookings = getStored("bookings", initialBookings);
        return { success: true, data: bookings };
      }
      throw new Error(err.response?.data?.message || "Failed to fetch user bookings");
    }
  },

  async getAllBookings() {
    try {
      const res = await api.get("/bookings");
      return res.data;
    } catch (err) {
      if (!err.response || err.code === "ERR_NETWORK") {
        const bookings = getStored("bookings", initialBookings);
        return { success: true, data: bookings };
      }
      throw new Error(err.response?.data?.message || "Failed to fetch all bookings");
    }
  },

  async cancelBooking(id) {
    try {
      const res = await api.put(`/bookings/${id}/cancel`);
      return res.data;
    } catch (err) {
      if (!err.response || err.code === "ERR_NETWORK") {
        const bookings = getStored("bookings", initialBookings);
        const booking = bookings.find(b => b._id === id);
        if (!booking) throw new Error("Booking not found");

        booking.bookingStatus = "cancelled";

        // Reclaim available seats
        const events = getStored("events", initialEvents);
        const event = events.find(e => e._id === (booking.event._id || booking.event));
        if (event) {
          event.availableSeats += booking.quantity;
          setStored("events", events);
        }

        setStored("bookings", bookings);
        return { success: true, data: booking, message: "Booking cancelled successfully" };
      }
      throw new Error(err.response?.data?.message || "Failed to cancel booking");
    }
  }
};

export default api;
