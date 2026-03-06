import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { Home } from "lucide-react";

export default function NotFound() {
  const { i18n } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-accent">
      <div className="text-center p-8">
        <h1 className="text-6xl font-bold text-brand-primary mb-4">404</h1>
        <p className="text-xl text-brand-primary/80 mb-8">
          {i18n.language === "pt"
            ? "Página não encontrada"
            : "Page not found"}
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-brand-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-dark transition-colors"
        >
          <Home className="w-4 h-4" />
          {i18n.language === "pt" ? "Voltar ao Início" : "Back to Home"}
        </Link>
      </div>
    </div>
  );
}
