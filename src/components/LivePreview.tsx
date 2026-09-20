"use client";

import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";

// The framed sites are rendered at a desktop viewport and scaled down, so the
// preview shows the real desktop layout rather than each site's mobile view.
const FRAME_WIDTH = 1280;
const FRAME_HEIGHT = 800;

// Deployments cold-start; past this we stop waiting and say so.
const LOAD_TIMEOUT_MS = 15000;

type PreviewState = "loading" | "ready" | "error";

/**
 * Renders a project's deployed site live inside the card's browser chrome.
 *
 * The iframe is display-only: pointer events are off so scrolling never gets
 * trapped in the frame, and it is hidden from assistive tech and the tab order
 * because the card already exposes the project as real text and a real link.
 *
 * Mount this with `key={url}` so switching projects remounts it with fresh
 * state instead of showing the previous site while the next one loads.
 */
export function LivePreview({
  url,
  title,
  icon: Icon,
}: {
  url: string;
  title: string;
  icon: LucideIcon;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<PreviewState>("loading");
  const [scale, setScale] = useState(0);
  const [shouldLoad, setShouldLoad] = useState(false);

  // Nothing is fetched until the card is actually on screen. This also keeps
  // the two responsive layouts from each loading a copy: the one hidden at the
  // current breakpoint is display:none, so it never intersects.
  useEffect(() => {
    const element = containerRef.current;
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setShouldLoad(true);
        observer.disconnect();
      }
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? 0;
      setScale(width / FRAME_WIDTH);
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldLoad) {
      return;
    }

    // A frame whose request fails still fires `load` (the browser swaps in its
    // own error page), so the iframe alone cannot tell us the site is down.
    // This probe can: an opaque response means reachable, a rejection does not.
    let cancelled = false;
    const controller = new AbortController();

    const timeoutId = window.setTimeout(() => controller.abort(), LOAD_TIMEOUT_MS);

    fetch(url, { mode: "no-cors", signal: controller.signal }).catch(() => {
      if (!cancelled) {
        setState("error");
      }
    });

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [shouldLoad, url]);

  const host = url.replace(/^https?:\/\//, "").replace(/\/$/, "");

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden bg-[#05101b]">
      {state !== "ready" ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
          {state === "loading" ? (
            <>
              {/* Shimmer stands in for the page being fetched. */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-white/[0.04] via-transparent to-white/[0.04]" />
              </div>
              <Icon className="relative h-10 w-10 animate-pulse text-[var(--color-brand-blue)]/70" />
              <p className="relative font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-gray-400 sm:text-xs">
                Loading live site
              </p>
            </>
          ) : (
            <>
              <Icon className="h-10 w-10 text-gray-500" />
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-gray-300 sm:text-xs">
                Preview unavailable
              </p>
              <p className="max-w-xs font-mono text-[10px] leading-relaxed tracking-[0.14em] text-gray-400">
                {host} did not respond in time. Open the project to visit it
                directly.
              </p>
            </>
          )}
        </div>
      ) : null}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 origin-top-left transition-opacity duration-700"
        style={{
          width: FRAME_WIDTH,
          height: FRAME_HEIGHT,
          transform: `scale(${scale})`,
          opacity: state === "ready" && scale > 0 ? 1 : 0,
        }}
      >
        {shouldLoad ? (
          <iframe
            src={url}
            title={`Live preview of ${title}`}
            tabIndex={-1}
            loading="lazy"
            referrerPolicy="no-referrer"
            // No allow-top-navigation, so a framed site cannot hijack the page.
            sandbox="allow-scripts allow-same-origin allow-forms"
            // A failed request still fires `load` for the browser's error
            // page, so a reachability failure must win over it.
            onLoad={() => setState((current) => (current === "error" ? current : "ready"))}
            onError={() => setState("error")}
            className="h-full w-full border-0"
          />
        ) : null}
      </div>
    </div>
  );
}
