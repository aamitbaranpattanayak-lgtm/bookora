import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, User, LogOut, TicketCheck, ShieldCheck, Plus, Menu, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useEvents } from "../../context/EventContext";

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout, openAuth } = useAuth();
  const { searchQuery, setSearchQuery } = useEvents();
  const [scrolled, setScrolled] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (location.pathname !== "/events") {
      navigate("/events");
    }
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#09090B]/90 backdrop-blur-md border-b border-[#27272A] py-4"
          : "bg-transparent border-b border-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-6">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="text-xl font-extrabold tracking-widest text-[#FAFAFA] uppercase font-mono">
            BOOKORA
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48] inline-block" />
        </Link>

        {/* Minimal Nav Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#A1A1AA]">
          <Link
            to="/"
            className={`transition-colors hover:text-[#FAFAFA] ${
              location.pathname === "/" ? "text-[#FAFAFA] font-semibold" : ""
            }`}
          >
            Home
          </Link>
          <Link
            to="/events"
            className={`transition-colors hover:text-[#FAFAFA] ${
              location.pathname === "/events" ? "text-[#FAFAFA] font-semibold" : ""
            }`}
          >
            Experiences
          </Link>
          {isAuthenticated && (
            <Link
              to="/my-bookings"
              className={`transition-colors hover:text-[#FAFAFA] ${
                location.pathname === "/my-bookings" ? "text-[#FAFAFA] font-semibold" : ""
              }`}
            >
              My Bookings
            </Link>
          )}
          {isAdmin && (
            <Link
              to="/admin"
              className="text-[#E11D48] hover:text-[#BE123C] transition-colors font-semibold"
            >
              Organizer Portal
            </Link>
          )}
        </div>

        {/* Right Action & Search Area */}
        <div className="hidden md:flex items-center gap-5">
          {/* Quick Search Button */}
          <button
            onClick={() => navigate("/events")}
            className="p-2 text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors"
            title="Search events"
          >
            <Search className="w-4 h-4" />
          </button>

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdown(!userDropdown)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-[#111113] border border-[#27272A] hover:border-[#3F3F46] transition-colors"
              >
                <span className="text-xs font-semibold text-[#FAFAFA]">{user?.name}</span>
                <img
                  src={user?.profileImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"}
                  alt={user?.name}
                  className="w-6 h-6 rounded-full object-cover"
                />
              </button>

              {userDropdown && (
                <div
                  onMouseLeave={() => setUserDropdown(false)}
                  className="absolute right-0 mt-2 w-52 bg-[#111113] border border-[#27272A] rounded-xl p-2 shadow-2xl z-50 text-xs text-[#A1A1AA]"
                >
                  <div className="px-3 py-2 border-b border-[#27272A] mb-1">
                    <p className="font-semibold text-[#FAFAFA]">{user?.name}</p>
                    <p className="text-[11px] text-[#A1A1AA] truncate">{user?.email}</p>
                  </div>
                  <Link
                    to="/my-bookings"
                    onClick={() => setUserDropdown(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#18181B] hover:text-[#FAFAFA] transition-colors"
                  >
                    <TicketCheck className="w-3.5 h-3.5" />
                    My Bookings
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setUserDropdown(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#18181B] hover:text-[#FAFAFA] transition-colors"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-[#E11D48]" />
                      Organizer Portal
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setUserDropdown(false);
                      logout();
                      navigate("/");
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors mt-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => openAuth("login")}
                className="text-xs font-semibold text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => openAuth("register")}
                className="px-4 py-2 text-xs font-bold rounded-lg bg-[#E11D48] hover:bg-[#BE123C] text-white transition-colors"
              >
                Book Event
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#A1A1AA] hover:text-[#FAFAFA]"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-6 pt-4 pb-6 bg-[#09090B] border-b border-[#27272A] space-y-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search experiences..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg editorial-input"
            />
            <Search className="w-3.5 h-3.5 text-[#A1A1AA] absolute left-3 top-1/2 -translate-y-1/2" />
          </form>

          <div className="flex flex-col gap-3 font-medium text-xs text-[#A1A1AA]">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#FAFAFA]">Home</Link>
            <Link to="/events" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#FAFAFA]">Experiences</Link>
            {isAuthenticated && <Link to="/my-bookings" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#FAFAFA]">My Bookings</Link>}
            {isAdmin && <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="text-[#E11D48]">Organizer Portal</Link>}
          </div>

          <div className="pt-2 border-t border-[#27272A] flex gap-2">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 text-xs font-semibold rounded-lg bg-red-500/20 text-red-300"
              >
                Sign Out
              </button>
            ) : (
              <>
                <button
                  onClick={() => { openAuth("login"); setMobileMenuOpen(false); }}
                  className="flex-1 py-2 text-xs font-semibold rounded-lg bg-[#111113] border border-[#27272A] text-[#FAFAFA]"
                >
                  Sign In
                </button>
                <button
                  onClick={() => { openAuth("register"); setMobileMenuOpen(false); }}
                  className="flex-1 py-2 text-xs font-bold rounded-lg bg-[#E11D48] text-white"
                >
                  Book Event
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
