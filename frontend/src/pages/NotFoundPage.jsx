import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export const NotFoundPage = () => {
  return (
    <div className="max-w-md mx-auto px-6 py-32 text-center space-y-4">
      <span className="text-xs font-bold text-[#E11D48] tracking-widest uppercase">404 ERROR</span>
      <h1 className="text-4xl font-extrabold text-[#FAFAFA]">Page Not Found</h1>
      <p className="text-xs text-[#A1A1AA]">The experience or pass page you are looking for does not exist.</p>
      <div className="pt-2">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#E11D48] hover:bg-[#BE123C] text-white font-bold text-xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
