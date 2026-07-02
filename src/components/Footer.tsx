"use client";

import { motion } from "framer-motion";
import { ArrowUp, Heart } from "lucide-react";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-[#050505] border-t border-gray-800">
      <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-10 xl:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="text-2xl font-black text-white tracking-tighter">
              KR<span className="text-[var(--color-brand-blue)]">.</span>
            </span>
            <p className="text-sm text-gray-500 font-medium">
              Building digital experiences.
            </p>
          </div>

          <motion.button
            onClick={scrollToTop}
            whileHover={{ y: -5, backgroundColor: "var(--color-brand-blue)", color: "black" }}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-[#111] text-gray-400 transition-colors duration-300 border border-gray-800"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>

        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800/50 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-semibold tracking-widest text-gray-600 uppercase">
          <p>© {new Date().getFullYear()} KENNELY RAY. ALL RIGHTS RESERVED.</p>
          <p className="flex items-center gap-1.5">
            DESIGNED & BUILT WITH <Heart className="w-3.5 h-3.5 text-[var(--color-brand-blue)] fill-[var(--color-brand-blue)]" />
          </p>
        </div>
      </div>
    </footer>
  );
}
