import { Switch } from "@/components/ui/switch";
import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "pt" ? "en" : "pt";
    i18n.changeLanguage(newLang);
    document.documentElement.lang = newLang;
  };

  return (
    <div className="flex items-center gap-2 px-2">
      <div className="flex items-center gap-1">
        <span className="text-[14px] sm:text-sm" role="img" aria-label="Portuguese">🇵🇹</span>
        <span className="hidden sm:inline text-xs font-medium">PT</span>
      </div>
      <Switch
        checked={i18n.language === "en"}
        onCheckedChange={toggleLanguage}
        className="data-[state=checked]:bg-brand-primary data-[state=unchecked]:bg-input"
        aria-label="Toggle language"
      />
      <div className="flex items-center gap-1">
        <span className="text-[14px] sm:text-sm" role="img" aria-label="English">🇬🇧</span>
        <span className="hidden sm:inline text-xs font-medium">EN</span>
      </div>
    </div>
  );
}
