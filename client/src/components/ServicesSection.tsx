import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Phone, MessageSquare, X, User } from "lucide-react";
import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { ptBR, enUS } from "date-fns/locale";
import type { Service, ServiceSchedule } from "@shared/schema";

type ServiceWithSchedules = Service & {
  schedules: ServiceSchedule[];
};

export default function ServicesSection() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "pt" ? ptBR : enUS;
  const [expandedBios, setExpandedBios] = useState<Set<number>>(new Set());
  const [expandedSchedules, setExpandedSchedules] = useState<Set<number>>(new Set());
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set());

  const { data: services = [], isLoading, isError, error } = useQuery<ServiceWithSchedules[]>({
    queryKey: ["/api/services"],
    retry: 3,
    retryDelay: 1000,
  });

  // Reset filters on language change
  useEffect(() => {
    setSelectedServices(new Set());
  }, [i18n.language]);

  const toggleBio = (id: number) => {
    const newExpanded = new Set(expandedBios);
    if (newExpanded.has(id)) newExpanded.delete(id);
    else newExpanded.add(id);
    setExpandedBios(newExpanded);
  };

  const toggleSchedule = (id: number) => {
    const newExpanded = new Set(expandedSchedules);
    if (newExpanded.has(id)) newExpanded.delete(id);
    else newExpanded.add(id);
    setExpandedSchedules(newExpanded);
  };

  const toggleService = (service: string) => {
    const newSelected = new Set(selectedServices);
    if (newSelected.has(service)) newSelected.delete(service);
    else newSelected.add(service);
    setSelectedServices(newSelected);
  };

  // Get unique service types for filter
  const uniqueServiceNames = Array.from(
    new Set(
      services.map((s) =>
        i18n.language === "pt" ? s.servicePt : s.serviceEn,
      ),
    ),
  );

  // Filter services
  const filteredServices = services.filter(
    (s) =>
      selectedServices.size === 0 ||
      selectedServices.has(
        i18n.language === "pt" ? s.servicePt : s.serviceEn,
      ),
  );

  const formatDaysOfWeek = (dateValue: string | null) => {
    if (!dateValue) return "";
    const dayNames = dateValue.split(",").map((d) => {
      const dayNum = parseInt(d.trim(), 10);
      const date = new Date(2024, 0, 7 + dayNum);
      return format(date, "EEEE", { locale });
    });
    return dayNames.join(", ");
  };

  const formatAvailability = (schedule: ServiceSchedule) => {
    if (schedule.dateType === "weekdays") {
      return { days: t("Monday - Friday"), time: schedule.availabilityText };
    } else if (schedule.dateType === "all_week") {
      return { days: t("Monday to Sunday"), time: schedule.availabilityText };
    } else if (schedule.dateType === "days_of_week" && schedule.dateValue) {
      return { days: formatDaysOfWeek(schedule.dateValue), time: schedule.availabilityText };
    } else if (schedule.dateValue) {
      try {
        return {
          days: format(parseISO(schedule.dateValue), "EEEE, dd/MM/yyyy", { locale }),
          time: schedule.availabilityText,
        };
      } catch {
        return { days: schedule.dateValue, time: schedule.availabilityText };
      }
    }
    return { days: "", time: schedule.availabilityText };
  };

  if (isLoading) {
    return (
      <section id="services" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            {t("ourServices")}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="p-4 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </CardHeader>
                <CardContent className="p-3">
                  <div className="w-32 h-32 bg-muted rounded-lg mx-auto" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    console.error("Failed to load services:", error);
    return (
      <section id="services" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t("ourServices")}
          </h2>
          <p className="text-muted-foreground">
            {i18n.language === "pt"
              ? "Não foi possível carregar os serviços. Por favor, tente novamente mais tarde."
              : "Unable to load services. Please try again later."}
          </p>
        </div>
      </section>
    );
  }

  if (services.length === 0) return null;

  return (
    <section id="services" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-3">
          {t("ourServices")}
        </h2>
        <p className="text-center text-muted-foreground mb-6">
          {t("filterByServiceHeading")}
        </p>

        {/* Service filter pills */}
        {uniqueServiceNames.length > 1 && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 justify-center">
              {uniqueServiceNames.map((service) => (
                <button
                  key={service}
                  onClick={() => toggleService(service)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedServices.has(service)
                      ? "bg-brand-primary text-white shadow-md"
                      : "bg-white text-foreground/70 hover:bg-brand-secondary"
                  }`}
                >
                  {service}
                  {selectedServices.has(service) && (
                    <X className="h-3.5 w-3.5" />
                  )}
                </button>
              ))}
            </div>
            {selectedServices.size > 0 && (
              <div className="mt-3 text-center">
                <button
                  onClick={() => setSelectedServices(new Set())}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("clearFilters")}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Service cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredServices.map((service) => (
            <Card
              key={service.id}
              className="flex flex-col max-w-[280px] w-full mx-auto hover:shadow-lg transition-shadow"
            >
              <CardHeader className="space-y-1 p-4">
                <CardTitle className="text-base font-semibold break-words hyphens-auto">
                  {service.providerName}
                </CardTitle>
                <CardDescription className="text-xs">
                  {i18n.language === "pt" ? service.servicePt : service.serviceEn}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col gap-2 p-3">
                {/* Profile image */}
                <div className="w-32 h-32 md:w-40 md:h-40 mx-auto">
                  {service.imageUrl ? (
                    <img
                      src={service.imageUrl}
                      alt={service.providerName}
                      className="w-full h-full object-cover rounded-lg"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = "/images/logo1.svg";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
                      <User className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Biography collapsible */}
                {(service.bioEn || service.bioPt) && (
                  <Collapsible
                    open={expandedBios.has(service.id)}
                    onOpenChange={() => toggleBio(service.id)}
                  >
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-between p-2 h-8"
                      >
                        {t("biography")}
                        {expandedBios.has(service.id) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-2 py-3">
                      <div className="max-h-[200px] overflow-y-auto">
                        <p className="text-xs leading-relaxed">
                          {i18n.language === "pt"
                            ? service.bioPt
                            : service.bioEn}
                        </p>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                )}

                {/* Schedule collapsible */}
                <Collapsible
                  open={expandedSchedules.has(service.id)}
                  onOpenChange={() => toggleSchedule(service.id)}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-between p-2 h-8"
                    >
                      {t("availability")}
                      {expandedSchedules.has(service.id) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="px-2 py-3 space-y-3">
                    {service.schedules.length > 0 ? (
                      <>
                        <div className="space-y-2">
                          {service.schedules.map((schedule) => {
                            const avail = formatAvailability(schedule);
                            return (
                              <div key={schedule.id} className="text-xs space-y-1 mb-2">
                                <div className="font-medium">{avail.days}</div>
                                <div className="text-muted-foreground">{avail.time}</div>
                              </div>
                            );
                          })}
                        </div>
                        <div className="flex flex-col gap-2">
                          <a
                            href="tel:+351914030944"
                            className="flex items-center justify-center gap-2 text-xs bg-brand-secondary text-foreground rounded-md py-2 hover:bg-brand-primary hover:text-white transition-colors"
                          >
                            <Phone className="h-3 w-3" />
                            {t("callToBook")}
                          </a>
                          <a
                            href="https://wa.me/351914030944"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 text-xs bg-[#25D366] text-white rounded-md py-2 hover:bg-[#128C7E] transition-colors"
                          >
                            <MessageSquare className="h-3 w-3" />
                            {t("whatsappToBook")}
                          </a>
                        </div>
                      </>
                    ) : (
                      <p className="text-xs text-muted-foreground text-center">
                        {t("noAppointments")}
                      </p>
                    )}
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
