import React from 'react';
import { useTheme } from "../Context/ThemeContext";
import { useAppContext } from '../Context/AppContext';
import ThemeToggle from './ThemeToggle';
import { useNavigate } from 'react-router-dom';

function AdminNavBar() {
  const { dark } = useTheme();
  const {logout} = useAppContext();
  const nav = useNavigate();

  return (
    <nav className={`
      fixed top-0 z-50 w-full h-20 px-6 md:px-10 flex items-center justify-between 
      transition-colors duration-300 border-b
      ${dark 
        ? "bg-zinc-950/80 border-zinc-800 text-zinc-100" 
        : "bg-white/80 border-zinc-200 text-zinc-900"} 
      backdrop-blur-md
    `}>
    
      <div className='flex items-center group cursor-default'>
        <div className='w-10 h-10 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:rotate-6 transition-transform'>
          <h1 className='text-2xl text-white italic font-black'>S</h1>
        </div>
        <h1 className='ml-3 text-xl font-black italic tracking-tighter'>
          <span className='text-indigo-500'>SNAP</span>ADMIN
        </h1>
      </div>

<div className='flex items-center justify-center gap-5 '>


     <ThemeToggle/>
      <button 
        className='bg-red-500 hover:bg-red-600 text-white font-bold text-sm px-5 py-2 rounded-xl shadow-lg shadow-red-500/20 transition-all active:scale-95'
        onClick={() => {logout(), nav("/")}}
      >
        Logout
      </button>
      </div>
    </nav>
  );
}

export default AdminNavBar;