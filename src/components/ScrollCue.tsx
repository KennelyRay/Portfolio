"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowUp, ChevronDown } from "lucide-react";
import { useState } from "react";

/**
 * Desktop scroll helper: nudges visitors down the page, then turns into a
 * back-to-top button once there is nothing left below.
 */
export function ScrollCue() {
  const [atEnd, setAtEnd] = useState(false);
  const { scrollY } = useScroll();

  // setState bails out when the boolean is unchanged, so this re-renders only
  // when the end of the page is crossed.
  useMotionValueEvent(scrollY, "change", (latest) => {
    const fullHeight = document.documentElement.scrollHeight;
    setAtEnd(latest + window.innerHeight >= fullHeight - 120);
  });

  const handleClick = () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (atEnd) {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
      return;
    }

    window.scrollBy({
      top: Math.max(window.innerHeight * 0.78, 520),
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.6 }}
      className="fixed bottom-6 left-1/2 z-40 hidden -translate-x-1/2 items-center justify-center rounded-full border border-[var(--color-brand-blue)]/35 bg-black/55 p-3 text-white shadow-[0_0_30px_rgba(0,168,255,0.16)] backdrop-blur-md transition-colors duration-300 hover:border-[var(--color-brand-blue)] hover:text-[var(--color-brand-blue)] xl:flex"
      aria-label={atEnd ? "Back to top" : "Scroll down"}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={atEnd ? "up" : "down"}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.18 }}
          className="flex"
        >
          {/* The bob is a CSS animation so it runs on the compositor rather
              than as a never-ending JS animation loop. */}
          {atEnd ? (
            <ArrowUp className="h-6 w-6" />
          ) : (
            <ChevronDown className="motion-safe-only h-6 w-6 [animation:cue-bob_1.5s_ease-in-out_infinite]" />
          )}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
