import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation();
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const isHome = location === "/";

  const scrollToSection = (sectionId: string) => {
    if (!isHome) {
      window.location.href = `/#${sectionId}`;
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.offsetTop - headerOffset;
      window.scrollTo({ top: elementPosition, behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  const navItems = [
    { label: t("home"), href: "/", type: "link" as const },
    { label: t("ourSpecialists"), action: () => scrollToSection("specialists"), type: "scroll" as const },
    { label: t("ourServices"), action: () => scrollToSection("services"), type: "scroll" as const },
    { label: t("about"), href: "/about", type: "link" as const },
    { label: t("contactNav"), href: "/contact", type: "link" as const },
  ];

  return (
    <header
      className={`fixed top-[32px] left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-md"
          : "bg-white"
      }`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <img
              src="/images/logo2.svg"
              alt="Setor Saúde"
              className="h-10 sm:h-14"
              width={200}
              height={56}
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            {navItems.map((item) =>
              item.type === "link" ? (
                <Link
                  key={item.label}
                  href={item.href!}
                  className={`text-sm font-medium transition-colors hover:text-brand-primary ${
                    location === item.href
                      ? "text-brand-primary"
                      : "text-foreground/80"
                  }`}
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="text-sm font-medium text-foreground/80 transition-colors hover:text-brand-primary"
                >
                  {item.label}
                </button>
              ),
            )}
          </nav>

          {/* Right side: language + mobile toggle */}
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <button
              className="md:hidden p-2 rounded-md hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileMenuOpen && (
          <nav
            className="md:hidden mt-4 pb-4 border-t border-border pt-4 space-y-3"
            aria-label="Mobile navigation"
          >
            {navItems.map((item) =>
              item.type === "link" ? (
                <Link
                  key={item.label}
                  href={item.href!}
                  className={`block text-sm font-medium py-2 transition-colors hover:text-brand-primary ${
                    location === item.href
                      ? "text-brand-primary"
                      : "text-foreground/80"
                  }`}
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="block w-full text-left text-sm font-medium py-2 text-foreground/80 transition-colors hover:text-brand-primary"
                >
                  {item.label}
                </button>
              ),
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
