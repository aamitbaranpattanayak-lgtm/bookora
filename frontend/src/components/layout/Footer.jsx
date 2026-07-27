import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="mt-32 border-t border-[#27272A] bg-[#09090B] text-[#A1A1AA] text-xs">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Brand Column */}
        <div className="space-y-4 md:col-span-1">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-lg font-extrabold tracking-widest text-[#FAFAFA] uppercase font-mono">
              BOOKORA
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48]" />
          </Link>
          <p className="text-xs leading-relaxed text-[#A1A1AA] max-w-xs font-normal">
            A curated discovery and ticket reservation platform for music festivals, technology summits, creative masterclasses, and private mixers.
          </p>
        </div>

        {/* Column 2: Experiences */}
        <div className="space-y-3">
          <h4 className="font-semibold text-[#FAFAFA] uppercase text-[11px] tracking-wider">Experiences</h4>
          <ul className="space-y-2 font-normal">
            <li><Link to="/events" className="hover:text-[#FAFAFA] transition-colors">Music & Concerts</Link></li>
            <li><Link to="/events" className="hover:text-[#FAFAFA] transition-colors">Tech & AI Summits</Link></li>
            <li><Link to="/events" className="hover:text-[#FAFAFA] transition-colors">Developer Workshops</Link></li>
            <li><Link to="/events" className="hover:text-[#FAFAFA] transition-colors">Business & Networking</Link></li>
          </ul>
        </div>

        {/* Column 3: Platform */}
        <div className="space-y-3">
          <h4 className="font-semibold text-[#FAFAFA] uppercase text-[11px] tracking-wider">Platform</h4>
          <ul className="space-y-2 font-normal">
            <li><Link to="/admin" className="hover:text-[#FAFAFA] transition-colors">Host an Event</Link></li>
            <li><Link to="/admin" className="hover:text-[#FAFAFA] transition-colors">Organizer Portal</Link></li>
            <li><Link to="/my-bookings" className="hover:text-[#FAFAFA] transition-colors">My Ticket Wallet</Link></li>
            <li><a href="#" className="hover:text-[#FAFAFA] transition-colors">Privacy & Terms</a></li>
          </ul>
        </div>

        {/* Column 4: Newsletter / Contact */}
        <div className="space-y-3">
          <h4 className="font-semibold text-[#FAFAFA] uppercase text-[11px] tracking-wider">Curated Dispatch</h4>
          <p className="text-xs text-[#A1A1AA]">
            Receive monthly editorial dispatches highlighting intimate shows and keynote conferences.
          </p>
          <div className="flex gap-2 pt-1">
            <input
              type="email"
              placeholder="Enter email address"
              className="px-3.5 py-2 text-xs rounded-lg editorial-input flex-1 focus:outline-none"
            />
            <button className="px-4 py-2 text-xs font-bold rounded-lg bg-[#E11D48] hover:bg-[#BE123C] text-white transition-colors">
              Join
            </button>
          </div>
        </div>

      </div>

      <div className="border-t border-[#27272A] py-8 px-6 text-[#A1A1AA] text-xs max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© 2026 Bookora. All rights reserved.</p>
        <p className="text-[11px]">Crafted for extraordinary live experiences.</p>
      </div>
    </footer>
  );
};

export default Footer;
