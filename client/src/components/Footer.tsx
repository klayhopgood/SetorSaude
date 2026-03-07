import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { MapPin, Clock, Phone, Mail, Instagram, Facebook } from "lucide-react";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer id="footer" className="bg-brand-primary text-white">
      {/* Main footer */}
      <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Location */}
        <div>
          <h3 className="text-xl font-bold mb-4">{t("location")}</h3>
          <div className="flex items-start gap-3 mb-4">
            <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium" translate="no">Setor Saúde</p>
              <p className="text-white/80 text-sm">Localidade Vales</p>
              <p className="text-white/80 text-sm">8670-158 Aljezur, Portugal</p>
            </div>
          </div>
          <a
            href="https://maps.google.com/maps?q=Setor+Sa%C3%BAde+Aljezur"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
          >
            <MapPin className="w-4 h-4" />
            {t("getDirections")}
          </a>
        </div>

        {/* Hours */}
        <div>
          <h3 className="text-xl font-bold mb-4">{t("hours")}</h3>
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p>{t("weekdays")}</p>
              <p>{t("weekends")}</p>
            </div>
          </div>
          {/* Google Maps embed mini */}
          <div className="mt-4 rounded-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3640.98745542789!2d-8.8364849!3d37.295552199999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd1b415066e6aaa7%3A0x2fdc29fdf515ab6b!2sSetorSa%C3%BAde!5e1!3m2!1sen!2sau!4v1772841128463!5m2!1sen!2sau"
              width="100%"
              height="150"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Setor Saúde location"
              className="rounded-lg"
            />
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-xl font-bold mb-4">{t("contact")}</h3>
          <div className="space-y-3">
            <a
              href="tel:+351282998520"
              className="flex items-center gap-3 hover:text-white/80 transition-colors"
            >
              <Phone className="w-5 h-5 flex-shrink-0" />
              <span>+351 282 998 520</span>
            </a>
            <a
              href="tel:+351914030944"
              className="flex items-center gap-3 hover:text-white/80 transition-colors"
            >
              <Phone className="w-5 h-5 flex-shrink-0" />
              <span>+351 914 030 944</span>
            </a>
            <a
              href="mailto:pharma@setorsaude.pt"
              className="flex items-center gap-3 hover:text-white/80 transition-colors"
            >
              <Mail className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{t("pharmacyEmail")}: pharma@setorsaude.pt</span>
            </a>
            <a
              href="mailto:geral@setorsaude.pt"
              className="flex items-center gap-3 hover:text-white/80 transition-colors"
            >
              <Mail className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{t("clinicEmail")}: geral@setorsaude.pt</span>
            </a>
            <div className="flex items-center gap-4 pt-2">
              <a
                href="https://www.instagram.com/setorsaude_clinicpharma/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white/80 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.facebook.com/people/SetorSa%C3%BAde/61557296143515/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white/80 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/351914030944"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white/80 transition-colors"
                aria-label="WhatsApp"
              >
                <img
                  src="/images/whatsapp.svg"
                  alt="WhatsApp"
                  className="w-5 h-5 brightness-0 invert"
                />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/20">
        <div className="container mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4 text-sm text-white/70">
          <div className="flex items-center gap-4">
            <p>© {new Date().getFullYear()} <span translate="no">Setor Saúde</span>. {t("allRightsReserved")}.</p>
            <span>•</span>
            <p>{t("license")}: 24805/2024</p>
            <span>•</span>
            <p>VAT: PT517954001</p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/complaints-book"
              className="hover:text-white transition-colors"
            >
              {t("complaintsBook")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
