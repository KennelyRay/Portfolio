"use client";

import { Section } from "./Section";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { AppEmulator, DemoLogin, EmulatorPoster } from "./AppEmulator";
import { LivePreview } from "./LivePreview";
import { MobileWorks } from "./MobileWorks";
import {
  ArrowUpRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Folder,
  FolderOpen,
} from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { allProjects, featuredProjects, hostOf } from "@/lib/projects";
import { isTypingTarget, SELECT_PROJECT_EVENT } from "@/lib/ui-events";

const AUTO_ADVANCE_MS = 15000;

const worksTabs = [
  { id: "featured", label: "Featured Works" },
  { id: "all", label: "All Projects" },
] as const;

type WorksTab = (typeof worksTabs)[number]["id"];

// Manila-folder tab: square left edge, angled right edge.
const FOLDER_TAB_CLIP = "polygon(0 0, calc(100% - 34px) 0, 100% 100%, 0 100%)";
// Back cover peeking above the panel, mirrored so it angles the other way.
const FOLDER_BACK_CLIP = "polygon(0 0, 100% 0, 100% 100%, 0 100%)";

/**
 * A clip-path can't render a border, so the outline is faked with two stacked
 * layers: a border-coloured plate and a fill inset by 1px on the sides. The
 * fill also bleeds 1px past the bottom to cover the panel's top border, which
 * makes the tab and the panel read as one continuous folder edge.
 */
function FolderTab({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`inline-flex ${className}`}>
      <div
        className="absolute inset-0 bg-[var(--color-brand-blue)]/55"
        style={{ clipPath: FOLDER_TAB_CLIP }}
      />
      <div
        className="absolute -bottom-px left-px right-px top-px bg-[linear-gradient(180deg,rgba(0,168,255,0.30),rgba(0,168,255,0.12))]"
        style={{ clipPath: FOLDER_TAB_CLIP }}
      />
      <div className="relative flex items-center gap-2.5 py-3.5 pl-6 pr-14">
        {children}
      </div>
    </div>
  );
}

/**
 * The folder's back cover: a tinted strip sitting behind and above the preview
 * panel, so the panel reads as the front flap tucked inside it.
 */
function FolderBack({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none ${className}`}>
      <div
        className="absolute inset-0 rounded-t-[1.75rem] rounded-tl-none bg-[var(--color-brand-blue)]/40"
        style={{ clipPath: FOLDER_BACK_CLIP }}
      />
      <div className="absolute inset-x-px top-px bottom-0 rounded-t-[1.7rem] rounded-tl-none bg-[linear-gradient(180deg,rgba(0,168,255,0.16),rgba(6,17,29,0.95))]" />
    </div>
  );
}

/**
 * Fills over the auto-advance interval so the browser moving on by itself
 * never comes as a surprise. Keyed by cycle so it restarts with the timer, and
 * empty while paused.
 */
function AutoAdvanceBar({ cycle, paused }: { cycle: number; paused: boolean }) {
  return (
    <div aria-hidden="true" className="absolute inset-x-0 -bottom-px h-px overflow-hidden">
      {paused ? null : (
        <div
          key={cycle}
          className="h-full origin-left bg-[var(--color-brand-blue)]/80"
          style={{ animation: `progress-fill ${AUTO_ADVANCE_MS}ms linear forwards` }}
        />
      )}
    </div>
  );
}

export function Works() {
  const [activeTab, setActiveTab] = useState<WorksTab>("featured");
  const [activeIndex, setActiveIndex] = useState(0);
  const [railStartIndex, setRailStartIndex] = useState(0);
  const [autoAdvanceCycle, setAutoAdvanceCycle] = useState(0);
  const [hovered, setHovered] = useState(false);
  // Title of the emulator the visitor clicked into. Advancing past it would
  // end their session, so the carousel holds while it stays on screen.
  const [engagedTitle, setEngagedTitle] = useState<string | null>(null);
  const browserRef = useRef<HTMLDivElement>(null);
  const inView = useInView(browserRef, { amount: 0.25 });

  // Auto-advance swaps the live preview, which loads a whole site. Don't do
  // that while nobody is looking, or while someone is reading a card. The ref
  // sits on the desktop browser, which is display:none below xl, so phones
  // (where the deck is swiped by hand) never auto-advance.
  const projects = activeTab === "featured" ? featuredProjects : allProjects;
  const activeProject = projects[activeIndex];
  const paused = hovered || !inView || engagedTitle === activeProject.title;
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
      ? nextIndex % projects.length
      : (nextIndex - (visibleCount - 1) + projects.length) % projects.length;
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
    if (projects.length <= 1) {
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

  const selectTab = (tab: WorksTab) => {
    if (tab === activeTab) {
      return;
    }

    resetAutoAdvanceTimer();
    setActiveTab(tab);
    setActiveIndex(0);
    setRailStartIndex(0);
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
    if (projects.length <= 1 || paused) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      scrollRail(1);
      setAutoAdvanceCycle((current) => current + 1);
    }, AUTO_ADVANCE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [autoAdvanceCycle, projects.length, paused]);

  // Left/right arrows flip through projects while the browser is on screen.
  useEffect(() => {
    if (!inView) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        isTypingTarget(event.target)
      ) {
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        goToNext();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        goToPrevious();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  // The command palette can ask for any project by title.
  useEffect(() => {
    const onSelect = (event: Event) => {
      const title = (event as CustomEvent<string>).detail;
      const index = allProjects.findIndex((project) => project.title === title);
      if (index === -1) {
        return;
      }

      resetAutoAdvanceTimer();
      setActiveTab("all");
      setActiveIndex(index);
      setRailStartIndex(index);
    };

    window.addEventListener(SELECT_PROJECT_EVENT, onSelect);
    return () => window.removeEventListener(SELECT_PROJECT_EVENT, onSelect);
  }, []);

  return (
    <Section id="works" className="bg-transparent">
      <div className="space-y-6 sm:space-y-12 xl:space-y-16">
        <h2 className="text-4xl font-bold tracking-tight uppercase sm:text-center sm:text-6xl">
          MY <span className="text-[var(--color-brand-blue)]">WORKS</span>
        </h2>

        <div className="flex sm:justify-center">
          <div
            role="tablist"
            aria-label="Project categories"
            className="grid w-full grid-cols-2 items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1.5 sm:inline-flex sm:w-auto"
          >
            {worksTabs.map((tab) => {
              const isActiveTab = tab.id === activeTab;

              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActiveTab}
                  onClick={() => selectTab(tab.id)}
                  className={`h-11 rounded-full px-4 text-[11px] font-bold uppercase tracking-[0.18em] transition-colors sm:h-auto sm:px-6 sm:py-2.5 sm:text-xs sm:tracking-[0.2em] ${
                    isActiveTab
                      ? "bg-[var(--color-brand-blue)] text-black"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-2 flex flex-col gap-4 xl:mb-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[var(--color-brand-blue)]">
              Project Browser
            </p>
            <p className="max-w-2xl text-sm leading-relaxed text-gray-400 sm:text-base">
              Browse through the projects I have worked on before! Get a feel of what I can do through these previous works.
              <span className="xl:hidden"> Swipe through the cards to explore.</span>
            </p>
          </div>

          <div className="hidden items-center justify-between gap-4 sm:justify-end xl:flex">
            <p className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
              <kbd className="rounded-md border border-white/15 bg-white/[0.04] px-1.5 py-0.5 text-gray-300">←</kbd>
              <kbd className="rounded-md border border-white/15 bg-white/[0.04] px-1.5 py-0.5 text-gray-300">→</kbd>
              to browse
            </p>
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
          <MobileWorks
            projects={projects}
            activeIndex={activeIndex}
            onActiveChange={setActiveIndex}
            resetKey={activeTab}
          />
        </div>

        <div
          ref={browserRef}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="hidden items-stretch gap-6 xl:grid xl:grid-cols-[300px_minmax(0,1fr)]"
        >
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
                  key={`${activeTab}-${railStartIndex}`}
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
                        className={`relative flex min-h-[148px] w-full flex-col items-center justify-center overflow-hidden rounded-[1.65rem] border px-4 pb-5 pt-5 text-center transition-[border-color,background-color,box-shadow] duration-300 ${
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

          <div className="relative min-w-0 pt-[70px]">
            <FolderBack className="absolute inset-x-0 top-[46px] h-[70px]" />
            <FolderTab className="absolute left-0 top-0 z-20">
              <FolderOpen className="h-[18px] w-[18px] text-white" />
              <span className="text-xs font-bold uppercase tracking-[0.28em] text-white">
                Project {String(activeIndex + 1).padStart(2, "0")}
              </span>
            </FolderTab>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeProject.title}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="relative z-10 h-full overflow-hidden rounded-[2rem] border border-white/10 bg-[#06111d]"
              >
                <div className="relative flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-6">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-400/80" />
                    <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
                    <span className="h-3 w-3 rounded-full bg-green-400/80" />
                  </div>
                  <p className="max-w-[60%] truncate text-xs font-medium tracking-[0.2em] text-gray-500 uppercase">
                    {hostOf(activeProject.link)}
                  </p>
                  <AutoAdvanceBar cycle={autoAdvanceCycle} paused={paused} />
                </div>

                <div className="grid xl:grid-cols-[minmax(0,1.5fr)_340px]">
                  <div className="relative h-[320px] overflow-hidden bg-[#05101b] sm:h-[400px] xl:h-[520px]">
                    {activeProject.emulator?.inline ? (
                      <AppEmulator
                        key={activeProject.link}
                        url={activeProject.link}
                        title={activeProject.title}
                        onEngage={() => setEngagedTitle(activeProject.title)}
                      />
                    ) : activeProject.emulator ? (
                      <EmulatorPoster />
                    ) : (
                      <>
                        <LivePreview
                          key={activeProject.link}
                          url={activeProject.previewUrl ?? activeProject.link}
                          title={activeProject.title}
                          icon={ActiveProjectIcon}
                          embedHosts={activeProject.embedHosts}
                          probe={!activeProject.sameOriginResources}
                        />
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#06111d] to-transparent" />
                      </>
                    )}
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
                        {activeProject.demoLogin ? (
                          <DemoLogin login={activeProject.demoLogin} />
                        ) : null}
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
