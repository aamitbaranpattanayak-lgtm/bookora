import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { eventService, categoryService } from "../services/api";

const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");

  const fetchCategories = useCallback(async () => {
    try {
      const res = await categoryService.getCategories();
      if (res.data) setCategories(res.data);
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  }, []);

  const fetchEvents = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const res = await eventService.getEvents(params);
      if (res.data) setEvents(res.data);
    } catch (err) {
      console.error("Failed to load events", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchEvents();
  }, [fetchCategories, fetchEvents]);

  const refreshAll = () => {
    fetchCategories();
    fetchEvents();
  };

  return (
    <EventContext.Provider
      value={{
        events,
        categories,
        loading,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedCity,
        setSelectedCity,
        fetchEvents,
        refreshAll,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => useContext(EventContext);
