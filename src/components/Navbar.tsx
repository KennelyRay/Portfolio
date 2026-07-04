"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
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
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={cn(
          "fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8 xl:px-12 transition-all duration-300",
          scrolled || menuOpen
            ? "bg-black/80 py-3 shadow-lg backdrop-blur-md"
            : "bg-transparent",
        )}
      >
        <a
          href="#home"
          onClick={closeMenu}
          className="group relative flex h-11 w-11 items-center justify-center rounded-xl border-2 border-[var(--color-brand-blue)] transition-colors duration-300 hover:bg-[var(--color-brand-blue)] sm:h-12 sm:w-12"
        >
          <span className="text-xl font-black tracking-tighter text-white transition-colors duration-300 group-hover:text-black sm:text-2xl">
            KR
          </span>
        </a>

        <div className="hidden xl:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-sm font-bold tracking-widest text-gray-400 transition-colors duration-300 hover:text-white"
            >
              {item.name}
            </a>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
          className="inline-flex h-11 items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 text-xs font-bold uppercase tracking-[0.3em] text-white transition-colors duration-300 hover:border-[var(--color-brand-blue)] hover:text-[var(--color-brand-blue)] xl:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          {menuOpen ? "Close" : "Menu"}
        </button>
      </motion.nav>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md xl:hidden"
          >
            <motion.div
              id="mobile-navigation"
              initial={{ opacity: 0, y: -24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="flex min-h-screen flex-col px-4 pb-8 pt-24 sm:px-6"
            >
              <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col rounded-[2rem] border border-white/10 bg-[#05070a]/95 p-5 shadow-[0_0_40px_rgba(0,168,255,0.08)] sm:p-6">
                <div className="mb-8 flex items-center justify-between gap-4 border-b border-white/10 pb-5">
                  <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-[0.35em] text-[var(--color-brand-blue)]">
                      Navigation
                    </p>
                    <p className="text-sm leading-relaxed text-gray-400">
                      Explore the portfolio with a mobile-first menu built for quick jumps.
                    </p>
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-3">
                  {navItems.map((item, index) => (
                    <motion.a
                      key={item.name}
                      href={item.href}
                      onClick={closeMenu}
                      initial={{ opacity: 0, x: -18 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -18 }}
                      transition={{ duration: 0.24, delay: index * 0.04 }}
                      className="flex items-center justify-between rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-5 py-4 transition-colors duration-300 hover:border-[var(--color-brand-blue)]/35 hover:bg-[var(--color-brand-blue)]/8"
                    >
                      <span className="text-sm font-bold uppercase tracking-[0.28em] text-white">
                        {item.name}
                      </span>
                      <span className="text-xs font-bold tracking-[0.3em] text-gray-500">
                        0{index + 1}
                      </span>
                    </motion.a>
                  ))}
                </div>

                <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-black/30 p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500">
                    KR Portfolio
                  </p>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-gray-400">
                    Mobile and tablet view tuned for easier browsing, cleaner spacing, and faster section access.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
