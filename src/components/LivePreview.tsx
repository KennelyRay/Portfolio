"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { RotateCw, type LucideIcon } from "lucide-react";

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
  icon,
  embedHosts,
  probe = true,
}: {
  url: string;
  title: string;
  icon: LucideIcon;
  embedHosts?: string[];
  // Off for sites whose CORP header blocks the reachability probe.
  probe?: boolean;
}) {
  // null on the server and during hydration, so a restricted site starts on
  // the poster and only swaps to the frame once we know where we are.
  const pageHost = useSyncExternalStore(
    subscribeToNothing,
    () => window.location.hostname,
    () => null,
  );

  if (embedHosts && (pageHost === null || !embedHosts.includes(pageHost))) {
    return <EmbedBlockedPoster url={url} icon={icon} allowedHost={embedHosts[0]} />;
  }

  return <LiveFrame url={url} title={title} icon={icon} probe={probe} />;
}

const subscribeToNothing = () => () => {};

/**
 * Stand-in for sites whose CSP only lets specific hosts frame them. Requesting
 * them anywhere else would only get the browser's "refused to connect" page,
 * so nothing is loaded at all.
 */
function EmbedBlockedPoster({
  url,
  icon: Icon,
  allowedHost,
}: {
  url: string;
  icon: LucideIcon;
  allowedHost: string;
}) {
  const host = new URL(url).hostname;

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#05101b]">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,168,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,168,255,0.05)_1px,transparent_1px)] bg-[size:36px_36px]" />
      <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_closest-side,rgba(0,168,255,0.18),transparent)]" />
      <div className="relative flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--color-brand-blue)]/35 bg-[var(--color-brand-blue)]/10 shadow-[0_0_30px_rgba(0,168,255,0.18)]">
          <Icon className="h-8 w-8 text-[var(--color-brand-blue)]" />
        </div>
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-gray-300 sm:text-xs">
          Opens in its own tab
        </p>
        <p className="max-w-xs font-mono text-[10px] leading-relaxed tracking-[0.14em] text-gray-400">
          {host} only allows its live preview on {allowedHost}. Open the
          project to try it.
        </p>
      </div>
    </div>
  );
}

function LiveFrame({
  url,
  title,
  icon: Icon,
  probe,
}: {
  url: string;
  title: string;
  icon: LucideIcon;
  probe: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<PreviewState>("loading");
  const [scale, setScale] = useState(0);
  const [shouldLoad, setShouldLoad] = useState(false);
  // Bumped by the retry button; remounts the frame and re-runs the probe.
  const [attempt, setAttempt] = useState(0);

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
    if (!shouldLoad || !probe) {
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
  }, [shouldLoad, url, attempt, probe]);

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
                {host} did not respond in time. Deployments can take a moment
                to wake up.
              </p>
              <button
                type="button"
                onClick={() => {
                  setState("loading");
                  setAttempt((current) => current + 1);
                }}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-white transition-colors hover:border-[var(--color-brand-blue)] hover:text-[var(--color-brand-blue)]"
              >
                <RotateCw className="h-3.5 w-3.5" />
                Retry preview
              </button>
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
            key={attempt}
            src={url}
            title={`Live preview of ${title}`}
            tabIndex={-1}
            loading="lazy"
            referrerPolicy="no-referrer"
            allow="clipboard-write; fullscreen"
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
