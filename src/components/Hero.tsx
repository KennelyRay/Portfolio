"use client";

import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type MouseEvent,
  type ReactNode,
} from "react";
import { hasLoaded, onLoaded } from "@/lib/loading-signal";
import {
  allProjects,
  hostOf,
  projectCount,
  soloProjectCount,
} from "@/lib/projects";
import { techCount } from "./TechStack";

const EASE = [0.16, 1, 0.3, 1] as const;

const stage: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

// The headline is the focal point, so it gets the one expensive gesture:
// each line rides up from behind its own clipping mask.
const maskedLine: Variants = {
  hidden: { y: "118%" },
  visible: { y: "0%", transition: { duration: 1.05, ease: EASE } },
};

const rise: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
};

const fade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

// Each one maps to real work in the project list, not an adjective.
const BUILDS = [
  "web experiences.",
  "internal systems.",
  "storefronts.",
  "booking engines.",
];
const BUILD_INTERVAL_MS = 2600;

const latest = allProjects[0];
const LatestIcon = latest.icon;

const MAGNET_SPRING = { stiffness: 220, damping: 16, mass: 0.45 } as const;
const TILT_SPRING = { stiffness: 180, damping: 18, mass: 0.5 } as const;

/**
 * CTA that leans toward the cursor while it is nearby. The pull is the reward
 * for approaching the one action the hero is asking for; it settles back to
 * centre on exit, on blur, and whenever the visitor prefers reduced motion.
 */
function MagneticCta({
  href,
  children,
  tone,
}: {
  href: string;
  children: ReactNode;
  tone: "solid" | "ghost";
}) {
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, MAGNET_SPRING);
  const springY = useSpring(y, MAGNET_SPRING);

  const pull = (event: MouseEvent<HTMLAnchorElement>) => {
    if (reduceMotion) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - (bounds.left + bounds.width / 2)) * 0.26);
    y.set((event.clientY - (bounds.top + bounds.height / 2)) * 0.34);
  };

  const release = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      href={href}
      variants={rise}
      onMouseMove={pull}
      onMouseLeave={release}
      onBlur={release}
      whileTap={reduceMotion ? undefined : { scale: 0.97 }}
      style={reduceMotion ? undefined : { x: springX, y: springY }}
      className={[
        "group relative inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-center text-sm font-bold tracking-wide transition-colors duration-300 sm:px-9 sm:text-base",
        tone === "solid"
          ? "bg-[var(--color-brand-blue)] text-black hover:bg-white"
          : "border border-white/20 text-white hover:border-[var(--color-brand-blue)] hover:text-[var(--color-brand-blue)]",
      ].join(" ")}
    >
      {children}
    </motion.a>
  );
}

/** Counts up once the hero is revealed. Drives the DOM directly, no re-renders. */
function Counter({ to, run }: { to: number; run: boolean }) {
  const reduceMotion = useReducedMotion();
  const value = useMotionValue(0);
  const text = useTransform(value, (latest) =>
    String(Math.round(latest)).padStart(2, "0"),
  );

  useEffect(() => {
    if (!run) {
      return;
    }

    if (reduceMotion) {
      value.set(to);
      return;
    }

    const controls = animate(value, to, { duration: 1.6, delay: 0.7, ease: EASE });
    return () => controls.stop();
  }, [run, to, reduceMotion, value]);

  return (
    <>
      <span className="sr-only">{to}</span>
      <motion.span aria-hidden="true">{text}</motion.span>
    </>
  );
}

// Baguio local time. A store keeps the server render stable (no clock) and
// lets the client tick once a minute without a hydration mismatch.
const timeFormat = new Intl.DateTimeFormat("en-PH", {
  timeZone: "Asia/Manila",
  hour: "numeric",
  minute: "2-digit",
});

function subscribeToClock(onChange: () => void) {
  const id = window.setInterval(onChange, 15_000);
  return () => window.clearInterval(id);
}

function useLocalTime() {
  return useSyncExternalStore(
    subscribeToClock,
    () => timeFormat.format(new Date()),
    () => null,
  );
}

/**
 * The newest project, presented as the hero's proof point. It tilts toward
 * the cursor on hover, using transforms only so it stays on the compositor.
 */
function LatestBuildCard({ revealed }: { revealed: boolean }) {
  const reduceMotion = useReducedMotion();
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, TILT_SPRING);
  const springY = useSpring(rotateY, TILT_SPRING);

  const tilt = (event: MouseEvent<HTMLDivElement>) => {
    if (reduceMotion) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - bounds.left) / bounds.width - 0.5;
    const py = (event.clientY - bounds.top) / bounds.height - 0.5;
    rotateY.set(px * 9);
    rotateX.set(py * -9);
  };

  const settle = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  const stats = [
    { value: projectCount, label: "Projects live" },
    { value: soloProjectCount, label: "Built solo" },
    { value: techCount, label: "Tools in stack" },
  ];

  return (
    <motion.div
      variants={rise}
      onMouseMove={tilt}
      onMouseLeave={settle}
      style={
        reduceMotion
          ? undefined
          : { rotateX: springX, rotateY: springY, transformPerspective: 1000 }
      }
      className="relative w-full overflow-hidden rounded-[1.75rem] border border-white/10 bg-[linear-gradient(160deg,rgba(0,168,255,0.12),rgba(5,10,16,0.92)_45%)] shadow-[0_0_40px_rgba(0,168,255,0.08)]"
    >
      <div className="space-y-4 p-5 sm:p-6">
        <div className="flex items-center justify-between font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-gray-400 sm:text-[11px]">
          <span className="text-[var(--color-brand-blue)]">Latest build</span>
          <span>{hostOf(latest.link)}</span>
        </div>

        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[var(--color-brand-blue)]/30 bg-[var(--color-brand-blue)]/10">
            <LatestIcon className="h-6 w-6 text-[var(--color-brand-blue)]" />
          </div>
          <div className="min-w-0 space-y-1.5">
            <p className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              {latest.title}
            </p>
            <p className="line-clamp-2 text-sm leading-relaxed text-gray-400">
              {latest.desc}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full border border-[var(--color-brand-blue)]/40 bg-[var(--color-brand-blue)]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-brand-blue)]">
            {latest.role}
          </span>
          <a
            href={latest.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white transition-colors hover:text-[var(--color-brand-blue)]"
          >
            Open live
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span className="sr-only">(opens {latest.title} in a new tab)</span>
          </a>
        </div>
      </div>

      <dl className="grid grid-cols-3 divide-x divide-white/10 border-t border-white/10">
        {stats.map((stat) => (
          <div key={stat.label} className="px-4 py-4 sm:px-5">
            <dt className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500 sm:text-[10px]">
              {stat.label}
            </dt>
            <dd className="mt-1 text-2xl font-bold tabular-nums tracking-tight text-white sm:text-3xl">
              <Counter to={stat.value} run={revealed} />
            </dd>
          </div>
        ))}
      </dl>
    </motion.div>
  );
}

function BuildTicker() {
  const titles = allProjects.map((project) => project.title);

  // Two identical runs; the CSS animation shifts by exactly one run so the
  // loop is seamless. Purely decorative: the real list lives in Works.
  return (
    <div
      aria-hidden="true"
      className="marquee relative overflow-hidden border-y border-white/10 py-3 [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]"
    >
      <div className="marquee-track flex w-max">
        {[0, 1].map((run) => (
          <div key={run} className="flex shrink-0 items-center">
            {titles.map((title) => (
              <span
                key={`${run}-${title}`}
                className="flex items-center whitespace-nowrap font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-gray-500 sm:text-xs"
              >
                <span className="px-5">{title}</span>
                <span className="text-[var(--color-brand-blue)]">/</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Hero() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const localTime = useLocalTime();

  // Hold the reveal until the boot screen lifts, with a timed fallback so the
  // hero still appears if the loader is ever removed or fails to finish.
  const [revealed, setRevealed] = useState(() => hasLoaded());
  const [buildIndex, setBuildIndex] = useState(0);

  useEffect(() => {
    const unsubscribe = onLoaded(() => setRevealed(true));
    const fallback = window.setTimeout(() => setRevealed(true), 4500);

    return () => {
      unsubscribe();
      window.clearTimeout(fallback);
    };
  }, []);

  // Start cycling only after the headline has landed, and never for visitors
  // who asked for less motion.
  useEffect(() => {
    if (!revealed || reduceMotion) {
      return;
    }

    let intervalId = 0;
    const startId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        setBuildIndex((current) => (current + 1) % BUILDS.length);
      }, BUILD_INTERVAL_MS);
    }, 1200);

    return () => {
      window.clearTimeout(startId);
      window.clearInterval(intervalId);
    };
  }, [revealed, reduceMotion]);

  // Layered parallax: the hero recedes as you leave it, handing off to Works.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const tickerY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  const animateState = revealed ? "visible" : "hidden";

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative flex min-h-[100svh] scroll-mt-24 flex-col justify-center px-4 pb-28 pt-24 sm:px-6 sm:pt-28 lg:px-10 xl:px-12 xl:pb-20"
    >
      <motion.div
        style={reduceMotion ? undefined : { y: contentY, opacity: contentOpacity }}
        className="mx-auto w-full max-w-[1440px]"
      >
        <motion.div
          variants={stage}
          initial="hidden"
          animate={animateState}
          className="flex flex-col gap-7 sm:gap-10"
        >
          {/* Status line: availability and local time, in the boot screen's
              mono voice. */}
          <motion.div
            variants={fade}
            className="flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.26em] sm:text-xs"
          >
            <span className="inline-flex items-center gap-2.5 rounded-full border border-emerald-400/25 bg-emerald-400/[0.06] px-3.5 py-2 text-emerald-300">
              <span className="relative flex h-2 w-2">
                <span className="motion-safe-only absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Open to work
            </span>
            <span className="text-gray-500">
              Kennely Ray
              <span className="px-2 text-[var(--color-brand-blue)]">/</span>
              Baguio, PH
              {localTime ? (
                <>
                  <span className="px-2 text-[var(--color-brand-blue)]">/</span>
                  <span className="tabular-nums text-gray-400">{localTime}</span>
                </>
              ) : null}
            </span>
          </motion.div>

          <h1 className="font-bold uppercase leading-[0.92] tracking-tighter text-white">
            <span className="sr-only">
              I build web experiences, internal systems, storefronts, and
              booking engines.
            </span>
            <span aria-hidden="true" className="block text-[clamp(1.75rem,8.4vw,6.75rem)]">
              <span className="block overflow-hidden pb-[0.06em]">
                <motion.span variants={maskedLine} className="block">
                  I build
                </motion.span>
              </span>
              {/* Staircase indent: the two lines read as one gesture, not a
                  stack. The second line swaps what is being built. */}
              <span className="block overflow-hidden pb-[0.06em] sm:ml-14 xl:ml-24">
                <motion.span variants={maskedLine} className="block">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={BUILDS[buildIndex]}
                      initial={{ y: "105%" }}
                      animate={{ y: "0%" }}
                      exit={{ y: "-105%" }}
                      transition={{ duration: 0.5, ease: EASE }}
                      className="block whitespace-nowrap text-[var(--color-brand-blue)]"
                    >
                      {BUILDS[buildIndex]}
                    </motion.span>
                  </AnimatePresence>
                </motion.span>
              </span>
            </span>
          </h1>

          <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:gap-14 xl:grid-cols-[minmax(0,1fr)_480px]">
            <div className="flex flex-col gap-7 sm:gap-9">
              <motion.p
                variants={rise}
                className="max-w-2xl text-lg leading-relaxed text-gray-300 sm:text-xl"
              >
                I&apos;m Kennely Ray, a full stack web developer. I build both
                sides of the product: the internal systems a company runs on,
                and the customer facing platforms its users touch.
              </motion.p>

              <motion.div
                variants={stage}
                className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
              >
                <MagneticCta href="#works" tone="solid">
                  See all {projectCount} projects
                </MagneticCta>
                <MagneticCta href="#contact" tone="ghost">
                  Start a project
                </MagneticCta>
              </motion.div>
            </div>

            <LatestBuildCard revealed={revealed} />
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        style={reduceMotion ? undefined : { y: tickerY }}
        variants={fade}
        initial="hidden"
        animate={animateState}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="mx-auto mt-10 w-full max-w-[1440px] sm:mt-14"
      >
        <BuildTicker />
      </motion.div>
    </section>
  );
}
