import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Crosshair, Loader2, MapPin, Sun } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { astroGetUserNatalChart, portalGetProfile, portalGetReportByType } from "@/lib/api";
import { format, parse } from "date-fns";
import EmptyState from "@/components/EmptyState";
import InteractiveNatalChart from "@/components/portal/InteractiveNatalChart";

const BirthChart = () => {
  const [searchParams] = useSearchParams();
  const [report, setReport] = useState<{ id: string; type: string; title: string; content: string | null } | null>(null);
  const [profile, setProfile] = useState<{ birthDate: string | null; birthPlace: string | null; birthTime: string | null } | null>(null);
  const [rawChart, setRawChart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeFocus, setActiveFocus] = useState(searchParams.get("focus") ?? "");

  useEffect(() => {
    const requestedFocus = searchParams.get("focus") ?? "";
    setActiveFocus(requestedFocus);
  }, [searchParams]);

  useEffect(() => {
    Promise.allSettled([
      portalGetReportByType("birth_chart"),
      portalGetProfile(),
      astroGetUserNatalChart(),
    ]).then(([reportResult, profileResult, chartResult]) => {
      if (reportResult.status === "fulfilled") setReport(reportResult.value ?? null);
      if (profileResult.status === "fulfilled") setProfile(profileResult.value ?? null);
      if (chartResult.status === "fulfilled") {
        const response = chartResult.value as any;
        setRawChart(response?.data ?? response ?? null);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!report && !rawChart) {
    return (
      <div className="max-w-6xl mx-auto">
        <Link to="/portal/reports" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Volver a reportes
        </Link>
        <EmptyState icon={Sun} message="No hay carta natal." />
      </div>
    );
  }

  const birthDateFormatted = profile?.birthDate ? (() => {
    try {
      return format(parse(profile.birthDate, "yyyy-MM-dd", new Date()), "d 'de' MMMM, yyyy");
    } catch {
      return profile.birthDate;
    }
  })() : "—";
  const birthTimeFormatted = profile?.birthTime ? `${profile.birthTime} hs` : "—";
  const birthPlaceFormatted = profile?.birthPlace || "—";

  let sections: { id: string; title: string; content: string }[] = [];
  if (report?.content) {
    try {
      const parsed = JSON.parse(report.content);
      sections = Array.isArray(parsed)
        ? parsed
        : parsed.sections
          ? parsed.sections
          : [{ id: "main", title: "Interpretación", content: report.content }];
    } catch {
      sections = [{ id: "main", title: "Interpretación", content: report.content }];
    }
  }

  const focusSection = (title: string, content: string) => {
    setActiveFocus(`${title}. ${content.slice(0, 220)}`);
    requestAnimationFrame(() => {
      document.getElementById("natal-chart-interactive")?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <Link to="/portal/reports" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver a reportes
        </Link>
        <Link
          to="/portal/moments"
          className="inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-3.5 py-2 text-sm text-primary transition-colors hover:bg-primary/10"
        >
          <Calendar className="h-4 w-4" />
          Próximos momentos
        </Link>
      </div>

      <motion.div
        id="natal-chart-interactive"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-2xl p-4 sm:p-6 premium-shadow mb-8"
      >
        <div className="mb-5">
          <div className="flex items-center gap-2">
            <Crosshair className="h-4 w-4 text-primary" />
            <p className="text-xs uppercase tracking-[0.18em] text-primary">Carta interactiva</p>
          </div>
          <h2 className="mt-2 font-serif text-2xl text-foreground">Mira exactamente de qué habla cada interpretación.</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Al elegir “Ver en mi carta”, Astar ilumina los planetas, casas y aspectos relacionados.
          </p>
        </div>

        {rawChart ? (
          <InteractiveNatalChart data={rawChart} focusText={activeFocus} />
        ) : (
          <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-border/35 bg-background/25 p-8 text-center">
            <div>
              <Sun className="mx-auto h-8 w-8 text-primary" />
              <p className="mt-3 text-sm text-foreground">La interpretación está disponible.</p>
              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                La visualización interactiva se activará cuando el cálculo estructurado de tu carta esté disponible.
              </p>
            </div>
          </div>
        )}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { icon: Calendar, label: "Fecha de Nacimiento", value: birthDateFormatted },
          { icon: Clock, label: "Hora de Nacimiento", value: birthTimeFormatted },
          { icon: MapPin, label: "Lugar de Nacimiento", value: birthPlaceFormatted },
        ].map((info) => (
          <div key={info.label} className="glass-card rounded-xl p-4 premium-shadow flex items-center gap-3">
            <info.icon className="w-5 h-5 text-primary shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">{info.label}</p>
              <p className="text-sm text-foreground font-medium">{info.value}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {sections.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-2xl p-6 premium-shadow">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Lectura personal</p>
              <h3 className="mt-1 font-serif text-xl text-foreground">Interpretación</h3>
            </div>
            {activeFocus && (
              <button
                type="button"
                onClick={() => setActiveFocus("")}
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                Quitar foco
              </button>
            )}
          </div>

          <div className="space-y-5">
            {sections.map((section) => (
              <div key={section.id} className="border-b border-border/30 last:border-0 pb-5 last:pb-0">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="font-serif text-foreground mb-2">{section.title}</p>
                    <p className="text-muted-foreground leading-relaxed text-sm whitespace-pre-wrap">{section.content}</p>
                  </div>
                  {rawChart && (
                    <button
                      type="button"
                      onClick={() => focusSection(section.title, section.content)}
                      className="inline-flex shrink-0 items-center gap-2 self-start rounded-xl border border-primary/25 bg-primary/5 px-3 py-2 text-xs text-primary transition-colors hover:bg-primary/10"
                    >
                      <Crosshair className="h-3.5 w-3.5" />
                      Ver en mi carta
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default BirthChart;
