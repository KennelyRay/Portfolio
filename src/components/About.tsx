"use client";

import { Section } from "./Section";
import { motion } from "framer-motion";
import Image from "next/image";
import { BriefcaseBusiness, GraduationCap, MapPin, Sparkles } from "lucide-react";

export function About() {
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
              a developer who enjoys turning ideas into clean, usable, and
              meaningful web experiences.
            </p>
          </div>

          <p className="max-w-3xl text-lg leading-relaxed text-gray-400">
            I build websites and systems with a strong focus on clarity,
            usability, and thoughtful implementation. My goal is to create
            digital products that not only work well, but also feel polished,
            intuitive, and easy for people to use.
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
                Building responsive interfaces and practical digital systems.
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

          <div className="flex flex-wrap gap-3 pt-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-gray-300">
              <MapPin className="h-4 w-4 text-[var(--color-brand-blue)]" />
              Purposeful Digital Products
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-gray-300">
              <Sparkles className="h-4 w-4 text-[var(--color-brand-blue)]" />
              Clean and Intuitive Experiences
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
              className="object-cover object-center transition-all duration-500 hover:scale-[1.03]"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-[var(--color-brand-blue)]/10" />

            <div className="absolute bottom-5 left-5 right-5 rounded-[1.5rem] border border-white/10 bg-black/45 p-4 backdrop-blur-md">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--color-brand-blue)]">
                Kennely Ray
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                Web Developer
              </p>
              <p className="mt-2 text-sm leading-relaxed text-gray-300">
                Focused on thoughtful interfaces, practical systems, and polished user experiences.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}
