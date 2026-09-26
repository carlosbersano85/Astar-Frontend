import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, ChevronRight, Crosshair, Loader2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { portalGetReportByType } from "@/lib/api";
import EmptyState from "@/components/EmptyState";

type MomentItem = {
  id: string;
  title: string;
  theme?: string;
  startDate?: string;
  endDate?: string;
  intensity?: number;
  summary: string;
  details?: string;
  focus?: string;
};

function parseDate(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(value?: string) {
  const date = parseDate(value);
  if (!date) return value ?? "";
  return date.toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" });
}

function normaliseMoments(content: string | null | undefined, fallbackTitle: string): MomentItem[] {
  if (!content) return [];

  try {
    const parsed = JSON.parse(content);
    const source = Array.isArray(parsed)
      ? parsed
      : Array.isArray(parsed?.moments)
        ? parsed.moments
        : Array.isArray(parsed?.sections)
          ? parsed.sections
          : [];

    if (source.length > 0) {
      return source.map((item: any, index: number) => {
        const intensityRaw = Number(item?.intensity ?? item?.score ?? item?.level);
        const intensity = Number.isFinite(intensityRaw)
          ? Math.max(1, Math.min(10, Math.round(intensityRaw)))
          : undefined;

        return {
          id: String(item?.id ?? `moment-${index}`),
          title: String(item?.title ?? item?.name ?? item?.theme ?? `Momento ${index + 1}`),
          theme: item?.theme ?? item?.category ?? item?.topic,
          startDate: item?.startDate ?? item?.date ?? item?.from ?? item?.periodStart,
          endDate: item?.endDate ?? item?.to ?? item?.periodEnd,
          intensity,
          summary: String(item?.summary ?? item?.content ?? item?.description ?? item?.interpretation ?? ""),
          details: item?.details ?? item?.guidance ?? item?.orientation ?? item?.technicalReason,
          focus: item?.chartFocus ?? item?.focus ?? item?.technicalReason ?? item?.title ?? item?.name,
        };
      });
    }
  } catch {
    // El contenido histórico puede ser texto plano. Se conserva como panorama general.
  }

  return [{
    id: "transits-overview",
    title: fallbackTitle || "Panorama de tránsitos",
    summary: content,
    focus: fallbackTitle,
  }];
}

export default function ImportantMoments() {
  const [report, setReport] = useState<{ title: string; content: string | null } | null>(null);
  const [loading, setLoading] = useState(true);
  const [months, setMonths] = useState<3 | 6 | 12>(3);

  useEffect(() => {
    portalGetReportByType("transits")
      .then((result) => setReport(result ?? null))
      .finally(() => setLoading(false));
  }, []);

  const moments = useMemo(
    () => normaliseMoments(report?.content, report?.title ?? "Tus próximos momentos"),
    [report]
  );

  const visibleMoments = useMemo(() => {
    const now = new Date();
    const limit = new Date(now);
    limit.setMonth(limit.getMonth() + months);

    return [...moments]
      .filter((moment) => {
        const date = parseDate(moment.startDate);
        if (!date) return true;
        return date <= limit;
      })
      .sort((a, b) => {
        const aDate = parseDate(a.startDate)?.getTime() ?? Number.MAX_SAFE_INTEGER;
        const bDate = parseDate(b.startDate)?.getTime() ?? Number.MAX_SAFE_INTEGER;
        return aDate - bDate;
      });
  }, [moments, months]);

  if (loading) {
    return (
      <div className="mx-auto flex max-w-6xl items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="mx-auto max-w-6xl">
        <EmptyState icon={CalendarDays} message="Tus próximos momentos todavía no están disponibles." />
        <p className="mx-auto mt-4 max-w-xl text-center text-sm leading-relaxed text-muted-foreground">
          Cuando Astar tenga preparado tu panorama de tránsitos, aquí aparecerán los períodos que merecen especial atención.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-2xl border border-primary/20 bg-card/50 p-6 premium-shadow md:p-8"
      >
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <p className="text-xs uppercase tracking-[0.2em] text-primary">Tus próximos momentos importantes</p>
            </div>
            <h2 className="max-w-3xl font-serif text-3xl text-foreground md:text-4xl">
              Una línea de tiempo para entender cuándo se intensifica cada tema.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Astar reúne tus períodos relevantes y los presenta como momentos comprensibles: qué se activa, cuándo y dónde verlo en tu carta.
            </p>
          </div>

          <div className="inline-flex rounded-xl border border-border/40 bg-background/40 p-1">
            {[3, 6, 12].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setMonths(value as 3 | 6 | 12)}
                className={`rounded-lg px-3 py-2 text-xs transition-colors ${
                  months === value ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {value} meses
              </button>
            ))}
          </div>
        </div>
      </motion.section>

      <section className="relative">
        <div className="absolute bottom-6 left-[11px] top-6 w-px bg-gradient-to-b from-primary/55 via-primary/20 to-transparent md:left-[15px]" />

        <div className="space-y-5">
          {visibleMoments.map((moment, index) => {
            const focus = moment.focus || moment.title;
            const period =
              moment.startDate && moment.endDate
                ? `${formatDate(moment.startDate)} — ${formatDate(moment.endDate)}`
                : moment.startDate
                  ? formatDate(moment.startDate)
                  : "Período destacado";

            return (
              <motion.article
                key={moment.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative pl-9 md:pl-12"
              >
                <div className="absolute left-0 top-7 flex h-[23px] w-[23px] items-center justify-center rounded-full border border-primary/50 bg-background shadow-[0_0_20px_hsl(var(--primary)/0.16)] md:h-[31px] md:w-[31px]">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                </div>

                <div className="rounded-2xl border border-border/40 bg-card/45 p-5 transition-colors hover:border-primary/25 md:p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-primary">
                      {period}
                    </span>
                    {moment.theme && (
                      <span className="rounded-full border border-border/45 px-3 py-1 text-[11px] text-muted-foreground">
                        {moment.theme}
                      </span>
                    )}
                    {moment.intensity != null && (
                      <span className="ml-auto text-xs text-muted-foreground">
                        Intensidad <strong className="font-medium text-foreground">{moment.intensity}/10</strong>
                      </span>
                    )}
                  </div>

                  <h3 className="mt-4 font-serif text-2xl text-foreground">{moment.title}</h3>
                  <p className="mt-3 max-w-3xl whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
                    {moment.summary}
                  </p>

                  {moment.details && (
                    <div className="mt-4 rounded-xl border border-border/35 bg-background/30 p-4 text-sm leading-6 text-muted-foreground">
                      {moment.details}
                    </div>
                  )}

                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link
                      to={`/portal/reports/birth-chart?focus=${encodeURIComponent(focus)}`}
                      className="inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-4 py-2.5 text-sm text-primary transition-colors hover:bg-primary/15"
                    >
                      <Crosshair className="h-4 w-4" />
                      Ver en mi carta
                    </Link>
                    <Link
                      to="/portal/questions"
                      className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent/40 hover:text-foreground"
                    >
                      Comprender este momento
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {visibleMoments.length === 0 && (
          <div className="rounded-2xl border border-border/40 bg-card/45 p-8 text-center text-sm text-muted-foreground">
            En este rango todavía no hay períodos destacados cargados.
          </div>
        )}
      </section>
    </div>
  );
}
