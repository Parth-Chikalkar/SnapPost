import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from "../Context/ThemeContext";
import { FiMail, FiLock, FiUser, FiPhone, FiAtSign, FiArrowRight } from "react-icons/fi";
import NavBar from '../Components/NavBar';
import { useAppContext } from '../Context/AppContext';
import Loader from '../Components/Loader';
import api from '../API/api';
import { toast } from 'react-toastify';

function SignupPage() {
  const { dark } = useTheme();
  const {setUser} = useAppContext();
  const [fullname, setFullName] = useState();
  const [username , setUsername] = useState();
  const [password , setPassword] = useState();
  const [email,setEmail] = useState();
  const [phNo , seTPhno] = useState();
  const [loading,setloading] = useState(false);
  const nav = useNavigate();
   const {login} = useAppContext();
  const handleSubmit =async (e)=>{
  e.preventDefault();
  setloading(true);
 
  const res = await api.post('/user/signup',{name : fullname, username :username, email : email, phnNum : phNo, password : password})
   if(res.data.success){
      setUser(res.data.user);
      localStorage.setItem("token",res.data.token);
      login(res.data.token);
      nav('/');
      toast.success(res.data.message);  
    }
    else{
       toast.error(res.data.message);
    }
    setloading(false);
  }
  const inputClasses = `
    w-full pl-11 pr-4 py-3 rounded-xl border transition-all duration-300 outline-none text-sm
    ${dark 
      ? "bg-zinc-900/50 border-zinc-800 text-zinc-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" 
      : "bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"}
  `;

  return (
    <>
    
    
    {loading && <Loader/>}
    <div className={`flex pt-20 flex-col min-h-screen transition-colors duration-500 ${dark ? "bg-zinc-950" : "bg-zinc-50"}`}>
    
      
      <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className={`
          w-full max-w-lg p-8 md:p-10 rounded-[2.5rem] border backdrop-blur-sm z-10
          ${dark ? "bg-zinc-900/40 border-zinc-800 shadow-2xl" : "bg-white/80 border-zinc-200 shadow-xl shadow-zinc-200/50"}
        `}>
          
          <div className="mb-8">
            <h1 className={`text-3xl font-bold tracking-tighter ${dark ? "text-white" : "text-zinc-900"}`}>
              Create <span className="text-indigo-500 font-italic italic">Account</span>
            </h1>
            <p className="text-sm text-zinc-500 mt-2 font-medium">Join the Snappost creator community today.</p>
          </div>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
            
         
            <div className="relative group md:col-span-2">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-500 transition-colors" />
              <input required onChange={(e)=>setFullName(e.target.value)} type="text" placeholder="Full Name" className={inputClasses} name="name" />
            </div>

          
            <div className="relative group">
              <FiAtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-500 transition-colors" />
              <input required onChange={(e)=>setUsername(e.target.value)} type="text" placeholder="Username" className={inputClasses} name="username" />
            </div>

       
            <div className="relative group">
              <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-500 transition-colors" />
              <input required onChange={(e)=>seTPhno(e.target.value)} type="tel" placeholder="Phone Number" className={inputClasses} name="phNum" />
            </div>

         
            <div className="relative group md:col-span-2">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-500 transition-colors" />
              <input required onChange={(e)=>setEmail(e.target.value)} type="email" placeholder="Email Address" className={inputClasses} name="email" />
            </div>

            <div className="relative group md:col-span-2">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-500 transition-colors" />
              <input required type="password" onChange={(e)=>setPassword(e.target.value)} placeholder="Create Password" className={inputClasses} name="password" />
            </div>

            <div className="md:col-span-2 mt-2">
              <p className="text-[11px] text-zinc-500 text-center mb-6">
                By signing up, you agree to our <span className="text-indigo-500 cursor-pointer">Terms</span> and <span className="text-indigo-500 cursor-pointer">Privacy Policy</span>.
              </p>
              
              <button type='submit' className="w-full py-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all active:scale-95 flex items-center justify-center gap-2 group">
                Get Started
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>

          <p className={`text-center mt-8 text-xs font-medium ${dark ? "text-zinc-500" : "text-zinc-400"}`}>
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-500 font-bold hover:text-indigo-400">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
    </>
  );
}

export default SignupPage;