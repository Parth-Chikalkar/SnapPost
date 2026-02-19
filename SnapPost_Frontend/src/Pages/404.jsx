import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from "../Context/ThemeContext";
import { FiArrowLeft, FiCameraOff } from "react-icons/fi";

function NotFound() {
  const { dark } = useTheme();

  return (
    <div className={`min-h-screen pt-20 flex items-center justify-center px-6 transition-colors duration-300 ${dark ? "bg-zinc-950" : "bg-zinc-50"}`}>
      
  
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="text-center z-10">
        {/* Animated Icon */}
        <div className="relative inline-block mb-8">
          <div className="w-24 h-24 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/20 rotate-12 transition-transform hover:rotate-0 duration-500">
            <span className="text-white text-4xl font-black">S</span>
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-zinc-900 border-4 border-zinc-950 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Text Content */}
        <h1 className={`text-8xl font-black tracking-tighter mb-4 ${dark ? "text-white" : "text-zinc-900"}`}>
          404
        </h1>
        <h2 className={`text-2xl font-bold mb-4 ${dark ? "text-zinc-300" : "text-zinc-700"}`}>
          Lost in the <span className="text-indigo-500">Snap</span>?
        </h2>
        <p className="text-zinc-500 max-w-xs mx-auto mb-10 leading-relaxed">
          The post or page you're looking for has been moved, deleted, or never existed in this dimension.
        </p>

        {/* Back Button */}
        <Link to="/">
          <button className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all active:scale-95 group">
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Back to Feed
          </button>
        </Link>

        {/* Subtle Footer */}
        <p className="mt-20 text-[10px] text-zinc-600 uppercase tracking-[0.2em] font-medium">
          SnapPost — Error Terminal
        </p>
      </div>
    </div>
  );
}

export default NotFound;