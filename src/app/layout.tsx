import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/Providers";
import { BOOT_SESSION_KEY } from "@/lib/loading-signal";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const description =
  "Kennely Ray is a full stack web developer building internal systems and customer facing platforms, from HR and cashflow tools to e-commerce and booking apps.";

export const metadata: Metadata = {
  title: "Ken-Portfolio | Web Developer",
  description,
  authors: [{ name: "Kennely Ray Bucang" }],
  openGraph: {
    type: "website",
    title: "Kennely Ray | Full Stack Web Developer",
    description,
    siteName: "Ken-Portfolio",
  },
  twitter: {
    card: "summary",
    title: "Kennely Ray | Full Stack Web Developer",
    description,
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
};

// Runs before first paint: on a reload within the same session, flag the
// document so CSS hides the boot screen instead of flashing it up again.
const bootFlagScript = `try{if(sessionStorage.getItem(${JSON.stringify(
  BOOT_SESSION_KEY,
)}))document.documentElement.setAttribute("data-booted","")}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      // The boot flag script edits <html> before hydration.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootFlagScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <a
          href="#home"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:rounded-full focus:bg-[var(--color-brand-blue)] focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-black"
        >
          Skip to content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
