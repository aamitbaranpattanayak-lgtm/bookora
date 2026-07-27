import React, { useState } from "react";
import { X, Mail, Lock, User, AlertCircle, CheckCircle, Shield } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export const AuthModal = () => {
  const { isAuthModalOpen, closeAuth, authMode, setAuthMode, login, register, loading } = useAuth();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (authMode === "login") {
        await login(formData.email, formData.password);
        setSuccess("Signed in successfully.");
      } else {
        await register(formData.name, formData.email, formData.password);
        setSuccess("Account created successfully.");
      }
    } catch (err) {
      setError(err.message || "Authentication failed");
    }
  };

  const handleFillDemo = (role) => {
    if (role === "admin") {
      setAuthMode("login");
      setFormData({
        name: "Admin Organizer",
        email: "admin@bookora.com",
        password: "admin123",
      });
    } else {
      setAuthMode("login");
      setFormData({
        name: "Demo User",
        email: "demo@bookora.com",
        password: "user1234",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#111113] rounded-2xl p-6 sm:p-8 border border-[#27272A] shadow-2xl overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={closeAuth}
          className="absolute top-5 right-5 p-2 text-[#A1A1AA] hover:text-[#FAFAFA] rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1.5 mb-6">
          <span className="text-[11px] font-bold text-[#E11D48] tracking-widest uppercase">
            Bookora Account
          </span>
          <h2 className="text-2xl font-extrabold text-[#FAFAFA]">
            {authMode === "login" ? "Welcome back" : "Create an account"}
          </h2>
          <p className="text-xs text-[#A1A1AA]">
            {authMode === "login"
              ? "Sign in to access your digital tickets and reservations."
              : "Register to explore curated live experiences and masterclasses."}
          </p>
        </div>

        {/* Auth Mode Toggle Tabs */}
        <div className="flex p-1 rounded-lg bg-[#09090B] border border-[#27272A] mb-6 text-xs font-semibold">
          <button
            onClick={() => {
              setAuthMode("login");
              setError("");
            }}
            className={`flex-1 py-2 rounded-md transition-all ${
              authMode === "login" ? "bg-[#18181B] text-[#FAFAFA] shadow-sm" : "text-[#A1A1AA] hover:text-[#FAFAFA]"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setAuthMode("register");
              setError("");
            }}
            className={`flex-1 py-2 rounded-md transition-all ${
              authMode === "register" ? "bg-[#18181B] text-[#FAFAFA] shadow-sm" : "text-[#A1A1AA] hover:text-[#FAFAFA]"
            }`}
          >
            Register
          </button>
        </div>

        {/* Banners */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {authMode === "register" && (
            <div className="space-y-1">
              <label className="font-semibold text-[#FAFAFA]">Full Name</label>
              <input
                type="text"
                required
                placeholder="Alex Rivers"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg editorial-input"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="font-semibold text-[#FAFAFA]">Email Address</label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg editorial-input"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#FAFAFA]">Password</label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg editorial-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-[#E11D48] hover:bg-[#BE123C] text-white font-bold text-xs transition-colors mt-2 disabled:opacity-50"
          >
            {loading ? "Processing..." : authMode === "login" ? "Sign In" : "Register Account"}
          </button>
        </form>

        {/* Quick Demo Presets */}
        <div className="mt-6 pt-4 border-t border-[#27272A] text-center space-y-2">
          <p className="text-[10px] font-semibold text-[#A1A1AA] uppercase tracking-wider">Quick Demo Presets</p>
          <div className="flex gap-2">
            <button
              onClick={() => handleFillDemo("user")}
              className="flex-1 py-1.5 px-3 rounded-lg text-[11px] font-semibold bg-[#18181B] hover:bg-[#27272A] text-[#FAFAFA] border border-[#27272A] transition-colors"
            >
              Attendee Demo
            </button>
            <button
              onClick={() => handleFillDemo("admin")}
              className="flex-1 py-1.5 px-3 rounded-lg text-[11px] font-semibold bg-[#18181B] hover:bg-[#27272A] text-[#E11D48] border border-[#27272A] transition-colors"
            >
              Organizer Demo
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthModal;
