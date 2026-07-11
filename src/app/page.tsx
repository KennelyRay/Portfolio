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
import { MobileNavigator } from "@/components/MobileNavigator";
import { InitialScrollReset } from "@/components/InitialScrollReset";
import { LoadingScreen } from "@/components/LoadingScreen";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-transparent pb-24 xl:pb-0">
      <LoadingScreen />
      <InitialScrollReset />
      <BackgroundAnimation />
      <Navbar />
      <MobileNavigator />
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
