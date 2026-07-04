import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { TechStack } from "@/components/TechStack";
import { Works } from "@/components/Works";
import { Contact } from "@/components/Contact";
import { Section } from "@/components/Section";
import { BackgroundAnimation } from "@/components/BackgroundAnimation";
import { Footer } from "@/components/Footer";
import { ScrollCue } from "@/components/ScrollCue";

export default function Home() {
  return (
    <main className="relative bg-transparent min-h-screen">
      <BackgroundAnimation />
      <Navbar />
      <ScrollCue />
      
      <Section id="home" className="min-h-screen">
        <Hero />
      </Section>

      <Works />
      <TechStack />
      <About />
      <Contact />
      
      <Footer />
    </main>
  );
}
