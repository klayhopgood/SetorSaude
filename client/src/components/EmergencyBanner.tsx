import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";

type Settings = Record<string, { valueEn: string | null; valuePt: string | null }>;

export default function EmergencyBanner() {
  const { i18n } = useTranslation();

  const { data: settings } = useQuery<Settings>({
    queryKey: ["/api/settings"],
  });

  const bannerSetting = settings?.emergency_banner;
  const bannerText =
    i18n.language === "pt"
      ? bannerSetting?.valuePt
      : bannerSetting?.valueEn;

  // Fallback if no setting in DB yet
  const displayText =
    bannerText ||
    (i18n.language === "pt"
      ? "🧑‍⚕️Consulta do Dia disponível Segunda-Feira, Terça-Feira e Sexta-Feira. Ligue para +351 914 030 944"
      : "🧑‍⚕️General Practitioner available on Monday's, Tuesday's and Friday's. Book on +351 914 030 944");

  if (!displayText) return null;

  return (
    <div
      className="bg-red-600 text-white overflow-hidden whitespace-nowrap py-2 fixed top-0 left-0 right-0 z-50"
      role="alert"
      aria-live="polite"
    >
      <div className="flex">
        <div className="animate-scroll-left whitespace-nowrap px-8">
          {displayText}
        </div>
        <div className="animate-scroll-left whitespace-nowrap px-8">
          {displayText}
        </div>
      </div>
    </div>
  );
}
