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
import DotField from "@/components/DotField";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-transparent pb-24 xl:pb-0">
      <LoadingScreen />
      <InitialScrollReset />
      <BackgroundAnimation />
      <Navbar />
      <MobileNavigator />
      <ScrollCue />
      
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 z-0">
          <DotField
            dotRadius={1.5}
            dotSpacing={14}
            bulgeStrength={67}
            glowRadius={160}
            sparkle={false}
            waveAmplitude={0}
            gradientFrom="rgba(0, 168, 255, 0.35)"
            gradientTo="rgba(0, 168, 255, 0.12)"
            glowColor="#0e3a52"
          />
        </div>

        <Section id="home" className="relative z-10 min-h-screen">
          <Hero />
        </Section>
      </div>

      <Works />
      <TechStack />
      <About />
      <Contact />
      
      <Footer />
    </main>
  );
}
