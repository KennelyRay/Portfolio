"use client";

import { useEffect, useState } from "react";
import { Section } from "./Section";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { BriefcaseBusiness, GraduationCap, Lock, LockOpen } from "lucide-react";

export function About() {
  const [unlockStage, setUnlockStage] = useState<
    "locked" | "denied" | "hacking" | "unlocked"
  >("locked");

  useEffect(() => {
    if (unlockStage !== "hacking") {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setUnlockStage("unlocked");
    }, 1400);

    return () => window.clearTimeout(timeoutId);
  }, [unlockStage]);

  useEffect(() => {
    if (unlockStage !== "unlocked") {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setUnlockStage("locked");
    }, 20000);

    return () => window.clearTimeout(timeoutId);
  }, [unlockStage]);

  const isUnlocked = unlockStage === "unlocked";

  const handleUnlock = () => {
    if (unlockStage === "locked") {
      setUnlockStage("denied");
      return;
    }

    if (unlockStage === "denied") {
      setUnlockStage("hacking");
    }
  };

  return (
    <Section id="about" className="bg-transparent">
      <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[minmax(0,1.05fr)_520px]">
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-[var(--color-brand-blue)]">
              More About Me
            </p>
            <h2 className="text-4xl font-bold tracking-tight sm:text-6xl">
              WHO <span className="text-[var(--color-brand-blue)]">AM I</span>
            </h2>
            <p className="max-w-3xl text-xl font-medium text-white sm:text-2xl">
              Hi, I&apos;m <span className="text-[var(--color-brand-blue)]">Kennely Ray</span>,
              a web developer who enjoys building useful products and turning ideas
              into real, working experiences on the web.
            </p>
          </div>

          <p className="max-w-3xl text-lg leading-relaxed text-gray-400">
            I enjoy working on projects that solve real problems, whether that
            means building internal systems, improving user flows, or creating
            interfaces that are straightforward and reliable to use.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
              <div className="mb-4 flex items-center gap-3">
                <BriefcaseBusiness className="h-5 w-5 text-[var(--color-brand-blue)]" />
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-gray-500">
                  Focus
                </p>
              </div>
              <p className="text-lg font-semibold text-white">
                Web Development
              </p>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">
                Interfaces, systems, and experiences built with purpose.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
              <div className="mb-4 flex items-center gap-3">
                <GraduationCap className="h-5 w-5 text-[var(--color-brand-blue)]" />
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-gray-500">
                  Education
                </p>
              </div>
              <p className="text-lg font-semibold text-white">
                BS Information Technology
              </p>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">
                Saint Louis University
              </p>
            </div>
          </div>
        </div>

        <div className="relative mx-auto aspect-[4/4.7] w-full max-w-[500px]">
          <div className="absolute -left-5 top-12 h-28 w-28 rounded-full bg-[var(--color-brand-blue)]/15 blur-3xl" />
          <div className="absolute -right-3 bottom-8 h-36 w-36 rounded-full bg-[var(--color-brand-blue)]/10 blur-3xl" />

          <motion.div
            whileHover={{ scale: 1.02, y: -6 }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
            className="relative h-full overflow-hidden rounded-[2rem] border border-[var(--color-brand-blue)]/35 bg-black/30 shadow-[0_0_35px_rgba(0,168,255,0.18)]"
          >
            <Image
              src="/Me.jpg"
              alt="Portrait of Kennely Ray"
              fill
              className={`object-cover object-center transition-all duration-700 ${
                isUnlocked
                  ? "scale-100 blur-0 grayscale-0"
                  : "scale-[1.08] blur-lg grayscale brightness-[0.38]"
              }`}
            />

            <motion.div
              animate={{
                background: isUnlocked
                  ? "linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0), rgba(0,168,255,0.10))"
                  : "linear-gradient(to top, rgba(0,0,0,0.94), rgba(0,0,0,0.72), rgba(0,168,255,0.12))",
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute inset-0"
            />

            <AnimatePresence>
              {!isUnlocked ? (
                <motion.div
                  key="locked-overlay"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 1.04 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/55 px-6 text-center backdrop-blur-[4px]"
                >
                  <motion.div
                    animate={{
                      rotate:
                        unlockStage === "denied" ? [-10, 10, -6, 6, 0] : 0,
                      scale:
                        unlockStage === "denied"
                          ? [1, 1.08, 0.98, 1.03, 1]
                          : unlockStage === "hacking"
                            ? [1, 1.04, 1]
                            : 1,
                    }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    className="flex flex-col items-center"
                  >
                    <div className="flex h-18 w-18 items-center justify-center rounded-full border border-[var(--color-brand-blue)]/35 bg-black/55 shadow-[0_0_30px_rgba(0,168,255,0.16)]">
                      <Lock className="h-8 w-8 text-[var(--color-brand-blue)]" />
                    </div>
                    <p className="mt-5 text-xs font-bold uppercase tracking-[0.34em] text-[var(--color-brand-blue)]">
                      {unlockStage === "locked" && "Profile Locked"}
                      {unlockStage === "denied" && "Lock Negotiation Failed"}
                      {unlockStage === "hacking" && "Face Reveal Protocol"}
                    </p>
                    <p className="mt-3 max-w-xs text-sm leading-relaxed text-gray-300">
                      {unlockStage === "locked" &&
                        "This face reveal is highly classified. Tap the lock if you think you are emotionally prepared."}
                      {unlockStage === "denied" &&
                        "Access denied. The lock is pretending to be tough, but it is clearly starting to panic."}
                      {unlockStage === "hacking" &&
                        "Deploying face reveal patch, bribing the lock, and convincing the pixels to cooperate... stand by."}
                    </p>
                  </motion.div>

                  <AnimatePresence mode="wait">
                    {unlockStage === "hacking" ? (
                      <motion.div
                        key="hacking-status"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-6 w-full max-w-xs"
                      >
                        <div className="rounded-2xl border border-[var(--color-brand-blue)]/20 bg-black/55 p-4 text-left">
                          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.24em] text-gray-400">
                            <span>Lock Negotiation</span>
                            <span className="text-[var(--color-brand-blue)]">
                              99.9%
                            </span>
                          </div>
                          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                            <motion.div
                              initial={{ width: "0%" }}
                              animate={{ width: "100%" }}
                              transition={{ duration: 1.15, ease: "easeInOut" }}
                              className="h-full rounded-full bg-[var(--color-brand-blue)] shadow-[0_0_16px_rgba(0,168,255,0.45)]"
                            />
                          </div>
                          <p className="mt-3 text-xs leading-relaxed text-gray-300">
                            Running `deploy-face-reveal-patch.exe`...
                          </p>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.button
                        key="unlock-button"
                        type="button"
                        onClick={handleUnlock}
                        whileHover={{ y: -2, scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-brand-blue)]/35 bg-black/65 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.24em] text-white transition-colors duration-300 hover:border-[var(--color-brand-blue)] hover:text-[var(--color-brand-blue)]"
                        aria-label={
                          unlockStage === "locked"
                            ? "Tap to test the lock"
                            : "Tap again to bypass the lock"
                        }
                      >
                        <Lock className="h-3.5 w-3.5" />
                        {unlockStage === "locked" && "Tap To Unlock"}
                        {unlockStage === "denied" && "Try Again"}
                      </motion.button>
                    )}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.div
                  key="unlocked-badge"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="pointer-events-none absolute left-5 top-5 z-20 inline-flex items-center gap-2 rounded-full border border-[var(--color-brand-blue)]/30 bg-black/45 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-white backdrop-blur-md"
                >
                  <LockOpen className="h-3.5 w-3.5 text-[var(--color-brand-blue)]" />
                  Face Reveal Successful
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              animate={{
                borderColor: isUnlocked
                  ? "rgba(255,255,255,0.10)"
                  : "rgba(255,255,255,0.06)",
                backgroundColor: isUnlocked
                  ? "rgba(0,0,0,0.45)"
                  : "rgba(0,0,0,0.72)",
              }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="pointer-events-none absolute bottom-5 left-5 right-5 z-10 rounded-[1.5rem] border p-4 backdrop-blur-md"
            >
              {isUnlocked ? (
                <>
                  <p className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--color-brand-blue)]">
                    Kennely Ray
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    Web Developer
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-gray-300">
                    Building practical web experiences with clean execution and reliable usability.
                  </p>
                </>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--color-brand-blue)]/75">
                    Identity Redacted
                  </p>
                  <div className="h-6 w-40 rounded-full bg-white/10" />
                  <div className="space-y-2">
                    <div className="h-3 w-full rounded-full bg-white/8" />
                    <div className="h-3 w-[86%] rounded-full bg-white/8" />
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}
