"use client";

import { Section } from "./Section";
import { motion } from "framer-motion";
import Image from "next/image";

export function About() {
  return (
    <Section id="about" className="bg-transparent">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-4xl sm:text-6xl font-bold tracking-tight">
            WHO <span className="text-[var(--color-brand-blue)]">AM I</span>
          </h2>
          <p className="text-xl font-medium text-white">
            Hi, I'm <span className="text-[var(--color-brand-blue)]">Kennely Ray</span>.
          </p>
          <p className="text-lg text-gray-400 leading-relaxed">
            I am a passionate Web Developer with a strong focus on building
            scalable, high-performance web applications. I love turning complex
            problems into simple, beautiful, and intuitive designs.
          </p>
          <div className="pt-4 space-y-3 border-t border-gray-800">
            <p className="text-lg text-gray-300">
              <span className="font-semibold text-white">Education:</span> Bachelor of Science in Information Technology
            </p>
            <p className="text-lg text-gray-300">
              <span className="font-semibold text-white">University:</span> Saint Louis University
            </p>
          </div>
        </div>
        <div className="relative aspect-square w-full max-w-md mx-auto">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="w-full h-full rounded-2xl border-4 border-[var(--color-brand-blue)] flex items-center justify-center overflow-hidden shadow-[0_0_30px_rgba(0,168,255,0.3)] relative"
          >
            <Image 
              src="/Me.jpg" 
              alt="My Profile Picture" 
              fill
              className="object-cover object-center grayscale hover:grayscale-0 transition-all duration-500"
            />
          </motion.div>
        </div>
      </div>
    </Section>
  );
}
