import React from "react";
import { motion } from "framer-motion";
import { FiArrowRight, FiShield, FiTrendingUp } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useTheme } from "../Context/ThemeContext";

const HomeSection = () => {
  const { dark } = useTheme();

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  return (
    <section className={`relative w-full py-10  flex flex-col items-center justify-center overflow-hidden transition-colors duration-500 ${dark ? "bg-zinc-950" : "bg-zinc-50"}`}>
      <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center lg:text-left"
        >
          <motion.div 
            variants={fadeUp}
            className={`inline-flex items-center gap-2 px-3 mb-2 rounded-full border ${dark ? "border-indigo-500/30 bg-indigo-500/10" : "border-indigo-200 bg-indigo-50"}`}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span className="text-indigo-500 text-[10px] font-bold tracking-[0.2em] uppercase">
              Join the 1% of Creators
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className={`text-5xl md:text-7xl font-extrabold leading-[1.1] mb-6 tracking-tighter ${dark ? "text-white" : "text-zinc-900"}`}
          >
            A New Way To <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-indigo-600 to-purple-600">
              Share Reality
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className={`text-lg md:text-xl max-w-lg mx-auto lg:mx-0 mb-10 leading-relaxed font-medium ${dark ? "text-zinc-400" : "text-zinc-600"}`}
          >
            Snappost is a minimalist digital canvas designed for high-signal creators. No noise, just pure aesthetic storytelling.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link to="/signup">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl text-lg shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2 group"
              >
                Start Creating <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </motion.div>

        
        </motion.div>

        {/* Right Content */}
        <div className="relative flex items-center justify-center">
          <div className="grid grid-cols-2 gap-4 w-full max-w-[500px] relative">
            
            {/* Card 1: Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className={`p-6 rounded-[2rem] border backdrop-blur-xl mt-12 ${dark ? "bg-zinc-900/50 border-zinc-800" : "bg-white/80 border-zinc-200 shadow-xl"}`}
            >
              <FiTrendingUp className="text-indigo-500 mb-4" size={24} />
              <h3 className={`font-bold mb-2 ${dark ? "text-white" : "text-zinc-900"}`}>Analytics</h3>
              <div className="space-y-2">
                <div className={`h-1.5 w-full rounded-full overflow-hidden ${dark ? "bg-zinc-800" : "bg-zinc-100"}`}>
                  <motion.div initial={{width: 0}} animate={{width: '70%'}} transition={{duration: 2, delay: 1}} className="h-full bg-indigo-500" />
                </div>
                <div className={`h-1.5 w-full rounded-full overflow-hidden ${dark ? "bg-zinc-800" : "bg-zinc-100"}`}>
                  <motion.div initial={{width: 0}} animate={{width: '45%'}} transition={{duration: 2, delay: 1.2}} className="h-full bg-purple-500" />
                </div>
              </div>
            </motion.div>

            {/* Card 2: Security */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="p-6 rounded-[2rem] bg-indigo-600 text-white shadow-2xl shadow-indigo-500/30"
            >
              <FiShield className="mb-4 text-white" size={24} />
              <h3 className="font-bold mb-1">Privacy</h3>
              <p className="text-[10px] text-indigo-100 leading-relaxed uppercase font-bold tracking-tighter">Encrypted</p>
            </motion.div>

            {/* Card 3: Profile Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 }}
              className={`col-span-2 p-6 rounded-[2rem] border backdrop-blur-xl flex items-center gap-6 ${dark ? "bg-zinc-900/50 border-zinc-800" : "bg-white/80 border-zinc-200 shadow-xl"}`}
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-0.5">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" className={`rounded-full ${dark ? "bg-zinc-900" : "bg-white"}`} alt="User" />
              </div>
              <div className="flex-1">
                <div className={`h-2 w-24 rounded-full mb-2 ${dark ? "bg-zinc-700" : "bg-zinc-200"}`} />
                <div className={`h-2 w-full rounded-full ${dark ? "bg-zinc-800" : "bg-zinc-100"}`} />
              </div>
              
            </motion.div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default HomeSection;