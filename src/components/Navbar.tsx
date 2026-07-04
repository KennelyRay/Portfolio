"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "HOME", href: "#home" },
  { name: "MY WORKS", href: "#works" },
  { name: "TECH STACK", href: "#stack" },
  { name: "WHO AM I", href: "#about" },
  { name: "CONTACT ME", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-6 sm:px-6 lg:px-10 xl:px-12 transition-all duration-300",
        scrolled ? "bg-black/80 backdrop-blur-md py-4 shadow-lg" : "bg-transparent"
      )}
    >
      <a 
        href="#home" 
        className="group relative flex items-center justify-center w-12 h-12 border-2 border-[var(--color-brand-blue)] rounded-xl hover:bg-[var(--color-brand-blue)] transition-colors duration-300"
      >
        <span className="text-2xl font-black text-white group-hover:text-black transition-colors duration-300 tracking-tighter">
          KR
        </span>
      </a>
      
      <div className="hidden md:flex items-center gap-8">
        {navItems.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className="text-sm font-bold tracking-widest text-gray-400 hover:text-white transition-colors duration-300"
          >
            {item.name}
          </a>
        ))}
      </div>
      
      <div className="md:hidden text-white font-bold tracking-widest cursor-pointer hover:text-[var(--color-brand-blue)] transition-colors">
        MENU
      </div>
    </motion.nav>
  );
}
