"use client";

import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { LivePreview } from "./LivePreview";
import { hostOf, type Project } from "@/lib/projects";

/**
 * Touch-first project browser: one full card per project in a native
 * scroll-snap deck, swiped like any phone carousel. Only the centred card runs
 * a live preview (rendered at phone width, so the site's own mobile layout
 * shows at a readable size); the rest show a poster, so swiping never stacks
 * up a dozen live sites in memory.
 */
export function MobileWorks({
  projects,
  activeIndex,
  onActiveChange,
  resetKey,
}: {
  projects: Project[];
  activeIndex: number;
  onActiveChange: (index: number) => void;
  // Changes when the project list is swapped (tab change), to rewind the deck.
  resetKey: string;
}) {
  const deckRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  // The index this deck last reported. An activeIndex that differs came from
  // outside (the command palette), so the deck scrolls to it; one that matches
  // came from a swipe and needs no scrolling.
  const reportedRef = useRef(activeIndex);

  useEffect(() => {
    const deck = deckRef.current;
    if (!deck) {
      return;
    }

    // Whichever card holds most of the deck's width is the active one.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = Number((entry.target as HTMLElement).dataset.index);
            reportedRef.current = index;
            onActiveChange(index);
          }
        }
      },
      { root: deck, threshold: 0.6 },
    );

    for (const card of cardRefs.current) {
      if (card) {
        observer.observe(card);
      }
    }

    return () => observer.disconnect();
  }, [projects, onActiveChange]);

  useEffect(() => {
    deckRef.current?.scrollTo({ left: 0, behavior: "instant" });
    reportedRef.current = 0;
  }, [resetKey]);

  useEffect(() => {
    const deck = deckRef.current;
    const card = cardRefs.current[activeIndex];
    if (!deck || !card || reportedRef.current === activeIndex) {
      return;
    }

    reportedRef.current = activeIndex;
    // scrollTo on the deck, not scrollIntoView on the card, which would also
    // yank the page vertically. Instant, because a smooth pass would briefly
    // activate (and start loading) every card on the way.
    deck.scrollTo({
      left: card.offsetLeft - (deck.clientWidth - card.clientWidth) / 2,
      behavior: "instant",
    });
  }, [activeIndex]);

  const total = String(projects.length).padStart(2, "0");

  return (
    <div className="space-y-5">
      <div
        ref={deckRef}
        aria-label="Projects"
        className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-4 pb-1 [scrollbar-width:none] sm:-mx-6 sm:px-6 [&::-webkit-scrollbar]:hidden"
      >
        {projects.map((project, index) => {
          const isActive = index === activeIndex;
          const Icon = project.icon;

          return (
            <article
              key={project.title}
              ref={(element) => {
                cardRefs.current[index] = element;
              }}
              data-index={index}
              aria-label={`${project.title}, ${index + 1} of ${projects.length}`}
              className={`flex w-[86%] shrink-0 snap-center flex-col overflow-hidden rounded-[1.6rem] border bg-[#06111d] transition-[border-color,box-shadow] duration-300 sm:w-[58%] md:w-[46%] ${
                isActive
                  ? "border-[var(--color-brand-blue)]/45 shadow-[0_0_30px_rgba(0,168,255,0.12)]"
                  : "border-white/10"
              }`}
            >
              <div className="relative h-[280px] overflow-hidden bg-[#05101b] sm:h-[320px]">
                {isActive ? (
                  <LivePreview
                    key={project.link}
                    url={project.previewUrl ?? project.link}
                    title={project.title}
                    icon={Icon}
                    embedHosts={project.embedHosts}
                    probe={!project.sameOriginResources}
                    viewport="mobile"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_50%_45%,rgba(0,168,255,0.14),transparent_65%)]">
                    <Icon className="h-12 w-12 text-[var(--color-brand-blue)]/60" />
                  </div>
                )}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#06111d] to-transparent" />
                <span className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/60 px-3 py-1.5 font-mono text-[10px] font-bold tracking-[0.2em] text-white backdrop-blur-md">
                  {String(index + 1).padStart(2, "0")} / {total}
                </span>
              </div>

              <div className="flex flex-1 flex-col gap-3 p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-brand-blue)]">
                  {project.role}
                </p>
                <h3 className="text-xl font-bold leading-tight tracking-tight text-white">
                  {project.title}
                </h3>
                <p className="line-clamp-3 text-sm leading-relaxed text-gray-400">
                  {project.desc}
                </p>

                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={isActive ? undefined : -1}
                  aria-label={`Open ${project.title} at ${hostOf(project.link)} (new tab)`}
                  className="mt-auto inline-flex h-12 items-center justify-between rounded-full bg-[var(--color-brand-blue)] pl-5 pr-4 text-xs font-bold uppercase tracking-[0.16em] text-black active:scale-[0.98]"
                >
                  <span>Open project</span>
                  <ArrowUpRight className="h-4 w-4 shrink-0" />
                </a>
              </div>
            </article>
          );
        })}
      </div>

      {/* Position indicator: a track with the active segment, which stays
          legible for a dozen items where dots would turn into noise. */}
      <div className="flex items-center gap-4" aria-hidden="true">
        <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-white/10">
          <div
            className="absolute inset-y-0 rounded-full bg-[var(--color-brand-blue)] transition-[left] duration-300 ease-out"
            style={{
              width: `${100 / projects.length}%`,
              left: `${(activeIndex / projects.length) * 100}%`,
            }}
          />
        </div>
        <span className="font-mono text-[11px] font-bold tracking-[0.2em] text-gray-400">
          {String(activeIndex + 1).padStart(2, "0")} / {total}
        </span>
      </div>
    </div>
  );
}
