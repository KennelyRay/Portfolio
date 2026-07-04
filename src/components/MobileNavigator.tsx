"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { BriefcaseBusiness, Home, Layers3, Mail, UserRound } from "lucide-react";

const navItems = [
  { label: "Home", href: "#home", id: "home", Icon: Home },
  { label: "Works", href: "#works", id: "works", Icon: BriefcaseBusiness },
  { label: "Stack", href: "#stack", id: "stack", Icon: Layers3 },
  { label: "About", href: "#about", id: "about", Icon: UserRound },
  { label: "Contact", href: "#contact", id: "contact", Icon: Mail },
];

export function MobileNavigator() {
  const [activeSection, setActiveSection] = useState("home");
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);

  useEffect(() => {
    const updateActiveSection = () => {
      const sectionOffsets = navItems
        .map((item) => {
          const element = document.getElementById(item.id);

          if (!element) {
            return null;
          }

          return {
            id: item.id,
            top: element.getBoundingClientRect().top,
          };
        })
        .filter((entry): entry is { id: string; top: number } => entry !== null);

      const current =
        sectionOffsets.findLast((entry) => entry.top <= 140) ?? sectionOffsets[0];

      if (current) {
        setActiveSection(current.id);
      }
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });

    return () => window.removeEventListener("scroll", updateActiveSection);
  }, []);

  useEffect(() => {
    const activeIndex = navItems.findIndex((item) => item.id === activeSection);
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className="fixed inset-x-0 bottom-4 z-40 px-3 xl:hidden"
    >
      <div className="mx-auto max-w-xl rounded-[1.8rem] border border-white/10 bg-[#05070a]/88 px-2 py-2 shadow-[0_0_40px_rgba(0,168,255,0.08)] backdrop-blur-xl">
        <div className="overflow-x-auto overscroll-x-contain">
          <div className="flex snap-x snap-mandatory gap-2">
            {navItems.map((item, index) => {
            const isActive = item.id === activeSection;
            const Icon = item.Icon;

            return (
              <a
                key={item.id}
                ref={(element) => {
                  itemRefs.current[index] = element;
                }}
                href={item.href}
                className={`flex min-h-[60px] min-w-[76px] shrink-0 snap-center flex-col items-center justify-center rounded-[1.2rem] px-3 py-2 text-center transition-colors duration-300 ${
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
    </motion.div>
  );
}
