import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from "../Context/ThemeContext";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import NavBar from '../Components/NavBar';
import { CiUser } from "react-icons/ci";
import api from '../API/api';
import { toast } from "react-toastify";
import { useAppContext } from '../Context/AppContext';
import Loader from '../Components/Loader';
function LoginPage() {
  const { dark } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [username , setusername] = useState();
  const [password, setpassword] = useState();
  const [loading,setloading] = useState(false);
  const {setUser} = useAppContext();
  const nav = useNavigate();
  const { login } = useAppContext();
  const handleSubmit = async (e)=>{
  e.preventDefault();
  setloading(true);
  const res= await api.post('/user/login',{username,password});
  if(res.data.success){

    if(res.data.role=="user") {
setUser(res.data.user);
    localStorage.setItem("token",res.data.token);
    login(res.data.token);
    nav('/');
    toast.success(res.data.message);
    }
    else if(res.data.role=="admin"){
        localStorage.setItem("token",res.data.token);
    login(res.data.token);
    nav('/admin');
    }
    
  }
  else{
     toast.error(res.data.message);
  }
  setloading(false);
   

  }
  const inputClasses = `
    w-full pl-11 pr-11 py-3 rounded-xl border transition-all duration-300 outline-none text-sm
    ${dark 
      ? "bg-zinc-900/50 border-zinc-800 text-zinc-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" 
      : "bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"}
  `;

  return (
      <>
      {loading && <Loader/>
}
    <div className={`flex flex-col pt-20 min-h-screen transition-colors duration-500 ${dark ? "bg-zinc-950" : "bg-zinc-50"}`}>
      
   
      
 
      <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        
      
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className={`
          w-full max-w-md p-8 rounded-[2.5rem] border backdrop-blur-sm z-10
          ${dark ? "bg-zinc-900/40 border-zinc-800 shadow-2xl" : "bg-white/80 border-zinc-200 shadow-xl shadow-zinc-200/50"}
        `}>
          
   
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mb-4 rotate-3">
              <span className="text-white font-bold text-2xl">S</span>
            </div>
            <h1 className={`text-2xl font-bold tracking-tighter italic ${dark ? "text-white" : "text-zinc-900"}`}>
              SNAP<span className="text-indigo-500">POST</span>
            </h1>
            <p className="text-xs text-zinc-500 mt-2 font-medium">Elevate your social experience.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
           
            <div className="relative group">
              <CiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-500 transition-colors" />
              <input type="text" required onChange={(e)=>setusername(e.target.value)} placeholder="Username" className={inputClasses} />
            </div>

         
            <div className="relative group">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-500 transition-colors" />
              <input 
              required
                type={showPassword ? "text" : "password"} 
                placeholder="Password" 
                className={inputClasses} 
                onChange={(e)=>setpassword(e.target.value)}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-indigo-500"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            <div className="flex justify-end px-1">
              <Link to="/forgot-password" size="sm" className="text-[11px] font-bold text-indigo-500 hover:text-indigo-600 tracking-wide uppercase">
                Forgot Password?
              </Link>
            </div>

            <button type='submit'  className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all active:scale-95 mt-2">
              Sign In
            </button>

    

           
          </form>

          <p className={`text-center mt-8 text-xs font-medium ${dark ? "text-zinc-500" : "text-zinc-400"}`}>
            New to the platform?{' '}
            <Link to="/signup" className="text-indigo-500 font-bold hover:text-indigo-400">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
    </>
  );
}

export default LoginPage;