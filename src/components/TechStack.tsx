"use client";

import { Section } from "./Section";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
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

export const techCount = techStack.length;

const stackGroups = ["Frontend", "Backend", "Database"].map((category) => ({
  category,
  items: techStack.filter((tech) => tech.category === category),
}));

export function TechStack() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const inView = useInView(carouselRef, { amount: 0.3 });
  const activeTech = techStack[activeIndex];
  const ActiveTechIcon = activeTech.Icon;

  // Rotate only while someone can see it, and hold still while they are
  // reading a card under the cursor. The carousel is display:none on phones,
  // so it never counts as in view there and never ticks.
  const paused = hovered || !inView;

  useEffect(() => {
    if (paused) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) =>
        current === techStack.length - 1 ? 0 : current + 1,
      );
    }, 2500);

    return () => window.clearInterval(interval);
  }, [paused]);

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
      <div className="w-full space-y-8 sm:space-y-16">
        <div className="space-y-4 sm:text-center">
          <h2 className="text-4xl font-bold tracking-tight uppercase sm:text-6xl">
            TECH <span className="text-[var(--color-brand-blue)]">STACK</span>
          </h2>
          <p className="max-w-3xl text-sm leading-relaxed text-gray-400 sm:mx-auto sm:text-base">
            A focused toolkit across interface engineering, backend logic, and
            database systems.
            <span className="hidden md:inline">
              {" "}
              Browse the stack through a clean interactive carousel.
            </span>
          </p>
        </div>

        {/* Phones: the whole stack at a glance, grouped, instead of a
            one-at-a-time carousel you have to tap through. */}
        <div className="space-y-6 md:hidden">
          {stackGroups.map(({ category, items }) => (
            <section key={category} aria-label={category}>
              <p className="mb-3 flex items-center justify-between font-mono text-[11px] font-bold uppercase tracking-[0.26em] text-[var(--color-brand-blue)]">
                {category}
                <span className="text-gray-500">
                  {String(items.length).padStart(2, "0")}
                </span>
              </p>
              <ul className="grid grid-cols-2 gap-2.5">
                {items.map((tech) => {
                  const TechIcon = tech.Icon;

                  return (
                    <li
                      key={tech.name}
                      className="flex min-h-14 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-3.5 py-3"
                    >
                      <TechIcon className="h-5 w-5 shrink-0 text-[var(--color-brand-blue)]" />
                      <span className="text-sm font-semibold leading-tight text-white">
                        {tech.name}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>

        <div
          ref={carouselRef}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="hidden px-2 md:block"
        >
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
                className="mx-auto max-w-4xl px-4 py-8 text-center sm:px-12 sm:py-14"
                >
                  <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center text-[var(--color-brand-blue)] sm:mb-8 sm:h-32 sm:w-32">
                    <ActiveTechIcon className="h-16 w-16 sm:h-20 sm:w-20" />
                  </div>

                  <p className="mb-4 text-sm font-bold uppercase tracking-[0.35em] text-[var(--color-brand-blue)]">
                    {activeTech.category}
                  </p>
                  <h3 className="text-3xl font-bold tracking-tight text-white sm:text-6xl">
                    {activeTech.name}
                  </h3>
                  <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-gray-400 sm:mt-6 sm:text-lg">
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

          <div className="mt-8 flex gap-3 overflow-x-auto pb-2 sm:mt-10 sm:flex-wrap sm:justify-center sm:gap-4 sm:overflow-visible sm:pb-0">
            {techStack.map((tech, idx) => {
              const isActive = idx === activeIndex;
              const TechIcon = tech.Icon;

              return (
                <motion.button
                  key={tech.name}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  aria-pressed={isActive}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  className={`inline-flex min-h-12 shrink-0 items-center gap-3 rounded-full border px-5 py-3 text-sm font-medium transition-[border-color,background-color,color] duration-300 sm:min-h-14 sm:px-6 sm:text-base ${
                    isActive
                      ? "border-[var(--color-brand-blue)] bg-[var(--color-brand-blue)]/10 text-white"
                      : "border-white/10 bg-white/[0.03] text-gray-400 hover:border-white/20 hover:text-white"
                  }`}
                >
                  <TechIcon className="h-5 w-5" />
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
