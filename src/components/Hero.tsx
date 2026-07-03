"use client";

import { motion } from "framer-motion";
import { BriefcaseBusiness, Code2, GraduationCap, Layers3 } from "lucide-react";

export function Hero() {
  return (
    <div className="grid w-full items-center gap-14 lg:grid-cols-[minmax(0,1.15fr)_420px] xl:grid-cols-[minmax(0,1.2fr)_460px]">
      <div className="flex flex-col items-start justify-center space-y-6 text-left">
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
          className="max-w-5xl text-5xl font-bold tracking-tighter text-white sm:text-7xl xl:text-8xl"
        >
          I BUILD
          <br />
          <span className="text-[var(--color-brand-blue)]">WEB EXPERIENCES.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="max-w-3xl text-xl text-gray-400 sm:text-2xl"
        >
          I&apos;m Kennely Ray, a Web Developer focused on building clean,
          responsive, and purposeful digital products that feel modern,
          intuitive, and reliable.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="max-w-3xl text-base leading-relaxed text-gray-500 sm:text-lg"
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
            className="inline-block rounded-full bg-[var(--color-brand-blue)] px-8 py-4 font-semibold text-black transition-colors duration-300 hover:bg-white"
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

      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.55, duration: 0.8 }}
        className="grid gap-4"
      >
        <div className="rounded-[1.75rem] border border-white/10 bg-black/35 p-6 backdrop-blur-sm">
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--color-brand-blue)]">
            Quick Snapshot
          </p>

          <div className="mt-6 space-y-4">
            <div className="flex items-start gap-4 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <BriefcaseBusiness className="mt-0.5 h-5 w-5 text-[var(--color-brand-blue)]" />
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-gray-500">
                  Focus
                </p>
                <p className="mt-2 text-base font-medium text-white">
                  Web apps, internal systems, and modern user experiences
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <GraduationCap className="mt-0.5 h-5 w-5 text-[var(--color-brand-blue)]" />
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-gray-500">
                  Education
                </p>
                <p className="mt-2 text-base font-medium text-white">
                  BS Information Technology, Saint Louis University
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
            <Code2 className="h-5 w-5 text-[var(--color-brand-blue)]" />
            <p className="mt-4 text-xs font-bold uppercase tracking-[0.22em] text-gray-500">
              Approach
            </p>
            <p className="mt-2 text-lg font-semibold text-white">
              Clean and scalable builds
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
            <Layers3 className="h-5 w-5 text-[var(--color-brand-blue)]" />
            <p className="mt-4 text-xs font-bold uppercase tracking-[0.22em] text-gray-500">
              Strength
            </p>
            <p className="mt-2 text-lg font-semibold text-white">
              UI, systems, and full-stack execution
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
