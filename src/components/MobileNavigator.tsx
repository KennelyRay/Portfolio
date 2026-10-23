"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { sections } from "@/lib/site";
import { scrollToSection, useActiveSection } from "@/lib/active-section";

export function MobileNavigator() {
  const activeSection = useActiveSection();
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);

  useEffect(() => {
    if (window.innerWidth >= 640) {
      return;
    }

    const activeIndex = sections.findIndex((item) => item.id === activeSection);
    const activeItem = itemRefs.current[activeIndex];

    if (!activeItem) {
      return;
    }

    activeItem.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeSection]);

  const handleNavigate = (
    event: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    event.preventDefault();
    scrollToSection(id);
  };

  return (
    <motion.nav
      aria-label="Sections"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className="fixed bottom-4 left-1/2 z-40 w-[calc(100%-1.5rem)] max-w-[520px] -translate-x-1/2 xl:hidden"
    >
      <div className="w-full rounded-[1.8rem] border border-white/10 bg-[#05070a]/88 px-2 py-2 shadow-[0_0_40px_rgba(0,168,255,0.08)] backdrop-blur-xl">
        <div className="overflow-x-auto overscroll-x-contain sm:overflow-visible">
          <div className="flex snap-x snap-mandatory gap-2 sm:grid sm:grid-cols-5 sm:gap-1">
            {sections.map((item, index) => {
            const isActive = item.id === activeSection;
            const Icon = item.Icon;

            return (
              <a
                key={item.id}
                ref={(element) => {
                  itemRefs.current[index] = element;
                }}
                href={`#${item.id}`}
                onClick={(event) => handleNavigate(event, item.id)}
                aria-current={isActive ? "true" : undefined}
                className={`flex min-h-[60px] min-w-[76px] shrink-0 snap-center flex-col items-center justify-center rounded-[1.2rem] px-3 py-2 text-center transition-colors duration-300 sm:min-w-0 ${
                  isActive
                    ? "bg-[var(--color-brand-blue)]/12 text-white shadow-[0_0_18px_rgba(0,168,255,0.14)]"
                    : "text-gray-500 hover:text-white"
                }`}
                aria-label={`Go to ${item.label}`}
              >
                <Icon
                  className={`h-4 w-4 ${
                    isActive ? "text-[var(--color-brand-blue)]" : "text-current"
                  }`}
                />
                <span className="mt-1 text-[9px] font-bold uppercase tracking-[0.16em]">
                  {item.label}
                </span>
              </a>
            );
            })}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
