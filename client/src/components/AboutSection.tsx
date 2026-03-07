import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Building2, Heart, Users, Stethoscope } from "lucide-react";

type Settings = Record<string, { valueEn: string | null; valuePt: string | null }>;

export default function AboutSection() {
  const { t, i18n } = useTranslation();

  const { data: settings } = useQuery<Settings>({
    queryKey: ["/api/settings"],
  });

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
      descEn:
        "5 state-of-the-art specialist consultation rooms with modern medical equipment.",
      descPt:
        "5 salas de consulta de especialistas modernas com equipamento médico de última geração.",
    },
    {
      icon: Stethoscope,
      titleEn: "Expert Specialists",
      titlePt: "Especialistas Experientes",
      descEn:
        "A rotating team of the best medical practitioners in the Algarve region.",
      descPt:
        "Uma equipa rotativa dos melhores profissionais médicos da região do Algarve.",
    },
    {
      icon: Heart,
      titleEn: "Wellness Services",
      titlePt: "Serviços de Bem-Estar",
      descEn:
        "From nutrition to osteopathy, Chinese medicine to massage therapy.",
      descPt:
        "De nutrição a osteopatia, medicina chinesa a massagem terapêutica.",
    },
    {
      icon: Users,
      titleEn: "Community Care",
      titlePt: "Cuidado à Comunidade",
      descEn:
        "Serving locals and visitors in Aljezur and the wider Algarve coast.",
      descPt:
        "Ao serviço dos residentes e visitantes de Aljezur e da costa algarvia.",
    },
  ];

  return (
    <section id="about" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Story + images */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {t("aboutTitle")}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {aboutText}
            </p>
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

        {/* Feature cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={feature.titleEn}
              className="text-center p-6 bg-muted/30 rounded-xl hover:shadow-md transition-shadow"
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
  );
}
