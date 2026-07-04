"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

export function ScrollCue() {
  const [canScrollMore, setCanScrollMore] = useState(true);

  useEffect(() => {
    const updateScrollState = () => {
      const scrollTop = window.scrollY;
      const viewportHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;

      setCanScrollMore(scrollTop + viewportHeight < fullHeight - 120);
    };

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      window.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, []);

  const handleScrollDown = () => {
    window.scrollBy({
      top: Math.max(window.innerHeight * 0.78, 520),
      behavior: "smooth",
    });
  };

  return (
    <motion.button
      type="button"
      onClick={handleScrollDown}
      initial={{ opacity: 0, y: 24 }}
      animate={
        canScrollMore
          ? { opacity: 1, y: [0, 10, 0], scale: [1, 1.04, 1] }
          : { opacity: 0, y: 24, scale: 0.96 }
      }
      transition={{
        opacity: { duration: 0.3 },
        y: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
        scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
      }}
      className="fixed bottom-6 left-1/2 z-40 hidden -translate-x-1/2 items-center justify-center rounded-full border border-[var(--color-brand-blue)]/35 bg-black/55 p-3 text-white shadow-[0_0_30px_rgba(0,168,255,0.16)] backdrop-blur-md transition-colors duration-300 hover:border-[var(--color-brand-blue)] hover:text-[var(--color-brand-blue)] xl:flex"
      aria-label="Scroll down"
      style={{ pointerEvents: canScrollMore ? "auto" : "none" }}
    >
      <ChevronDown className="h-6 w-6" />
    </motion.button>
  );
}
