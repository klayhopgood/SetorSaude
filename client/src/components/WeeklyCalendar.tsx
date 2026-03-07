import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import {
  startOfWeek,
  endOfWeek,
  addDays,
  format,
  isToday,
  isSameDay,
  parseISO,
  addWeeks,
  subWeeks,
} from "date-fns";
import { ptBR, enUS } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Clock, User, Stethoscope } from "lucide-react";
import type { Specialist, SpecialistSchedule, Service, ServiceSchedule } from "@shared/schema";

type SpecialistWithSchedules = Specialist & { schedules: SpecialistSchedule[] };
type ServiceWithSchedules = Service & { schedules: ServiceSchedule[] };

type CalendarEntry = {
  name: string;
  labelEn: string;
  labelPt: string;
  time: string;
  type: "specialist" | "service";
};

export default function WeeklyCalendar() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "pt" ? ptBR : enUS;
  const [weekOffset, setWeekOffset] = useState(0);

  const { data: specialists = [] } = useQuery<SpecialistWithSchedules[]>({
    queryKey: ["/api/specialists"],
  });

  const { data: services = [] } = useQuery<ServiceWithSchedules[]>({
    queryKey: ["/api/services"],
  });

  const baseDate = useMemo(() => {
    const now = new Date();
    return weekOffset === 0 ? now : addWeeks(now, weekOffset);
  }, [weekOffset]);

  // Week starts on Monday
  const weekStart = startOfWeek(baseDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Map day of week index (0=Mon..4=Fri) to weekday names for matching
  const isWeekday = (date: Date) => {
    const day = date.getDay(); // 0=Sun, 1=Mon...6=Sat
    return day >= 1 && day <= 5;
  };

  // Build calendar entries per day
  const calendarData = useMemo(() => {
    const dayMap = new Map<string, CalendarEntry[]>();

    weekDays.forEach((day) => {
      const key = format(day, "yyyy-MM-dd");
      const entries: CalendarEntry[] = [];

      // Specialists
      specialists.forEach((spec) => {
        spec.schedules.forEach((sched) => {
          let matches = false;

          if (sched.dateType === "specific" && sched.dateValue) {
            matches = isSameDay(parseISO(sched.dateValue), day);
          } else if (sched.dateType === "weekdays") {
            matches = isWeekday(day);
          } else if (sched.dateType === "all_week") {
            matches = true;
          }

          if (matches) {
            entries.push({
              name: spec.name,
              labelEn: spec.specialtyEn,
              labelPt: spec.specialtyPt,
              time: sched.availableText,
              type: "specialist",
            });
          }
        });
      });

      // Services
      services.forEach((svc) => {
        svc.schedules.forEach((sched) => {
          let matches = false;

          if (sched.dateType === "specific" && sched.dateValue) {
            matches = isSameDay(parseISO(sched.dateValue), day);
          } else if (sched.dateType === "weekdays") {
            matches = isWeekday(day);
          } else if (sched.dateType === "all_week") {
            matches = true;
          }

          if (matches) {
            entries.push({
              name: svc.providerName,
              labelEn: svc.serviceEn,
              labelPt: svc.servicePt,
              time: sched.availabilityText,
              type: "service",
            });
          }
        });
      });

      // Sort by time
      entries.sort((a, b) => a.time.localeCompare(b.time));
      dayMap.set(key, entries);
    });

    return dayMap;
  }, [weekDays, specialists, services]);

  const weekLabel = useMemo(() => {
    const start = weekDays[0];
    const end = weekDays[6];
    if (i18n.language === "pt") {
      return `${format(start, "d MMM", { locale: ptBR })} – ${format(end, "d MMM yyyy", { locale: ptBR })}`;
    }
    return `${format(start, "d MMM", { locale: enUS })} – ${format(end, "d MMM yyyy", { locale: enUS })}`;
  }, [weekDays, i18n.language]);

  const hasAnyEntries = Array.from(calendarData.values()).some((e) => e.length > 0);

  if (specialists.length === 0 && services.length === 0) return null;

  return (
    <section id="this-week" className="py-12 bg-gradient-to-b from-white to-brand-light/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-2" translate="no">
            {i18n.language === "pt"
              ? "Esta Semana no Setor Saúde"
              : "This Week at Setor Saúde"}
          </h2>
          <p className="text-muted-foreground">
            {i18n.language === "pt"
              ? "Consulte a disponibilidade dos nossos especialistas e serviços"
              : "Check the availability of our specialists and services"}
          </p>
        </div>

        {/* Week Navigation */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <button
            onClick={() => setWeekOffset((w) => w - 1)}
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label={i18n.language === "pt" ? "Semana anterior" : "Previous week"}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-lg font-semibold min-w-[220px] text-center">
            {weekLabel}
          </span>
          <button
            onClick={() => setWeekOffset((w) => w + 1)}
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label={i18n.language === "pt" ? "Próxima semana" : "Next week"}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          {weekOffset !== 0 && (
            <button
              onClick={() => setWeekOffset(0)}
              className="text-sm text-brand-primary hover:underline ml-2"
            >
              {i18n.language === "pt" ? "Hoje" : "Today"}
            </button>
          )}
        </div>

        {/* Desktop: 7-column grid */}
        <div className="hidden md:grid md:grid-cols-7 gap-2">
          {weekDays.map((day) => {
            const key = format(day, "yyyy-MM-dd");
            const entries = calendarData.get(key) || [];
            const today = isToday(day);
            const isSunday = day.getDay() === 0;
            const isSaturday = day.getDay() === 6;

            return (
              <div
                key={key}
                className={`rounded-xl border p-3 min-h-[180px] transition-all ${
                  today
                    ? "border-brand-primary bg-brand-light/40 ring-2 ring-brand-primary/20"
                    : isSunday
                      ? "border-muted bg-muted/20 opacity-60"
                      : "border-muted bg-white hover:shadow-sm"
                }`}
              >
                {/* Day header */}
                <div className="text-center mb-3 pb-2 border-b border-muted">
                  <div className="text-xs font-medium uppercase text-muted-foreground">
                    {format(day, "EEE", { locale })}
                  </div>
                  <div
                    className={`text-lg font-bold ${
                      today ? "text-brand-primary" : ""
                    }`}
                  >
                    {format(day, "d")}
                  </div>
                  {today && (
                    <span className="inline-block text-[10px] font-semibold text-brand-primary bg-brand-primary/10 rounded-full px-2 py-0.5">
                      {i18n.language === "pt" ? "HOJE" : "TODAY"}
                    </span>
                  )}
                </div>

                {/* Entries */}
                <div className="space-y-2">
                  {isSunday && entries.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center italic">
                      {i18n.language === "pt" ? "Encerrado" : "Closed"}
                    </p>
                  ) : entries.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center italic">
                      {i18n.language === "pt"
                        ? "Sem disponibilidade"
                        : "No availability"}
                    </p>
                  ) : (
                    entries.map((entry, idx) => (
                      <div
                        key={`${entry.name}-${idx}`}
                        className={`rounded-lg p-2 text-xs ${
                          entry.type === "specialist"
                            ? "bg-brand-primary/10 border border-brand-primary/20"
                            : "bg-emerald-50 border border-emerald-200"
                        }`}
                      >
                        <div className="font-semibold truncate flex items-center gap-1">
                          {entry.type === "specialist" ? (
                            <Stethoscope className="w-3 h-3 flex-shrink-0" />
                          ) : (
                            <User className="w-3 h-3 flex-shrink-0" />
                          )}
                          <span className="truncate">{entry.name}</span>
                        </div>
                        <div className="text-muted-foreground truncate">
                          {i18n.language === "pt" ? entry.labelPt : entry.labelEn}
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground mt-0.5">
                          <Clock className="w-3 h-3" />
                          {entry.time}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile: Stacked list */}
        <div className="md:hidden space-y-3">
          {weekDays.map((day) => {
            const key = format(day, "yyyy-MM-dd");
            const entries = calendarData.get(key) || [];
            const today = isToday(day);
            const isSunday = day.getDay() === 0;

            return (
              <div
                key={key}
                className={`rounded-xl border overflow-hidden ${
                  today
                    ? "border-brand-primary ring-2 ring-brand-primary/20"
                    : isSunday
                      ? "border-muted opacity-60"
                      : "border-muted"
                }`}
              >
                {/* Day header bar */}
                <div
                  className={`flex items-center justify-between px-4 py-2.5 ${
                    today ? "bg-brand-primary text-white" : "bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">{format(day, "d")}</span>
                    <span className="font-medium">
                      {format(day, "EEEE", { locale })}
                    </span>
                    {today && (
                      <span className="text-[10px] font-bold bg-white/20 rounded-full px-2 py-0.5">
                        {i18n.language === "pt" ? "HOJE" : "TODAY"}
                      </span>
                    )}
                  </div>
                  <span className="text-sm">
                    {entries.length > 0
                      ? `${entries.length} ${
                          i18n.language === "pt"
                            ? entries.length === 1
                              ? "disponível"
                              : "disponíveis"
                            : "available"
                        }`
                      : isSunday
                        ? i18n.language === "pt"
                          ? "Encerrado"
                          : "Closed"
                        : "—"}
                  </span>
                </div>

                {/* Entries */}
                {entries.length > 0 && (
                  <div className="p-3 space-y-2 bg-white">
                    {entries.map((entry, idx) => (
                      <div
                        key={`${entry.name}-${idx}`}
                        className={`flex items-center gap-3 rounded-lg p-3 ${
                          entry.type === "specialist"
                            ? "bg-brand-primary/5 border border-brand-primary/15"
                            : "bg-emerald-50 border border-emerald-200/50"
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            entry.type === "specialist"
                              ? "bg-brand-primary/15 text-brand-primary"
                              : "bg-emerald-100 text-emerald-600"
                          }`}
                        >
                          {entry.type === "specialist" ? (
                            <Stethoscope className="w-4 h-4" />
                          ) : (
                            <User className="w-4 h-4" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm truncate">
                            {entry.name}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            {i18n.language === "pt" ? entry.labelPt : entry.labelEn}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                          <Clock className="w-3 h-3" />
                          {entry.time}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-brand-primary/15 border border-brand-primary/30" />
            <span>{i18n.language === "pt" ? "Especialista" : "Specialist"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-emerald-50 border border-emerald-200" />
            <span>{i18n.language === "pt" ? "Serviço" : "Service"}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
