import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { EventProvider } from "./context/EventContext";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import AuthModal from "./components/common/AuthModal";

import HomePage from "./pages/HomePage";
import EventsPage from "./pages/EventsPage";
import EventDetailPage from "./pages/EventDetailPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import AdminDashboard from "./pages/AdminDashboard";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <Router>
      <AuthProvider>
        <EventProvider>
          <div className="min-h-screen flex flex-col justify-between bg-slate-950 text-slate-100 selection:bg-purple-500 selection:text-white">
            
            {/* Top Navigation */}
            <Navbar />

            {/* Main Page Router View */}
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/events/:id" element={<EventDetailPage />} />
                <Route path="/my-bookings" element={<MyBookingsPage />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>

            {/* Global Auth Modal */}
            <AuthModal />

            {/* Footer */}
            <Footer />

          </div>
        </EventProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
