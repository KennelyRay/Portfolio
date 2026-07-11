"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const bootMessages = [
  "INITIALIZING PORTFOLIO...",
  "LOADING PROJECT FILES...",
  "COMPILING WEB EXPERIENCES...",
  "CALIBRATING INTERFACE...",
  "SYNCING TECH STACK...",
  "FINALIZING BUILD...",
];

const loadingTips = [
  "TIP: USE THE PROJECT BROWSER TO EXPLORE PREVIOUS WORKS.",
  "TIP: EVERY PROJECT CARD OPENS A LIVE DEPLOYMENT.",
  "TIP: THE CONTACT SECTION IS ALWAYS UNLOCKED.",
];

export function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [tip] = useState(
    () => loadingTips[Math.floor(Math.random() * loadingTips.length)],
  );

  const messageIndex = Math.min(
    Math.floor((progress / 100) * bootMessages.length),
    bootMessages.length - 1,
  );
  const isComplete = progress >= 100;

  useEffect(() => {
    let currentProgress = 0;
    let timeoutId: number;

    const advance = () => {
      // Uneven, stuttering increments so the bar fills like a real game loader.
      const increment =
        currentProgress < 70
          ? Math.random() * 16 + 6
          : Math.random() * 8 + 3;
      currentProgress = Math.min(currentProgress + increment, 100);
      setProgress(Math.round(currentProgress));

      if (currentProgress < 100) {
        timeoutId = window.setTimeout(advance, Math.random() * 220 + 120);
      } else {
        timeoutId = window.setTimeout(() => setIsDone(true), 650);
      }
    };

    timeoutId = window.setTimeout(advance, 300);
    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (isDone) {
      return;
    }

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDone]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          exit={{ opacity: 0, y: "-4%" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[var(--color-brand-black)] px-6"
          aria-label="Loading portfolio"
          role="status"
        >
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,168,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,168,255,0.04)_1px,transparent_1px)] bg-[size:44px_44px]" />

          <div className="pointer-events-none absolute left-5 top-5 h-8 w-8 border-l-2 border-t-2 border-[var(--color-brand-blue)]/50 sm:left-8 sm:top-8" />
          <div className="pointer-events-none absolute right-5 top-5 h-8 w-8 border-r-2 border-t-2 border-[var(--color-brand-blue)]/50 sm:right-8 sm:top-8" />
          <div className="pointer-events-none absolute bottom-5 left-5 h-8 w-8 border-b-2 border-l-2 border-[var(--color-brand-blue)]/50 sm:bottom-8 sm:left-8" />
          <div className="pointer-events-none absolute bottom-5 right-5 h-8 w-8 border-b-2 border-r-2 border-[var(--color-brand-blue)]/50 sm:bottom-8 sm:right-8" />

          <div className="relative flex w-full max-w-xl flex-col items-center gap-8">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center text-4xl font-bold tracking-tighter text-white sm:text-6xl"
            >
              KEN<span className="text-[var(--color-brand-blue)]">-DEV</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="w-full space-y-3"
            >
              <div className="flex items-center justify-between font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-gray-500 sm:text-xs">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={isComplete ? "ready" : messageIndex}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className={isComplete ? "text-[var(--color-brand-blue)]" : ""}
                  >
                    {isComplete ? "READY" : bootMessages[messageIndex]}
                  </motion.span>
                </AnimatePresence>
                <span className="text-[var(--color-brand-blue)]">
                  {progress}%
                </span>
              </div>

              <div className="h-2.5 w-full overflow-hidden rounded-full border border-white/10 bg-white/[0.04] p-[3px]">
                <motion.div
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="h-full rounded-full bg-[var(--color-brand-blue)] shadow-[0_0_12px_rgba(0,168,255,0.7)]"
                />
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-center font-mono text-[10px] leading-relaxed tracking-[0.2em] text-gray-600 sm:text-xs"
            >
              {tip}
            </motion.p>
          </div>

          <motion.p
            animate={{ opacity: [0.25, 1, 0.25] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-14 font-mono text-[10px] font-bold uppercase tracking-[0.35em] text-gray-600 sm:bottom-20 sm:text-xs"
          >
            {isComplete ? "ENTERING PORTFOLIO" : "LOADING"}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
