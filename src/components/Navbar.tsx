"use client";

import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "framer-motion";
import { useState, useSyncExternalStore } from "react";
import { Search } from "lucide-react";
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

// Below xl, section navigation lives in the bottom tab bar (MobileNavigator),
// so the top bar is just identity and search, and it gets out of the way while
// reading.
const DESKTOP_QUERY = "(min-width: 1280px)";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [tucked, setTucked] = useState(false);
  const activeSection = useActiveSection();
  const isMac = useIsMac();

  // One scroll source for the background swap, the hide-on-scroll and the
  // progress bar. setState with an unchanged value bails out, so this only
  // re-renders when one of those booleans flips, not on every scroll frame.
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 40,
    restDelta: 0.001,
  });

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);

    if (window.matchMedia(DESKTOP_QUERY).matches) {
      setTucked(false);
      return;
    }

    // Small movements (and iOS rubber-banding) should not flicker the bar.
    const previous = scrollY.getPrevious() ?? latest;
    const delta = latest - previous;
    if (latest < 120) {
      setTucked(false);
    } else if (delta > 6) {
      setTucked(true);
    } else if (delta < -6) {
      setTucked(false);
    }
  });

  return (
    <motion.nav
      aria-label="Primary"
      initial={{ y: -100 }}
      animate={{ y: tucked ? "-100%" : 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 32 }}
      className={cn(
        "fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-6 lg:px-8 xl:px-12 xl:py-4 transition-[background-color,padding,box-shadow] duration-300",
        scrolled
          ? "bg-black/80 shadow-lg backdrop-blur-md xl:py-3"
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

      {/* Search as a field-shaped pill rather than a bare icon: it reads as
          "find a project" at a glance, the way app search bars do. */}
      <button
        type="button"
        onClick={openCommandPalette}
        className="inline-flex h-11 items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.05] pl-4 pr-5 text-sm text-gray-400 backdrop-blur-md transition-colors duration-300 active:bg-white/10 xl:hidden"
        aria-label="Search projects and sections"
      >
        <Search className="h-4 w-4 text-[var(--color-brand-blue)]" />
        Search
      </button>
    </motion.nav>
  );
}
