"use client";

import { Section } from "./Section";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import {
  ArrowUpRight,
  Bug,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  MonitorSmartphone,
  ShoppingCart,
  Store,
  WalletCards,
} from "lucide-react";
import { useEffect, useState } from "react";

const projects = [
  {
    title: "Human Resources Information System",
    desc: "An attendance management web app with reporting, employee management, terminal tools, and settings.",
    role: "Developer",
    link: "https://j-attendance-tracker.vercel.app/",
    thumbnail: "/AttendanceTrackerThumbnail.png",
    icon: MonitorSmartphone,
  },
  {
    title: "MasterCraft Bug Hunter",
    desc: "A bug reporting platform built for clean issue tracking, organized triage, and reward-based bug submissions.",
    role: "Developer",
    link: "https://mcbughunter.vercel.app/",
    thumbnail: "/MastercraftBughunterThumbnail.png",
    icon: Bug,
  },
  {
    title: "VertixHub",
    desc: "A premium computer hardware e-commerce platform built for browsing products, custom PC building, and a modern shopping experience.",
    role: "Developer",
    link: "https://vertixhub.vercel.app/home",
    thumbnail: "/VertixHubThumbnail.png",
    icon: ShoppingCart,
  },
  {
    title: "DENR Cashflow System",
    desc: "A secure cashflow tracking and reporting system designed for streamlined financial monitoring.",
    role: "Developer",
    link: "https://denr-cashflow-system.vercel.app/login",
    thumbnail: "/CashflowSystemThumbnail.png",
    icon: WalletCards,
  },
  {
    title: "DENR Reservation System",
    desc: "A dedicated reservation management system built for DENR Baguio.",
    role: "Developer / Database Engineer",
    link: "https://denr-car-reservation.vercel.app/",
    thumbnail: "/ReservationSystemThumbnail.png",
    icon: CalendarDays,
  },
  {
    title: "Ken-dal Store POS",
    desc: "A point of sale system built for store management, inventory control, sales tracking, and secure access.",
    role: "Developer",
    link: "https://kendal-store.vercel.app/#/login",
    thumbnail: "/KendalStoreThumbnail.png",
    icon: Store,
  },
];

export function Works() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [railStartIndex, setRailStartIndex] = useState(0);

  const activeProject = projects[activeIndex];
  const ActiveProjectIcon = activeProject.icon;
  const totalProjects = String(projects.length).padStart(2, "0");
  const visibleCount = Math.min(4, projects.length);

  const getVisibleIndices = (startIndex: number) =>
    Array.from(
      { length: visibleCount },
      (_, offset) => (startIndex + offset) % projects.length,
    );

  const getNextRailStart = (
    currentStart: number,
    nextIndex: number,
    direction: 1 | -1,
  ) => {
    if (projects.length <= visibleCount) {
      return 0;
    }

    const visibleIndices = getVisibleIndices(currentStart);
    if (visibleIndices.includes(nextIndex)) {
      return currentStart;
    }

    return direction === 1
      ? (currentStart + 1) % projects.length
      : (currentStart - 1 + projects.length) % projects.length;
  };

  const visibleProjects = getVisibleIndices(railStartIndex).map((index) => ({
    index,
    project: projects[index],
  }));

  const goToPrevious = () => {
    setActiveIndex((current) =>
      {
        const nextIndex = current === 0 ? projects.length - 1 : current - 1;
        setRailStartIndex((currentStart) =>
          getNextRailStart(currentStart, nextIndex, -1),
        );
        return nextIndex;
      },
    );
  };

  const goToNext = () => {
    setActiveIndex((current) =>
      {
        const nextIndex = current === projects.length - 1 ? 0 : current + 1;
        setRailStartIndex((currentStart) =>
          getNextRailStart(currentStart, nextIndex, 1),
        );
        return nextIndex;
      },
    );
  };

  const scrollRail = (direction: 1 | -1) => {
    if (projects.length <= visibleCount) {
      return;
    }

    setRailStartIndex((current) => {
      const nextStart =
        direction === 1
          ? (current + 1) % projects.length
          : (current - 1 + projects.length) % projects.length;

      setActiveIndex(nextStart);
      return nextStart;
    });
  };

  const selectProject = (index: number) => {
    setActiveIndex(index);
    setRailStartIndex((currentStart) => {
      const visibleIndices = getVisibleIndices(currentStart);
      return visibleIndices.includes(index) ? currentStart : index;
    });
  };

  useEffect(() => {
    if (projects.length <= visibleCount) {
      return;
    }

    const intervalId = window.setInterval(() => {
      scrollRail(1);
    }, 15000);

    return () => window.clearInterval(intervalId);
  }, [visibleCount]);

  return (
    <Section id="works" className="bg-transparent">
      <div className="space-y-16">
        <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-center uppercase">
          MY <span className="text-[var(--color-brand-blue)]">WORKS</span>
        </h2>

        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[var(--color-brand-blue)]">
              Project Browser
            </p>
            <p className="max-w-2xl text-sm leading-relaxed text-gray-400 sm:text-base">
              Browse through featured builds with a focused preview experience
              instead of a standard grid.
            </p>
          </div>

          <div className="flex items-center justify-between gap-4 sm:justify-end">
            <div className="text-sm font-bold tracking-[0.3em] text-gray-500">
              {String(activeIndex + 1).padStart(2, "0")} / {totalProjects}
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={goToPrevious}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors hover:border-[var(--color-brand-blue)] hover:text-[var(--color-brand-blue)]"
                aria-label="Previous project"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={goToNext}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors hover:border-[var(--color-brand-blue)] hover:text-[var(--color-brand-blue)]"
                aria-label="Next project"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
          <div className="space-y-3">
            {projects.length > visibleCount ? (
              <button
                type="button"
                onClick={() => scrollRail(-1)}
                className="flex h-11 w-full items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-gray-400 transition-colors hover:border-[var(--color-brand-blue)] hover:text-[var(--color-brand-blue)]"
                aria-label="Scroll project carousel up"
              >
                <ChevronUp className="h-5 w-5" />
              </button>
            ) : null}

            <div className="overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={railStartIndex}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="space-y-3"
                >
                  {visibleProjects.map(({ project: proj, index: idx }) => {
                    const isActive = idx === activeIndex;
                    const ProjectIcon = proj.icon;

                    return (
                      <motion.button
                        key={`${proj.title}-${idx}`}
                        type="button"
                        onClick={() => selectProject(idx)}
                        whileHover={{ x: 6 }}
                        className={`w-full rounded-2xl border p-4 text-left transition-all duration-300 ${
                          isActive
                            ? "border-[var(--color-brand-blue)] bg-[var(--color-brand-blue)]/10 shadow-[0_0_30px_rgba(0,168,255,0.15)]"
                            : "border-white/10 bg-white/[0.03] hover:border-white/20"
                        }`}
                        aria-pressed={isActive}
                      >
                        <div className="mb-4 flex items-start justify-between gap-4">
                          <div>
                            <p className="text-xs font-bold tracking-[0.3em] text-gray-500">
                              {String(idx + 1).padStart(2, "0")}
                            </p>
                            <h3 className="mt-2 text-lg font-semibold text-white">
                              {proj.title}
                            </h3>
                          </div>
                          <ProjectIcon className="h-6 w-6 text-[var(--color-brand-blue)]" />
                        </div>
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-brand-blue)]">
                          {proj.role}
                        </p>
                      </motion.button>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>

            {projects.length > visibleCount ? (
              <button
                type="button"
                onClick={() => scrollRail(1)}
                className="flex h-11 w-full items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-gray-400 transition-colors hover:border-[var(--color-brand-blue)] hover:text-[var(--color-brand-blue)]"
                aria-label="Scroll project carousel down"
              >
                <ChevronDown className="h-5 w-5" />
              </button>
            ) : null}
          </div>

          <div className="min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProject.title}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#06111d]/90"
              >
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-6">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-400/80" />
                    <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
                    <span className="h-3 w-3 rounded-full bg-green-400/80" />
                  </div>
                  <p className="max-w-[60%] truncate text-xs font-medium tracking-[0.2em] text-gray-500 uppercase">
                    {activeProject.link.replace(/^https?:\/\//, "")}
                  </p>
                </div>

                <div className="grid xl:min-h-[520px] xl:grid-cols-[minmax(0,1.5fr)_340px]">
                  <div className="relative h-[320px] overflow-hidden sm:h-[400px] xl:h-full">
                    {"thumbnail" in activeProject ? (
                      <Image
                        src={activeProject.thumbnail}
                        alt={`${activeProject.title} homepage preview`}
                        fill
                        sizes="(max-width: 1280px) 100vw, 70vw"
                        className="scale-[1.02] object-cover object-center"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-900 text-8xl">
                        <ActiveProjectIcon className="h-24 w-24 text-[var(--color-brand-blue)]" />
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#06111d] to-transparent" />
                  </div>

                  <div className="flex flex-col justify-between gap-8 border-t border-white/10 p-5 sm:p-6 xl:border-l xl:border-t-0">
                    <div className="space-y-5">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full border border-[var(--color-brand-blue)]/40 bg-[var(--color-brand-blue)]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-[var(--color-brand-blue)]">
                          {activeProject.role}
                        </span>
                        <span className="text-sm font-medium tracking-[0.2em] text-gray-500 uppercase">
                          Featured Build
                        </span>
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                          {activeProject.title}
                        </h3>
                        <p className="text-base leading-relaxed text-gray-400">
                          {activeProject.desc}
                        </p>
                      </div>

                      <div className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500">
                          Experience
                        </p>
                        <p className="text-sm leading-relaxed text-gray-400">
                          Browse four projects at a time through the vertical
                          carousel, then let it auto-cycle or move through the
                          rest manually for a focused preview experience.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <a
                        href={activeProject.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-brand-blue)] px-6 py-3 text-sm font-bold uppercase tracking-[0.2em] text-black transition-transform duration-300 hover:scale-[1.02]"
                      >
                        Open Project
                        <ArrowUpRight className="h-4 w-4" />
                      </a>

                      <div className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500">
                        {String(activeIndex + 1).padStart(2, "0")} of{" "}
                        {totalProjects}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Section>
  );
}
