import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sun, Moon, Hash, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { portalGetReports } from "@/lib/api";

const defaultReportTypes = [
  { type: "birth_chart", to: "/portal/reports/birth-chart", icon: Sun, title: "Carta Natal", desc: "Tu mapa astral permanente con interpretación de planetas, casas y aspectos.", status: "Disponible" },
  { type: "solar_return", to: "/portal/reports/solar-return", icon: Moon, title: "Revolución Solar", desc: "Tu carta solar anual con los temas y energías del año en curso.", status: "Disponible" },
  { type: "numerology", to: "/portal/reports/numerology", icon: Hash, title: "Numerología", desc: "Número de camino de vida, año personal y vibraciones numéricas.", status: "Disponible" },
];

const Reports = () => {
  const [reports, setReports] = useState<{ id: string; type: string; title: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    portalGetReports()
      .then(setReports)
      .finally(() => setLoading(false));
  }, []);

  const hasReportByType = (type: string) => reports.some((r) => r.type === type);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {defaultReportTypes.map((r, i) => (
          <motion.div key={r.to} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Link to={r.to} className="block glass-card rounded-2xl p-8 premium-shadow hover-lift group h-full">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <r.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-serif text-xl text-foreground mb-2 group-hover:text-primary transition-colors">{r.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{r.desc}</p>
              <span className="text-xs text-primary font-medium tracking-widest uppercase">
                {hasReportByType(r.type) ? "Disponible" : "Ver reporte"}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Reports;
