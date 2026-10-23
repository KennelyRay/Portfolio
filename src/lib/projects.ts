import {
  Bug,
  Bus,
  CalendarDays,
  Car,
  Crosshair,
  Library,
  MessageSquareText,
  MonitorSmartphone,
  Plane,
  ShoppingCart,
  Store,
  WalletCards,
  type LucideIcon,
} from "lucide-react";

export type Project = {
  title: string;
  desc: string;
  role: string;
  link: string;
  icon: LucideIcon;
  // Page the live preview loads, when it should differ from the public link
  // (e.g. a demo mode that needs no sign-in).
  previewUrl?: string;
  // Hostnames the site's CSP frame-ancestors allows to embed it. Anywhere else
  // the browser refuses the frame, and a cross-origin page cannot detect that,
  // so the preview shows a poster instead. Omit when any site may embed it.
  embedHosts?: string[];
  // True when the site sends Cross-Origin-Resource-Policy: same-origin. The
  // browser then blocks the preview's reachability probe even though the site
  // is up (the frame itself is unaffected), so the probe is skipped.
  sameOriginResources?: boolean;
};

// Newest first: the hero's "latest build" card reads the head of this list.
export const allProjects: Project[] = [
  {
    title: "ValoVertix",
    desc: "A VALORANT companion that shows every skin you own, estimates what the collection cost in VP and pesos, and tracks rank, match stats, the daily store, and the Night Market.",
    role: "Sole Developer",
    link: "https://valovertix.vercel.app/",
    icon: Crosshair,
    previewUrl: "https://valovertix.vercel.app/?demo=1",
    embedHosts: ["ken-portfolio.me", "www.ken-portfolio.me"],
    sameOriginResources: true,
  },
  {
    title: "Vertixia Rental",
    desc: "A car rental platform that lets customers preview rental cars through interactive 3D models before booking.",
    role: "Sole Developer",
    link: "https://vertixia-rental.vercel.app/",
    icon: Car,
  },
  {
    title: "Human Resources Information System",
    desc: "An attendance management web app with reporting, employee management, terminal tools, and settings.",
    role: "Sole Developer/DB Engineer",
    link: "https://j-attendance-tracker.vercel.app/",
    icon: MonitorSmartphone,
  },
  {
    title: "MasterCraft Bug Hunter",
    desc: "A bug reporting platform built for clean issue tracking, organized triage, and reward-based bug submissions.",
    role: "Sole Developer/DB Engineer",
    link: "https://mcbughunter.vercel.app/",
    icon: Bug,
  },
  {
    title: "VertixHub",
    desc: "A premium computer hardware e-commerce platform built for browsing products, custom PC building, and a modern shopping experience.",
    role: "Sole Developer",
    link: "https://vertixhub.vercel.app/home",
    icon: ShoppingCart,
  },
  {
    title: "VertixFlights",
    desc: "A flight booking platform built for searching flights, booking airline tickets, and a smooth travel reservation experience.",
    role: "Sole Developer/DB Engineer",
    link: "https://vertix-flights.vercel.app",
    icon: Plane,
  },
  {
    title: "AniVertix",
    desc: "An anime and manga database platform built for browsing titles, exploring details, and discovering new series.",
    role: "Sole Developer/DB Engineer",
    link: "https://anivertix.vercel.app/",
    icon: Library,
  },
  {
    title: "DENR Cashflow System",
    desc: "A secure cashflow tracking and reporting system designed for streamlined financial monitoring.",
    role: "Sole Developer/DB Engineer",
    link: "https://denr-cashflow-system.vercel.app/login",
    icon: WalletCards,
  },
  {
    title: "DENR Reservation System",
    desc: "A dedicated reservation management system built for DENR Baguio.",
    role: "Sole Developer/DB Engineer",
    link: "https://denr-car-reservation.vercel.app/",
    icon: CalendarDays,
  },
  {
    title: "Ken-dal Store POS",
    desc: "A point of sale system built for store management, inventory control, sales tracking, and secure access.",
    role: "Sole Developer",
    link: "https://kendal-store.vercel.app/#/login",
    icon: Store,
  },
  {
    title: "AgLugan",
    desc: "A jeepney seat reservation platform with live queues, guaranteed seats, and cashless payments for commuters on the Bakakeng route.",
    role: "Lead Developer",
    link: "https://aglugan.vercel.app/",
    icon: Bus,
  },
  {
    title: "Navibot",
    desc: "An academic capstone enrollment chatbot built to guide students through enrollment questions and portal-related assistance.",
    role: "Academic Capstone",
    link: "https://tektitans-navibot.vercel.app/",
    icon: MessageSquareText,
  },
];

// Single source of truth for the counts the hero advertises.
export const projectCount = allProjects.length;
export const soloProjectCount = allProjects.filter((project) =>
  project.role.startsWith("Sole Developer"),
).length;

const featuredTitles = [
  "ValoVertix",
  "Vertixia Rental",
  "Human Resources Information System",
  "VertixFlights",
  "Navibot",
  "DENR Reservation System",
];

export const featuredProjects = featuredTitles.flatMap((title) =>
  allProjects.filter((project) => project.title === title),
);

export const hostOf = (link: string) =>
  link.replace(/^https?:\/\//, "").replace(/\/$/, "");
