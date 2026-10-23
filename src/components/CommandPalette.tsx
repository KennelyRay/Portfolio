"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUp,
  ArrowUpRight,
  Copy,
  CornerDownLeft,
  Mail,
  Search,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useId, useRef, useState, type ComponentType } from "react";
import { allProjects } from "@/lib/projects";
import { EMAIL, sections, socialLinks } from "@/lib/site";
import { scrollToSection } from "@/lib/active-section";
import {
  isTypingTarget,
  OPEN_PALETTE_EVENT,
  showProjectInWorks,
} from "@/lib/ui-events";

type Command = {
  id: string;
  group: "Jump to" | "Projects" | "Actions";
  label: string;
  hint?: string;
  keywords?: string;
  Icon: LucideIcon | ComponentType<{ className?: string }>;
  run: () => void | Promise<void>;
  // Commands that leave the page show an outbound arrow instead of Enter.
  external?: boolean;
};

const openExternal = (href: string) => {
  window.open(href, "_blank", "noopener,noreferrer");
};

function buildCommands(onCopied: () => void): Command[] {
  return [
    ...sections.map<Command>((section) => ({
      id: `section-${section.id}`,
      group: "Jump to",
      label: section.label,
      hint: section.navLabel,
      Icon: section.Icon,
      run: () => scrollToSection(section.id),
    })),
    ...allProjects.map<Command>((project) => ({
      id: `project-${project.title}`,
      group: "Projects",
      label: project.title,
      hint: project.role,
      keywords: project.desc,
      Icon: project.icon,
      run: () => {
        showProjectInWorks(project.title);
        scrollToSection("works");
      },
    })),
    {
      id: "copy-email",
      group: "Actions",
      label: "Copy email address",
      hint: EMAIL,
      keywords: "contact mail clipboard",
      Icon: Copy,
      run: async () => {
        await navigator.clipboard.writeText(EMAIL);
        onCopied();
      },
    },
    {
      id: "send-email",
      group: "Actions",
      label: "Send an email",
      hint: EMAIL,
      keywords: "contact mail hire",
      Icon: Mail,
      external: true,
      run: () => {
        window.location.href = `mailto:${EMAIL}`;
      },
    },
    ...socialLinks.map<Command>((social) => ({
      id: `social-${social.label}`,
      group: "Actions",
      label: `Open ${social.label}`,
      hint: social.value,
      keywords: "social profile",
      Icon: social.Icon,
      external: true,
      run: () => openExternal(social.href),
    })),
    {
      id: "top",
      group: "Actions",
      label: "Back to top",
      keywords: "scroll home start",
      Icon: ArrowUp,
      run: () => scrollToSection("home"),
    },
  ];
}

const matches = (command: Command, query: string) => {
  const haystack = `${command.label} ${command.hint ?? ""} ${command.keywords ?? ""}`.toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term));
};

/**
 * Quick navigation for the whole page: sections, every project, and contact
 * actions. Opens with Ctrl/⌘+K or "/", and from the navbar buttons.
 */
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const listboxId = useId();

  const commands = buildCommands(() => setToast("Email copied"));
  const results = query ? commands.filter((command) => matches(command, query)) : commands;
  const safeIndex = Math.min(activeIndex, Math.max(results.length - 1, 0));
  const activeCommand = results[safeIndex];

  const show = () => {
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    setQuery("");
    setActiveIndex(0);
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    // Hand focus back to whatever opened the palette.
    window.requestAnimationFrame(() => returnFocusRef.current?.focus?.());
  };

  const execute = (command: Command | undefined) => {
    if (!command) {
      return;
    }

    setOpen(false);
    // Run after the dialog has started closing, so scroll targets are not
    // fighting the body scroll lock.
    window.requestAnimationFrame(() => {
      Promise.resolve(command.run()).catch(() => setToast("That didn't work, try again"));
    });
  };

  useEffect(() => {
    const onOpen = () => show();
    const onKeyDown = (event: KeyboardEvent) => {
      const isShortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k";
      const isSlash = event.key === "/" && !isTypingTarget(event.target);

      if (isShortcut || (isSlash && !open)) {
        event.preventDefault();
        if (open) {
          close();
        } else {
          show();
        }
      }
    };

    window.addEventListener(OPEN_PALETTE_EVENT, onOpen);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener(OPEN_PALETTE_EVENT, onOpen);
      window.removeEventListener("keydown", onKeyDown);
    };
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeoutId = window.setTimeout(() => setToast(null), 1800);
    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  // Keep the highlighted row visible while arrowing through a long list.
  useEffect(() => {
    if (!open || !activeCommand) {
      return;
    }

    const row = listRef.current?.querySelector<HTMLElement>(
      `[data-command-id="${CSS.escape(activeCommand.id)}"]`,
    );
    row?.scrollIntoView({ block: "nearest" });
  }, [open, activeCommand]);

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((safeIndex + 1) % Math.max(results.length, 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((safeIndex - 1 + results.length) % Math.max(results.length, 1));
    } else if (event.key === "Enter") {
      event.preventDefault();
      execute(activeCommand);
    } else if (event.key === "Escape") {
      event.preventDefault();
      close();
    }
  };

  const groups = (["Jump to", "Projects", "Actions"] as const)
    .map((group) => ({
      group,
      items: results.filter((command) => command.group === group),
    }))
    .filter((entry) => entry.items.length > 0);

  return (
    <>
      <AnimatePresence>
        {open ? (
          <motion.div
            key="palette"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            className="fixed inset-0 z-[90] flex items-start justify-center bg-black/70 px-3 pt-[12vh] backdrop-blur-sm sm:px-6"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                close();
              }
            }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Quick navigation"
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-xl overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#070b10]/95 shadow-[0_30px_80px_rgba(0,0,0,0.6),0_0_40px_rgba(0,168,255,0.1)]"
            >
              <div className="flex items-center gap-3 border-b border-white/10 px-5">
                <Search className="h-4 w-4 shrink-0 text-[var(--color-brand-blue)]" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setActiveIndex(0);
                  }}
                  onKeyDown={onInputKeyDown}
                  placeholder="Search sections, projects, contact..."
                  role="combobox"
                  aria-expanded="true"
                  aria-controls={listboxId}
                  aria-activedescendant={
                    activeCommand ? `${listboxId}-${activeCommand.id}` : undefined
                  }
                  aria-autocomplete="list"
                  autoComplete="off"
                  spellCheck={false}
                  className="h-14 w-full bg-transparent text-base text-white placeholder:text-gray-500 focus:outline-none"
                />
                <kbd className="hidden rounded-md border border-white/15 px-1.5 py-0.5 font-mono text-[10px] text-gray-400 sm:block">
                  ESC
                </kbd>
              </div>

              <div
                ref={listRef}
                id={listboxId}
                role="listbox"
                aria-label="Results"
                className="max-h-[min(60vh,440px)] overflow-y-auto overscroll-contain p-2"
              >
                {groups.length === 0 ? (
                  <p className="px-4 py-10 text-center text-sm text-gray-500">
                    Nothing matches &ldquo;{query}&rdquo;.
                  </p>
                ) : (
                  groups.map(({ group, items }) => (
                    <div key={group} role="group" aria-label={group} className="pb-2">
                      <p className="px-3 pb-1.5 pt-2 font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-gray-500">
                        {group}
                      </p>
                      {items.map((command) => {
                        const isActive = command.id === activeCommand?.id;
                        const Icon = command.Icon;

                        return (
                          <div
                            key={command.id}
                            id={`${listboxId}-${command.id}`}
                            data-command-id={command.id}
                            role="option"
                            aria-selected={isActive}
                            onMouseMove={() => {
                              if (!isActive) {
                                setActiveIndex(results.indexOf(command));
                              }
                            }}
                            onClick={() => execute(command)}
                            className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 ${
                              isActive ? "bg-[var(--color-brand-blue)]/12" : ""
                            }`}
                          >
                            <span
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${
                                isActive
                                  ? "border-[var(--color-brand-blue)]/40 text-[var(--color-brand-blue)]"
                                  : "border-white/10 text-gray-400"
                              }`}
                            >
                              <Icon className="h-4 w-4" />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-semibold text-white">
                                {command.label}
                              </span>
                              {command.hint ? (
                                <span className="block truncate text-xs text-gray-500">
                                  {command.hint}
                                </span>
                              ) : null}
                            </span>
                            {isActive ? (
                              command.external ? (
                                <ArrowUpRight className="h-4 w-4 shrink-0 text-gray-400" />
                              ) : (
                                <CornerDownLeft className="h-4 w-4 shrink-0 text-gray-400" />
                              )
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  ))
                )}
              </div>

              <div className="flex items-center gap-4 border-t border-white/10 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-gray-500">
                <span>↑↓ move</span>
                <span>↵ select</span>
                <span className="ml-auto hidden sm:inline">Ctrl/⌘ K toggles</span>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {toast ? (
          <motion.div
            key="toast"
            role="status"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed bottom-28 left-1/2 z-[95] -translate-x-1/2 rounded-full border border-[var(--color-brand-blue)]/40 bg-black/85 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md xl:bottom-24"
          >
            {toast}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
