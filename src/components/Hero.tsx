"use client";

import { motion } from "framer-motion";

export function Hero() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col items-start justify-center space-y-5 text-left sm:space-y-6">
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
          className="max-w-5xl text-4xl font-bold tracking-tighter text-white sm:text-6xl xl:text-8xl"
        >
          I BUILD
          <br />
          <span className="text-[var(--color-brand-blue)]">WEB EXPERIENCES.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="max-w-3xl text-lg leading-relaxed text-gray-400 sm:text-2xl"
        >
          I&apos;m Kennely Ray, a Web Developer focused on building clean,
          responsive, and purposeful digital products that feel modern,
          intuitive, and reliable.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="max-w-3xl text-sm leading-relaxed text-gray-500 sm:text-lg"
        >
          From internal systems to interactive web platforms, I turn ideas into
          polished experiences with thoughtful UI, smooth interactions, and
          practical full-stack solutions.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
        >
          <a
            href="#works"
            className="inline-flex justify-center rounded-full bg-[var(--color-brand-blue)] px-6 py-4 font-semibold text-black transition-colors duration-300 hover:bg-white sm:px-8"
          >
            View My Work
          </a>
          <a
            href="#contact"
            className="inline-flex justify-center rounded-full border border-white/15 px-6 py-4 font-semibold text-white transition-colors duration-300 hover:border-[var(--color-brand-blue)] hover:text-[var(--color-brand-blue)] sm:px-8"
          >
            Contact Me
          </a>
        </motion.div>
    </div>
  );
}
