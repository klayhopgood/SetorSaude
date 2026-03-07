import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Header from "@/components/Header";
import EmergencyBanner from "@/components/EmergencyBanner";
import Hero from "@/components/Hero";
import WeeklyCalendar from "@/components/WeeklyCalendar";
import Specialists from "@/components/Specialists";
import ServicesSection from "@/components/ServicesSection";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";

export default function Home() {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.title =
      i18n.language === "pt"
        ? "Setor Saúde | Parafarmácia & Clínica em Aljezur, Algarve"
        : "Setor Saúde | Parapharmacy & Clinic in Aljezur, Algarve";
  }, [i18n.language]);

  // Handle hash navigation on load
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash.replace("#", ""));
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 500);
    }
  }, []);

  return (
    <div className="min-h-screen">
      <EmergencyBanner />
      <Header />
      <main>
        <Hero />
        <WeeklyCalendar />
        <Specialists />
        <ServicesSection />
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
}
