"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { sections } from "@/lib/site";
import { scrollToSection, useActiveSection } from "@/lib/active-section";

/**
 * Bottom tab bar for phones and tablets: all five sections always visible in
 * equal columns (no sideways scrolling), inside the thumb zone, and clear of
 * the home indicator via the safe-area inset.
 */
export function MobileNavigator() {
  const activeSection = useActiveSection();

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
      className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] xl:hidden"
    >
      <div className="mx-auto grid max-w-[520px] grid-cols-5 gap-1 rounded-[1.6rem] border border-white/10 bg-[#05070a]/90 p-1.5 shadow-[0_-8px_40px_rgba(0,0,0,0.5),0_0_30px_rgba(0,168,255,0.08)] backdrop-blur-xl">
        {sections.map((item) => {
          const isActive = item.id === activeSection;
          const Icon = item.Icon;

          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(event) => handleNavigate(event, item.id)}
              aria-current={isActive ? "true" : undefined}
              className={cn(
                "relative flex h-14 flex-col items-center justify-center gap-1 rounded-[1.15rem] transition-colors duration-200",
                isActive ? "text-white" : "text-gray-500 active:text-gray-300",
              )}
            >
              {isActive ? (
                <motion.span
                  layoutId="tab-active"
                  transition={{ type: "spring", stiffness: 420, damping: 36 }}
                  className="absolute inset-0 rounded-[1.15rem] bg-[var(--color-brand-blue)]/14 shadow-[inset_0_0_0_1px_rgba(0,168,255,0.25)]"
                />
              ) : null}
              <Icon
                className={cn(
                  "relative h-5 w-5",
                  isActive && "text-[var(--color-brand-blue)]",
                )}
              />
              <span className="relative text-[10px] font-semibold tracking-[0.04em]">
                {item.label}
              </span>
            </a>
          );
        })}
      </div>
    </motion.nav>
  );
}
