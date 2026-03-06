import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import EmergencyBanner from "@/components/EmergencyBanner";
import Footer from "@/components/Footer";
import { Building2, Heart, Users, Stethoscope } from "lucide-react";

type Settings = Record<string, { valueEn: string | null; valuePt: string | null }>;

export default function About() {
  const { t, i18n } = useTranslation();

  const { data: settings } = useQuery<Settings>({
    queryKey: ["/api/settings"],
  });

  useEffect(() => {
    document.title =
      i18n.language === "pt"
        ? "Sobre Nós | Setor Saúde - Parafarmácia & Clínica Aljezur"
        : "About Us | Setor Saúde - Parapharmacy & Clinic Aljezur";
  }, [i18n.language]);

  const aboutText = settings?.about
    ? i18n.language === "pt"
      ? settings.about.valuePt
      : settings.about.valueEn
    : i18n.language === "pt"
      ? "Setor Saúde é uma parafarmácia e clínica moderna localizada no coração de Aljezur, Algarve. As nossas instalações modernas contam com 5 salas de especialistas para consultas médicas e serviços de bem-estar, juntamente com uma parafarmácia totalmente equipada."
      : "Setor Saúde is a modern parapharmacy and clinic located in the heart of Aljezur, Algarve. Our state-of-the-art facility features 5 specialist rooms for medical consultations and wellness services, alongside a fully-stocked parapharmacy.";

  const features = [
    {
      icon: Building2,
      titleEn: "Modern Facilities",
      titlePt: "Instalações Modernas",
      descEn: "5 state-of-the-art specialist consultation rooms with modern medical equipment.",
      descPt: "5 salas de consulta de especialistas modernas com equipamento médico de última geração.",
    },
    {
      icon: Stethoscope,
      titleEn: "Expert Specialists",
      titlePt: "Especialistas Experientes",
      descEn: "A rotating team of the best medical practitioners in the Algarve region.",
      descPt: "Uma equipa rotativa dos melhores profissionais médicos da região do Algarve.",
    },
    {
      icon: Heart,
      titleEn: "Wellness Services",
      titlePt: "Serviços de Bem-Estar",
      descEn: "From physiotherapy to yoga, Chinese medicine to massage therapy.",
      descPt: "De fisioterapia a yoga, medicina chinesa a massagem terapêutica.",
    },
    {
      icon: Users,
      titleEn: "Community Care",
      titlePt: "Cuidado à Comunidade",
      descEn: "Serving locals and visitors in Aljezur and the wider Algarve coast.",
      descPt: "Ao serviço dos residentes e visitantes de Aljezur e da costa algarvia.",
    },
  ];

  return (
    <div className="min-h-screen">
      <EmergencyBanner />
      <Header />
      <main className="pt-28">
        {/* Hero */}
        <section className="bg-brand-accent py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-brand-dark mb-4">
              {t("aboutTitle")}
            </h1>
            <p className="text-lg text-brand-primary/80 max-w-2xl mx-auto">
              {t("aboutSubtitle")}
            </p>
          </div>
        </section>

        {/* About text + image */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">{t("ourStory")}</h2>
                <div className="prose prose-lg text-muted-foreground">
                  <p>{aboutText}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="/images/storefront.jpg"
                  alt="Setor Saúde storefront"
                  className="rounded-xl shadow-lg w-full h-48 object-cover"
                  loading="lazy"
                />
                <img
                  src="/images/consult-room.jpg"
                  alt="Consultation room"
                  className="rounded-xl shadow-lg w-full h-48 object-cover mt-8"
                  loading="lazy"
                />
                <img
                  src="/images/counter2.jpg"
                  alt="Pharmacy counter"
                  className="rounded-xl shadow-lg w-full h-48 object-cover"
                  loading="lazy"
                />
                <img
                  src="/images/reception.jpg"
                  alt="Reception area"
                  className="rounded-xl shadow-lg w-full h-48 object-cover mt-8"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features grid */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              {t("facilities")}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature) => (
                <div
                  key={feature.titleEn}
                  className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <feature.icon className="w-10 h-10 text-brand-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {i18n.language === "pt" ? feature.titlePt : feature.titleEn}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {i18n.language === "pt" ? feature.descPt : feature.descEn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
