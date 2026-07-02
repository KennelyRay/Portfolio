"use client";

import { motion } from "framer-motion";

export function Hero() {
  return (
    <div className="flex flex-col items-start justify-center text-left space-y-6">
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="text-6xl sm:text-8xl font-bold tracking-tighter text-white"
      >
        WEB<br/>
        <span className="text-[var(--color-brand-blue)]">DEVELOPER.</span>
      </motion.h1>
      
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="text-xl sm:text-2xl text-gray-400 max-w-2xl"
      >
        Building digital experiences with modern web technologies. 
        Creative, fast, and responsive.
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <a 
          href="#works"
          className="inline-block px-8 py-4 bg-[var(--color-brand-blue)] text-black font-semibold rounded-full hover:bg-white transition-colors duration-300"
        >
          View My Work
        </a>
      </motion.div>
    </div>
  );
}
