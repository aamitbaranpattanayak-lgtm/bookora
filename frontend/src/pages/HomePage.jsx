import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, MapPin, Calendar, ArrowRight, ArrowUpRight, Sparkles, Filter, Music, Code, Briefcase, Trophy, Flame, ChevronRight, Quote } from "lucide-react";
import { useEvents } from "../context/EventContext";
import { useAuth } from "../context/AuthContext";
import EventCard from "../components/events/EventCard";
import BookingModal from "../components/bookings/BookingModal";

export const HomePage = () => {
  const { events, categories, loading, searchQuery, setSearchQuery, selectedCity, setSelectedCity } = useEvents();
  const { openAuth, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [bookingEvent, setBookingEvent] = useState(null);

  const featuredEvents = events.filter((e) => e.featured);
  const regularEvents = events.filter((e) => !e.featured);
  const popularEvents = events.slice(0, 4);

  const cities = ["all", "Bhubaneswar", "Mumbai", "Bengaluru", "Delhi", "Noida", "Goa"];

  const handleBookClick = (event) => {
    if (!isAuthenticated) {
      openAuth("login");
    } else {
      setBookingEvent(event);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate("/events");
  };

  return (
    <div className="space-y-24 pb-20">
      
      {/* Editorial Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-12 md:pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Column: Editorial Headline */}
          <div className="lg:col-span-7 space-y-8">
            
            <div className="space-y-3">
              <span className="text-xs font-bold text-[#E11D48] tracking-widest uppercase">
                CURATED DISCOVERY & TICKETING
              </span>

              <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-[#FAFAFA] leading-[1.05]">
                DISCOVER <br />
                EXPERIENCES <br />
                THAT STAY <br />
                WITH YOU.
              </h1>
            </div>

            <p className="text-sm sm:text-base text-[#A1A1AA] max-w-lg font-normal leading-relaxed">
              Bookora curates remarkable music festivals, keynote tech conferences, intimate acoustic sessions, and hands-on masterclasses.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => navigate("/events")}
                className="px-6 py-3.5 text-xs font-bold rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white transition-all shadow-lg flex items-center gap-2"
              >
                <span>Explore Events</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#categories"
                className="px-6 py-3.5 text-xs font-semibold rounded-xl bg-[#111113] hover:bg-[#18181B] text-[#FAFAFA] border border-[#27272A] transition-colors"
              >
                Browse Categories
              </a>
            </div>

          </div>

          {/* Hero Right Column: Immersive Photograph + Floating Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-[24px] overflow-hidden bg-[#111113] border border-[#27272A] shadow-2xl h-[440px] sm:h-[500px]">
              <img
                src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80"
                alt="Moonlit Music Festival"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            </div>

            {/* Floating Minimal Info Card */}
            <div className="absolute bottom-6 left-6 right-6 bg-[#111113]/95 backdrop-blur-md p-4 rounded-xl border border-[#27272A] shadow-2xl flex items-center justify-between text-xs">
              <div>
                <h4 className="font-bold text-[#FAFAFA] text-sm">Moonlit Music Festival</h4>
                <p className="text-[#A1A1AA] text-[11px]">Bhubaneswar • 25 Aug</p>
              </div>
              <button
                onClick={() => navigate("/events")}
                className="px-3.5 py-1.5 rounded-lg bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold transition-colors"
              >
                Book
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Airbnb-Style Integrated Search Bar */}
      <section className="max-w-6xl mx-auto px-6">
        <form
          onSubmit={handleSearchSubmit}
          className="airbnb-search-bar rounded-2xl p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-4 gap-3 items-center"
        >
          {/* Segment 1: Where */}
          <div className="px-4 py-2 rounded-xl hover:bg-[#18181B] transition-colors cursor-pointer space-y-0.5">
            <label className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider block">Where</label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full bg-transparent text-xs font-semibold text-[#FAFAFA] focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-[#111113]">All Cities</option>
              {cities.filter(c => c !== "all").map(c => (
                <option key={c} value={c} className="bg-[#111113]">{c}</option>
              ))}
            </select>
          </div>

          {/* Segment 2: Category */}
          <div className="px-4 py-2 rounded-xl hover:bg-[#18181B] transition-colors cursor-pointer space-y-0.5">
            <label className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider block">Category</label>
            <select
              onChange={(e) => navigate(`/events?category=${e.target.value}`)}
              className="w-full bg-transparent text-xs font-semibold text-[#FAFAFA] focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-[#111113]">All Types</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id} className="bg-[#111113]">{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Segment 3: Search Query */}
          <div className="px-4 py-2 rounded-xl hover:bg-[#18181B] transition-colors space-y-0.5">
            <label className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider block">Search</label>
            <input
              type="text"
              placeholder="Search keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs font-semibold text-[#FAFAFA] placeholder-[#A1A1AA] focus:outline-none"
            />
          </div>

          {/* Segment 4: Search Action Button */}
          <div className="px-2">
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Search Experiences</span>
            </button>
          </div>

        </form>
      </section>

      {/* Featured Experiences Section */}
      <section className="max-w-7xl mx-auto px-6 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-[#27272A] pb-5">
          <div>
            <span className="text-xs font-bold text-[#E11D48] tracking-widest uppercase">CURATED SELECTION</span>
            <h2 className="text-3xl font-extrabold text-[#FAFAFA] mt-1">Featured Experiences</h2>
          </div>
          <Link to="/events" className="text-xs font-bold text-[#A1A1AA] hover:text-[#FAFAFA] flex items-center gap-1">
            View All Experiences <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 rounded-2xl bg-[#18181B] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredEvents.map((evt) => (
              <EventCard key={evt._id} event={evt} onBookClick={handleBookClick} />
            ))}
          </div>
        )}
      </section>

      {/* Categories Section */}
      <section id="categories" className="max-w-7xl mx-auto px-6 space-y-8">
        <div className="border-b border-[#27272A] pb-5">
          <span className="text-xs font-bold text-[#E11D48] tracking-widest uppercase">EXPLORE BY INTEREST</span>
          <h2 className="text-3xl font-extrabold text-[#FAFAFA] mt-1">Categories</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/events?category=${cat._id}`}
              className="editorial-card p-6 rounded-2xl space-y-3 flex flex-col justify-between group"
            >
              <div>
                <span className="text-xs font-bold text-[#E11D48] uppercase tracking-wider block mb-1">
                  Category
                </span>
                <h3 className="text-base font-bold text-[#FAFAFA] group-hover:text-white transition-colors">
                  {cat.name}
                </h3>
              </div>
              <p className="text-[11px] text-[#A1A1AA] line-clamp-2 leading-relaxed">
                {cat.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular This Week Section */}
      <section className="max-w-7xl mx-auto px-6 space-y-8">
        <div className="flex items-end justify-between border-b border-[#27272A] pb-5">
          <div>
            <span className="text-xs font-bold text-[#E11D48] tracking-widest uppercase">TRENDING CALENDAR</span>
            <h2 className="text-3xl font-extrabold text-[#FAFAFA] mt-1">Popular This Week</h2>
          </div>
          <Link to="/events" className="text-xs font-bold text-[#A1A1AA] hover:text-[#FAFAFA] flex items-center gap-1">
            See Full Schedule <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularEvents.map((evt) => (
            <EventCard key={evt._id} event={evt} onBookClick={handleBookClick} />
          ))}
        </div>
      </section>

      {/* Editorial Testimonials / Quote Section */}
      <section className="max-w-5xl mx-auto px-6">
        <div className="bg-[#111113] rounded-3xl p-10 sm:p-16 border border-[#27272A] text-center space-y-6">
          <Quote className="w-10 h-10 text-[#E11D48] mx-auto opacity-80" />
          <blockquote className="text-xl sm:text-2xl font-extrabold text-[#FAFAFA] leading-relaxed max-w-3xl mx-auto">
            "Bookora turns event discovery into an art. The tickets are effortless to book, and the curated experiences are unmatched."
          </blockquote>
          <div>
            <p className="text-xs font-bold text-[#FAFAFA]">Elena Rostova</p>
            <p className="text-[11px] text-[#A1A1AA]">Cultural Journalist & Event Attendee</p>
          </div>
        </div>
      </section>

      {/* Upcoming Events Grid Section */}
      <section className="max-w-7xl mx-auto px-6 space-y-8">
        <div className="flex items-end justify-between border-b border-[#27272A] pb-5">
          <div>
            <span className="text-xs font-bold text-[#E11D48] tracking-widest uppercase">COMPLETE LINEUP</span>
            <h2 className="text-3xl font-extrabold text-[#FAFAFA] mt-1">Upcoming Events</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularEvents.map((evt) => (
            <EventCard key={evt._id} event={evt} onBookClick={handleBookClick} />
          ))}
        </div>
      </section>

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

export default HomePage;
