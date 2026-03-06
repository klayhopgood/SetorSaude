import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Header from "@/components/Header";
import EmergencyBanner from "@/components/EmergencyBanner";
import Footer from "@/components/Footer";
import { Phone, Mail, MapPin, Clock, MessageSquare, Instagram, Facebook } from "lucide-react";

export default function Contact() {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    document.title =
      i18n.language === "pt"
        ? "Contactos | Setor Saúde - Parafarmácia Aljezur"
        : "Contact | Setor Saúde - Parapharmacy Aljezur";
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
              {t("contactTitle")}
            </h1>
            <p className="text-lg text-brand-primary/80">
              {t("contactSubtitle")}
            </p>
          </div>
        </section>

        {/* Contact info + Map */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact details */}
              <div className="space-y-8">
                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-accent rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-brand-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{t("phone")}</h3>
                    <a href="tel:+351282998520" className="text-muted-foreground hover:text-brand-primary transition-colors block">
                      +351 282 998 520
                    </a>
                    <a href="tel:+351914030944" className="text-muted-foreground hover:text-brand-primary transition-colors block">
                      +351 914 030 944
                    </a>
                    <a
                      href="https://wa.me/351914030944"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-2 text-sm bg-[#25D366] text-white px-4 py-2 rounded-lg hover:bg-[#128C7E] transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                      WhatsApp
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-accent rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-brand-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{t("email")}</h3>
                    <a href="mailto:pharma@setorsaude.pt" className="text-muted-foreground hover:text-brand-primary transition-colors block">
                      {t("pharmacyEmail")}: pharma@setorsaude.pt
                    </a>
                    <a href="mailto:geral@setorsaude.pt" className="text-muted-foreground hover:text-brand-primary transition-colors block">
                      {t("clinicEmail")}: geral@setorsaude.pt
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-accent rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-brand-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{t("addressLabel")}</h3>
                    <p className="text-muted-foreground">Setor Saúde</p>
                    <p className="text-muted-foreground">Localidade Vales</p>
                    <p className="text-muted-foreground">8670-158 Aljezur, Portugal</p>
                    <a
                      href="https://maps.google.com/maps?q=37.31867,-8.80341"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-2 text-sm text-brand-primary hover:text-brand-dark transition-colors font-medium"
                    >
                      {t("getDirections")} →
                    </a>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-accent rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-brand-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{t("hours")}</h3>
                    <p className="text-muted-foreground">{t("weekdays")}</p>
                    <p className="text-muted-foreground">{t("weekends")}</p>
                  </div>
                </div>

                {/* Social */}
                <div className="flex items-center gap-4 pt-4">
                  <a
                    href="https://www.instagram.com/setorsaude_clinicpharma/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-brand-accent rounded-xl flex items-center justify-center hover:bg-brand-secondary transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-5 h-5 text-brand-primary" />
                  </a>
                  <a
                    href="https://www.facebook.com/people/SetorSa%C3%BAde/61557296143515/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-brand-accent rounded-xl flex items-center justify-center hover:bg-brand-secondary transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-5 h-5 text-brand-primary" />
                  </a>
                </div>
              </div>

              {/* Google Maps embed */}
              <div className="rounded-xl overflow-hidden shadow-lg h-[500px]">
                <iframe
                  src="https://maps.google.com/maps?q=37.31867,-8.80341&z=15&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Setor Saúde location map"
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
