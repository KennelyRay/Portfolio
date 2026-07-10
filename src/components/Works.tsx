"use client";

import { Section } from "./Section";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import {
  ArrowUpRight,
  Bug,
  Bus,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Folder,
  FolderOpen,
  MessageSquareText,
  MonitorSmartphone,
  Plane,
  ShoppingCart,
  Store,
  WalletCards,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const projects = [
  {
    title: "Human Resources Information System",
    desc: "An attendance management web app with reporting, employee management, terminal tools, and settings.",
    role: "Developer/DB Engineer",
    link: "https://j-attendance-tracker.vercel.app/",
    thumbnail: "/AttendanceTrackerThumbnail.png",
    icon: MonitorSmartphone,
  },
  {
    title: "MasterCraft Bug Hunter",
    desc: "A bug reporting platform built for clean issue tracking, organized triage, and reward-based bug submissions.",
    role: "Developer/DB Engineer",
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
    title: "VertixFlights",
    desc: "A flight booking platform built for searching flights, booking airline tickets, and a smooth travel reservation experience.",
    role: "Developer/DB Engineer",
    link: "https://vertix-flights.vercel.app",
    thumbnail: "/VertixFlightsThumbnail.png",
    icon: Plane,
  },
  {
    title: "DENR Cashflow System",
    desc: "A secure cashflow tracking and reporting system designed for streamlined financial monitoring.",
    role: "Developer/DB Engineer",
    link: "https://denr-cashflow-system.vercel.app/login",
    thumbnail: "/CashflowSystemThumbnail.png",
    icon: WalletCards,
  },
  {
    title: "DENR Reservation System",
    desc: "A dedicated reservation management system built for DENR Baguio.",
    role: "Developer/DB Engineer",
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
  {
    title: "AgLugan",
    desc: "A jeepney seat reservation platform with live queues, guaranteed seats, and cashless payments for commuters on the Bakakeng route.",
    role: "Lead Developer",
    link: "https://aglugan.vercel.app/",
    thumbnail: "/AgluganThumbnail.png",
    icon: Bus,
  },
  {
    title: "Navibot",
    desc: "An academic capstone enrollment chatbot built to guide students through enrollment questions and portal-related assistance.",
    role: "Academic Capstone",
    link: "https://tektitans-navibot.vercel.app/",
    thumbnail: "/NavibotThumbnail.png",
    icon: MessageSquareText,
  },
];

export function Works() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [railStartIndex, setRailStartIndex] = useState(0);
  const [autoAdvanceCycle, setAutoAdvanceCycle] = useState(0);
  const mobileProjectButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const mobileProjectRailRef = useRef<HTMLDivElement | null>(null);

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

  const resetAutoAdvanceTimer = () => {
    setAutoAdvanceCycle((current) => current + 1);
  };

  const goToPrevious = () => {
    resetAutoAdvanceTimer();
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
    resetAutoAdvanceTimer();
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

  const scrollRail = (direction: 1 | -1, shouldResetTimer = false) => {
    if (projects.length <= visibleCount) {
      return;
    }

    if (shouldResetTimer) {
      resetAutoAdvanceTimer();
    }

    setActiveIndex((currentActive) => {
      const nextIndex =
        direction === 1
          ? (currentActive + 1) % projects.length
          : (currentActive - 1 + projects.length) % projects.length;

      setRailStartIndex((currentStart) =>
        getNextRailStart(currentStart, nextIndex, direction),
      );

      return nextIndex;
    });
  };

  const selectProject = (index: number) => {
    resetAutoAdvanceTimer();
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

    const timeoutId = window.setTimeout(() => {
      scrollRail(1);
      setAutoAdvanceCycle((current) => current + 1);
    }, 15000);

    return () => window.clearTimeout(timeoutId);
  }, [autoAdvanceCycle, visibleCount]);

  useEffect(() => {
    if (window.innerWidth >= 1280) {
      return;
    }

    const activeButton = mobileProjectButtonRefs.current[activeIndex];
    const rail = mobileProjectRailRef.current;

    if (!activeButton || !rail) {
      return;
    }

    const targetLeft =
      activeButton.offsetLeft - rail.clientWidth / 2 + activeButton.clientWidth / 2;
    const maxScrollLeft = rail.scrollWidth - rail.clientWidth;
    const nextScrollLeft = Math.min(Math.max(targetLeft, 0), maxScrollLeft);

    rail.scrollTo({
      left: nextScrollLeft,
      behavior: "smooth",
    });
  }, [activeIndex]);

  return (
    <Section id="works" className="bg-transparent">
      <div className="space-y-10 sm:space-y-12 xl:space-y-16">
        <h2 className="text-center text-4xl font-bold tracking-tight uppercase sm:text-6xl">
          MY <span className="text-[var(--color-brand-blue)]">WORKS</span>
        </h2>

        <div className="mb-2 flex flex-col gap-4 xl:mb-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[var(--color-brand-blue)]">
              Project Browser
            </p>
            <p className="max-w-2xl text-sm leading-relaxed text-gray-400 sm:text-base">
              Browse through the projects I have worked on before! Get a feel of what I can do through these previous works.
            </p>
          </div>

          <div className="hidden items-center justify-between gap-4 sm:justify-end xl:flex">
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

        <div className="xl:hidden">
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500">
                  Active Project
                </p>
                <p className="mt-2 text-sm font-bold tracking-[0.26em] text-[var(--color-brand-blue)]">
                  {String(activeIndex + 1).padStart(2, "0")} / {totalProjects}
                </p>
              </div>

              <div className="flex items-center gap-2">
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

            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeProject.title}-mobile`}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#06111d]/90"
              >
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-400/80" />
                    <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
                    <span className="h-3 w-3 rounded-full bg-green-400/80" />
                  </div>
                  <p className="max-w-[58%] truncate text-[10px] font-medium uppercase tracking-[0.18em] text-gray-500 sm:text-xs">
                    {activeProject.link.replace(/^https?:\/\//, "")}
                  </p>
                </div>

                <div className="relative h-[240px] overflow-hidden bg-[#05101b] sm:h-[320px]">
                  {"thumbnail" in activeProject ? (
                    <Image
                      src={activeProject.thumbnail}
                      alt={`${activeProject.title} homepage preview`}
                      fill
                      sizes="100vw"
                      className="h-full w-full object-cover object-center"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-900">
                      <ActiveProjectIcon className="h-20 w-20 text-[var(--color-brand-blue)]" />
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#06111d] to-transparent" />
                </div>

                <div className="space-y-5 p-4 sm:p-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full border border-[var(--color-brand-blue)]/40 bg-[var(--color-brand-blue)]/10 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-brand-blue)] sm:px-4 sm:text-xs">
                      {activeProject.role}
                    </span>
                    <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-gray-500 sm:text-xs">
                      Mobile Spotlight
                    </span>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl">
                      {activeProject.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-gray-400 sm:text-[15px]">
                      {activeProject.desc}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <a
                      href={activeProject.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-brand-blue)] px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-black transition-transform duration-300 hover:scale-[1.02]"
                    >
                      Open Project
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                    <div className="text-xs font-bold uppercase tracking-[0.28em] text-gray-500">
                      Featured Build
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500">
                  Browse Projects
                </p>
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-gray-500">
                  Swipe or tap
                </p>
              </div>

              <div
                ref={mobileProjectRailRef}
                className="-mx-4 overflow-x-auto px-4 pb-2 overscroll-x-contain sm:-mx-6 sm:px-6"
              >
                <div className="flex snap-x snap-mandatory gap-3">
                {projects.map((proj, idx) => {
                  const isActive = idx === activeIndex;
                  const ProjectIcon = proj.icon;
                  const FolderIcon = isActive ? FolderOpen : Folder;

                  return (
                    <motion.button
                      key={`${proj.title}-mobile-card`}
                      type="button"
                      ref={(element) => {
                        mobileProjectButtonRefs.current[idx] = element;
                      }}
                      onClick={() => selectProject(idx)}
                      whileTap={{ scale: 0.98 }}
                      className={`relative min-h-[164px] w-[220px] shrink-0 snap-center overflow-hidden rounded-[1.4rem] border px-4 pb-4 pt-5 text-left transition-all duration-300 sm:w-[250px] ${
                        isActive
                          ? "border-[var(--color-brand-blue)] bg-[linear-gradient(180deg,rgba(0,168,255,0.16),rgba(7,23,38,0.92))] shadow-[0_0_24px_rgba(0,168,255,0.12)]"
                          : "border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(6,14,22,0.92))] hover:border-white/20"
                      }`}
                      aria-pressed={isActive}
                    >
                      <div
                        className={`absolute left-4 top-0 h-4 w-20 rounded-b-[0.95rem] border-x border-b ${
                          isActive
                            ? "border-[var(--color-brand-blue)]/45 bg-[var(--color-brand-blue)]/14"
                            : "border-white/10 bg-white/[0.04]"
                        }`}
                      />
                      <div className="mb-3 flex items-start justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <FolderIcon className="h-4 w-4 text-[var(--color-brand-blue)]" />
                          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-gray-500">
                            Folder
                          </p>
                        </div>
                        <ProjectIcon className="h-5 w-5 text-[var(--color-brand-blue)]" />
                      </div>
                      <p className="text-xs font-bold tracking-[0.28em] text-gray-500">
                        {String(idx + 1).padStart(2, "0")}
                      </p>
                      <h3 className="text-base font-semibold leading-snug text-white">
                        {proj.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-gray-400">
                        {proj.desc}
                      </p>
                      <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-brand-blue)]">
                        {proj.role}
                      </p>
                    </motion.button>
                  );
                })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden items-stretch gap-6 xl:grid xl:grid-cols-[300px_minmax(0,1fr)]">
          <div className="flex flex-col gap-3 lg:min-h-[620px]">
            {projects.length > visibleCount ? (
              <button
                type="button"
                onClick={() => scrollRail(-1, true)}
                className="flex h-11 w-full items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-gray-400 transition-colors hover:border-[var(--color-brand-blue)] hover:text-[var(--color-brand-blue)]"
                aria-label="Scroll project carousel up"
              >
                <ChevronUp className="h-5 w-5" />
              </button>
            ) : null}

            <div className="flex-1 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={railStartIndex}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="grid h-full grid-cols-2 content-center gap-3"
                >
                  {visibleProjects.map(({ project: proj, index: idx }) => {
                    const isActive = idx === activeIndex;
                    const ProjectIcon = proj.icon;
                    const FolderIcon = isActive ? FolderOpen : Folder;

                    return (
                      <motion.button
                        key={`${proj.title}-${idx}`}
                        type="button"
                        onClick={() => selectProject(idx)}
                        whileHover={{ y: -5, scale: 1.02 }}
                        className={`relative flex min-h-[148px] w-full flex-col items-center justify-center overflow-hidden rounded-[1.65rem] border px-4 pb-5 pt-5 text-center transition-all duration-300 ${
                          isActive
                            ? "border-[var(--color-brand-blue)] bg-[linear-gradient(180deg,rgba(0,168,255,0.16),rgba(7,23,38,0.92))] shadow-[0_0_30px_rgba(0,168,255,0.15)]"
                            : "border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(6,14,22,0.9))] hover:border-white/20"
                        }`}
                        aria-pressed={isActive}
                      >
                        <div className="absolute left-4 top-4 text-[10px] font-bold tracking-[0.28em] text-gray-500">
                          {String(idx + 1).padStart(2, "0")}
                        </div>
                        <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/25">
                          <ProjectIcon className="h-4 w-4 text-[var(--color-brand-blue)]" />
                        </div>
                        <FolderIcon className="h-11 w-11 text-[var(--color-brand-blue)]" />
                        <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.24em] text-gray-500">
                          Folder
                        </p>
                        <h3 className="mt-2 line-clamp-2 text-sm font-semibold leading-snug text-white">
                          {proj.title}
                        </h3>
                        <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-brand-blue)]">
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
                onClick={() => scrollRail(1, true)}
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
                className="h-full overflow-hidden rounded-[2rem] border border-white/10 bg-[#06111d]/90"
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

                <div className="grid xl:grid-cols-[minmax(0,1.5fr)_340px]">
                  <div className="relative h-[320px] overflow-hidden bg-[#05101b] sm:h-[400px] xl:h-[520px]">
                    {"thumbnail" in activeProject ? (
                      <Image
                        src={activeProject.thumbnail}
                        alt={`${activeProject.title} homepage preview`}
                        fill
                        sizes="(max-width: 1280px) 100vw, 70vw"
                        className="h-full w-full object-cover object-center"
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
                        <h3 className="text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl xl:text-[2rem]">
                          {activeProject.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-gray-400 sm:text-[15px]">
                          {activeProject.desc}
                        </p>
                      </div>

                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <a
                        href={activeProject.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-brand-blue)] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-black transition-transform duration-300 hover:scale-[1.02]"
                      >
                        Open Project
                        <ArrowUpRight className="h-3.5 w-3.5" />
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
