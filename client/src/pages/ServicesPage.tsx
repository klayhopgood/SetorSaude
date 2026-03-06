import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Header from "@/components/Header";
import EmergencyBanner from "@/components/EmergencyBanner";
import Specialists from "@/components/Specialists";
import ServicesSection from "@/components/ServicesSection";
import Footer from "@/components/Footer";

export default function ServicesPage() {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    document.title =
      i18n.language === "pt"
        ? "Serviços | Setor Saúde - Especialistas & Bem-Estar Aljezur"
        : "Services | Setor Saúde - Specialists & Wellness Aljezur";
  }, [i18n.language]);

  return (
    <div className="min-h-screen">
      <EmergencyBanner />
      <Header />
      <main className="pt-28">
        {/* Hero */}
        <section className="bg-brand-accent py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-brand-dark mb-4">
              {i18n.language === "pt" ? "Os Nossos Serviços" : "Our Services"}
            </h1>
            <p className="text-lg text-brand-primary/80 max-w-2xl mx-auto">
              {i18n.language === "pt"
                ? "Especialistas médicos e serviços de bem-estar no coração de Aljezur"
                : "Medical specialists and wellness services in the heart of Aljezur"}
            </p>
          </div>
        </section>

        <Specialists />
        <ServicesSection />
      </main>
      <Footer />
    </div>
  );
}
