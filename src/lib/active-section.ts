"use client";

import { useSyncExternalStore } from "react";
import { sections, type SectionId } from "./site";

// One IntersectionObserver shared by every nav that highlights the current
// section. The old approach re-measured every section's offsetTop on each
// scroll event, which forced layout in the middle of scrolling.
let active: SectionId = sections[0].id;
const listeners = new Set<() => void>();
let observer: IntersectionObserver | null = null;

function start() {
  const crossing = new Set<string>();

  // A thin band just above the middle of the viewport: whichever section
  // occupies it is the one being read.
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          crossing.add(entry.target.id);
        } else {
          crossing.delete(entry.target.id);
        }
      }

      for (let index = sections.length - 1; index >= 0; index--) {
        const id = sections[index].id;
        if (crossing.has(id)) {
          if (id !== active) {
            active = id;
            listeners.forEach((listener) => listener());
          }
          return;
        }
      }
    },
    { rootMargin: "-40% 0px -55% 0px" },
  );

  for (const section of sections) {
    const element = document.getElementById(section.id);
    if (element) {
      observer.observe(element);
    }
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!observer) {
    start();
  }

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      observer?.disconnect();
      observer = null;
    }
  };
}

export function useActiveSection() {
  return useSyncExternalStore(
    subscribe,
    () => active,
    () => sections[0].id,
  );
}

export function scrollToSection(id: string) {
  const element = document.getElementById(id);
  if (!element) {
    return;
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Sections carry scroll-margin-top, so the fixed navbar never covers a heading.
  element.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
}
