"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "framer-motion";
import { useState, useEffect, useSyncExternalStore } from "react";
import { Menu, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { sections } from "@/lib/site";
import { useActiveSection } from "@/lib/active-section";
import { openCommandPalette } from "@/lib/ui-events";

const subscribeToNothing = () => () => {};

// Platform only matters for the shortcut label; the server renders "Ctrl".
function useIsMac() {
  return useSyncExternalStore(
    subscribeToNothing,
    () => /Mac|iPhone|iPad/.test(navigator.userAgent),
    () => false,
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const activeSection = useActiveSection();
  const isMac = useIsMac();

  // One scroll source for both the background swap and the progress bar.
  // setState with an unchanged boolean bails out, so this only re-renders at
  // the 50px threshold, not on every scroll frame.
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 40,
    restDelta: 0.001,
  });

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        aria-label="Primary"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={cn(
          "fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8 xl:px-12 transition-[background-color,padding,box-shadow] duration-300",
          scrolled || menuOpen
            ? "bg-black/80 py-3 shadow-lg backdrop-blur-md"
            : "bg-transparent",
        )}
      >
        {/* Reading progress along the bottom edge of the bar. */}
        <motion.div
          aria-hidden="true"
          style={{ scaleX: progress }}
          className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-[var(--color-brand-blue)] shadow-[0_0_10px_rgba(0,168,255,0.6)]"
        />

        <a
          href="#home"
          onClick={closeMenu}
          aria-label="Kennely Ray, back to top"
          className="group relative flex h-11 w-11 items-center justify-center rounded-xl border-2 border-[var(--color-brand-blue)] transition-colors duration-300 hover:bg-[var(--color-brand-blue)] sm:h-12 sm:w-12"
        >
          <span className="text-xl font-black tracking-tighter text-white transition-colors duration-300 group-hover:text-black sm:text-2xl">
            KR
          </span>
        </a>

        <div className="hidden xl:flex items-center gap-8">
          {sections.map((item) => {
            const isActive = item.id === activeSection;

            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "relative py-1 text-sm font-bold tracking-widest transition-colors duration-300 hover:text-white",
                  isActive ? "text-white" : "text-gray-400",
                )}
              >
                {item.navLabel}
                {isActive ? (
                  <motion.span
                    layoutId="nav-active"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full bg-[var(--color-brand-blue)]"
                  />
                ) : null}
              </a>
            );
          })}

          <button
            type="button"
            onClick={openCommandPalette}
            className="inline-flex h-10 items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] pl-4 pr-2 text-xs font-bold uppercase tracking-[0.2em] text-gray-400 transition-colors duration-300 hover:border-[var(--color-brand-blue)] hover:text-white"
            aria-label="Open quick navigation"
            aria-keyshortcuts={isMac ? "Meta+K" : "Control+K"}
          >
            <Search className="h-4 w-4" />
            Jump to
            <kbd className="rounded-md border border-white/15 bg-black/40 px-1.5 py-0.5 font-mono text-[10px] tracking-normal text-gray-300">
              {isMac ? "⌘K" : "Ctrl K"}
            </kbd>
          </button>
        </div>

        <div className="flex items-center gap-2 xl:hidden">
          <button
            type="button"
            onClick={() => {
              closeMenu();
              openCommandPalette();
            }}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white transition-colors duration-300 hover:border-[var(--color-brand-blue)] hover:text-[var(--color-brand-blue)]"
            aria-label="Open quick navigation"
          >
            <Search className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            className="inline-flex h-11 items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 text-xs font-bold uppercase tracking-[0.3em] text-white transition-colors duration-300 hover:border-[var(--color-brand-blue)] hover:text-[var(--color-brand-blue)]"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>
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
                  {sections.map((item, index) => {
                    const isActive = item.id === activeSection;

                    return (
                      <motion.a
                        key={item.id}
                        href={`#${item.id}`}
                        onClick={closeMenu}
                        aria-current={isActive ? "true" : undefined}
                        initial={{ opacity: 0, x: -18 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -18 }}
                        transition={{ duration: 0.24, delay: index * 0.04 }}
                        className={cn(
                          "flex items-center justify-between rounded-[1.5rem] border px-5 py-4 transition-colors duration-300 hover:border-[var(--color-brand-blue)]/35 hover:bg-[var(--color-brand-blue)]/8",
                          isActive
                            ? "border-[var(--color-brand-blue)]/45 bg-[var(--color-brand-blue)]/10"
                            : "border-white/10 bg-white/[0.03]",
                        )}
                      >
                        <span className="text-sm font-bold uppercase tracking-[0.28em] text-white">
                          {item.navLabel}
                        </span>
                        <span
                          className={cn(
                            "text-xs font-bold tracking-[0.3em]",
                            isActive ? "text-[var(--color-brand-blue)]" : "text-gray-500",
                          )}
                        >
                          0{index + 1}
                        </span>
                      </motion.a>
                    );
                  })}
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
