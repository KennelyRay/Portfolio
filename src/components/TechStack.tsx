"use client";

import { Section } from "./Section";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  SiJavascript,
  SiHtml5,
  SiCss,
  SiTailwindcss,
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiMongodb,
  SiPostgresql,
  SiMysql,
  SiNodedotjs,
} from "react-icons/si";
import { FaDatabase } from "react-icons/fa";
import { FaServer } from "react-icons/fa6";
import { ChevronLeft, ChevronRight } from "lucide-react";

const techStack = [
  {
    name: "JavaScript",
    Icon: SiJavascript,
    category: "Frontend",
    note: "Interactive UI logic and dynamic application behavior.",
  },
  {
    name: "HTML5",
    Icon: SiHtml5,
    category: "Frontend",
    note: "Semantic structure for accessible and scalable web interfaces.",
  },
  {
    name: "CSS",
    Icon: SiCss,
    category: "Frontend",
    note: "Modern styling and responsive layouts for polished interfaces.",
  },
  {
    name: "Tailwind CSS",
    Icon: SiTailwindcss,
    category: "Frontend",
    note: "Utility-first styling for fast, consistent component design.",
  },
  {
    name: "React",
    Icon: SiReact,
    category: "Frontend",
    note: "Component-driven UI architecture for modern web applications.",
  },
  {
    name: "NextJS",
    Icon: SiNextdotjs,
    category: "Frontend",
    note: "Full-stack React framework for production-ready experiences.",
  },
  {
    name: "TypeScript",
    Icon: SiTypescript,
    category: "Frontend",
    note: "Type-safe development for scalable, maintainable codebases.",
  },
  {
    name: "Node JS",
    Icon: SiNodedotjs,
    category: "Backend",
    note: "Server-side runtime for APIs, services, and app logic.",
  },
  {
    name: "Mongo DB",
    Icon: SiMongodb,
    category: "Database",
    note: "Document database for flexible and scalable data modeling.",
  },
  {
    name: "Neon DB",
    Icon: FaDatabase,
    category: "Database",
    note: "Serverless Postgres platform for modern cloud-native apps.",
  },
  {
    name: "Postgres DB",
    Icon: SiPostgresql,
    category: "Database",
    note: "Reliable relational database for structured, performant systems.",
  },
  {
    name: "MySQL",
    Icon: SiMysql,
    category: "Database",
    note: "Widely-used relational database for dependable app backends.",
  },
  {
    name: "SQL WorkBench",
    Icon: FaServer,
    category: "Database",
    note: "Database tooling for administration, queries, and optimization.",
  },
];

export function TechStack() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeTech = techStack[activeIndex];

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((current) =>
        current === techStack.length - 1 ? 0 : current + 1,
      );
    }, 2500);

    return () => window.clearInterval(interval);
  }, []);

  const goToPrevious = () => {
    setActiveIndex((current) =>
      current === 0 ? techStack.length - 1 : current - 1,
    );
  };

  const goToNext = () => {
    setActiveIndex((current) =>
      current === techStack.length - 1 ? 0 : current + 1,
    );
  };

  return (
    <Section id="stack" className="bg-transparent">
      <div className="w-full space-y-16">
        <div className="space-y-4 text-center">
          <h2 className="text-4xl font-bold tracking-tight uppercase sm:text-6xl">
            TECH <span className="text-[var(--color-brand-blue)]">STACK</span>
          </h2>
          <p className="mx-auto max-w-3xl text-sm leading-relaxed text-gray-400 sm:text-base">
            A focused toolkit across interface engineering, backend logic, and
            database systems. Browse the stack through a clean interactive
            carousel.
          </p>
        </div>

        <div className="px-0 sm:px-2">
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={goToPrevious}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors hover:border-[var(--color-brand-blue)] hover:text-[var(--color-brand-blue)]"
              aria-label="Previous tech"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="min-w-0 flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTech.name}
                  initial={{ opacity: 0, y: 16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -16, scale: 0.98 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="mx-auto max-w-3xl px-6 py-10 text-center sm:px-10"
                >
                  <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center text-[var(--color-brand-blue)]">
                    <activeTech.Icon className="h-12 w-12" />
                  </div>

                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.35em] text-[var(--color-brand-blue)]">
                    {activeTech.category}
                  </p>
                  <h3 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
                    {activeTech.name}
                  </h3>
                  <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-gray-400 sm:text-base">
                    {activeTech.note}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <button
              type="button"
              onClick={goToNext}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors hover:border-[var(--color-brand-blue)] hover:text-[var(--color-brand-blue)]"
              aria-label="Next tech"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {techStack.map((tech, idx) => {
              const isActive = idx === activeIndex;

              return (
                <motion.button
                  key={tech.name}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "border-[var(--color-brand-blue)] bg-[var(--color-brand-blue)]/10 text-white"
                      : "border-white/10 bg-white/[0.03] text-gray-400 hover:border-white/20 hover:text-white"
                  }`}
                >
                  <tech.Icon className="h-4 w-4" />
                  <span>{tech.name}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </Section>
  );
}
