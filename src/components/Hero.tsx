"use client";

import { motion } from "framer-motion";

export function Hero() {
  return (
    <div className="flex flex-col items-start justify-center text-left space-y-6">
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.8 }}
        className="text-sm font-bold uppercase tracking-[0.35em] text-[var(--color-brand-blue)]"
      >
        KENNELY RAY
      </motion.p>

      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="text-6xl sm:text-8xl font-bold tracking-tighter text-white"
      >
        I BUILD<br/>
        <span className="text-[var(--color-brand-blue)]">WEB EXPERIENCES.</span>
      </motion.h1>
      
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="text-xl sm:text-2xl text-gray-400 max-w-2xl"
      >
        I'm Kennely Ray, a Web Developer focused on building clean,
        responsive, and purposeful digital products that feel modern,
        intuitive, and reliable.
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="max-w-2xl text-base leading-relaxed text-gray-500 sm:text-lg"
      >
        From internal systems to interactive web platforms, I turn ideas into
        polished experiences with thoughtful UI, smooth interactions, and
        practical full-stack solutions.
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="flex flex-wrap items-center gap-4"
      >
        <a 
          href="#works"
          className="inline-block px-8 py-4 bg-[var(--color-brand-blue)] text-black font-semibold rounded-full hover:bg-white transition-colors duration-300"
        >
          View My Work
        </a>
        <a
          href="#contact"
          className="inline-block rounded-full border border-white/15 px-8 py-4 font-semibold text-white transition-colors duration-300 hover:border-[var(--color-brand-blue)] hover:text-[var(--color-brand-blue)]"
        >
          Contact Me
        </a>
      </motion.div>
    </div>
  );
}
