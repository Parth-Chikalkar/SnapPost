import React from 'react';
import { useTheme } from "../Context/ThemeContext";

const Loader = () => {
  const { dark } = useTheme();

  return (
    <div className={`
      fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6
      backdrop-blur-xl transition-colors duration-500
      ${dark ? "bg-zinc-950/80" : "bg-white/80"}
    `}>
     
      <div className="relative">
       
        <div className="absolute inset-0 rounded-2xl bg-indigo-500 blur-xl opacity-20 animate-pulse"></div>
        
  
        <div className={`
          relative w-16 h-16 rounded-2xl flex items-center justify-center
          bg-gradient-to-tr from-indigo-500 to-purple-600 shadow-2xl
          animate-bounce duration-[2000ms]
        `}>
          <span className="text-white font-bold text-3xl select-none">S</span>
        </div>
        
      
        <div className="absolute -inset-4 border-2 border-dashed border-indigo-500/30 rounded-full animate-[spin_8s_linear_infinite]"></div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <h2 className={`
          text-lg font-bold tracking-tighter italic
          ${dark ? "text-zinc-100" : "text-zinc-900"}
        `}>
          SNAP<span className="text-indigo-500">POST</span>
        </h2>
        
        
        <div className="flex gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;