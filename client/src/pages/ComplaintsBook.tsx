import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Header from "@/components/Header";
import EmergencyBanner from "@/components/EmergencyBanner";
import Footer from "@/components/Footer";
import { ExternalLink } from "lucide-react";

export default function ComplaintsBook() {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    document.title =
      i18n.language === "pt"
        ? "Livro de Reclamações | Setor Saúde"
        : "Complaints Book | Setor Saúde";
  }, [i18n.language]);

  return (
    <div className="min-h-screen">
      <EmergencyBanner />
      <Header />
      <main className="pt-28">
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">
              {t("complaintsBook")}
            </h1>
            <p className="text-muted-foreground mb-8">
              {i18n.language === "pt"
                ? "Nos termos do artigo 24.º da Lei n.º 156/2005, de 15 de setembro, a Setor Saúde disponibiliza o livro de reclamações eletrónico."
                : "In accordance with Article 24 of Law No. 156/2005, of 15 September, Setor Saúde provides the electronic complaints book."}
            </p>
            <a
              href="https://www.livroreclamacoes.pt/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-brand-primary text-white px-8 py-4 rounded-xl font-semibold hover:bg-brand-dark transition-colors shadow-lg text-lg"
            >
              <ExternalLink className="w-5 h-5" />
              {i18n.language === "pt"
                ? "Aceder ao Livro de Reclamações"
                : "Access Complaints Book"}
            </a>
            <div className="mt-12 p-6 bg-muted/30 rounded-xl text-sm text-muted-foreground">
              <p className="font-medium mb-2">
                {i18n.language === "pt"
                  ? "Setor Saúde, Lda."
                  : "Setor Saúde, Lda."}
              </p>
              <p>Localidade Vales, 8670-158 Aljezur</p>
              <p>{t("license")}: 24805/2024</p>
              <p>NIF: PT517954001</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
