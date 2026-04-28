import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Hash } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { astroGetUserNumerology } from "@/lib/api";
import EmptyState from "@/components/EmptyState";

const Numerology = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    astroGetUserNumerology()
      .then((response) => {
        setData(response.data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
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

  if (error || !data) {
    return (
      <div className="max-w-6xl mx-auto">
        <Link to="/portal/reports" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Volver a reportes
        </Link>
        <EmptyState icon={Hash} message={error || "No hay numerología."} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <Link to="/portal/reports" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" /> Volver a reportes
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-6">
        {/* Life Path Number */}
        {data.lifePathNumber && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card rounded-2xl p-8 premium-shadow">
            <div className="text-center">
              <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3">Tu número personal</p>
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border-2 border-primary/30 flex items-center justify-center mx-auto mb-4">
                <span className="font-number text-5xl text-primary">{data.lifePathNumber}</span>
              </div>
              <h3 className="font-serif text-2xl text-foreground mb-2">Número de Camino de Vida</h3>
              <p className="text-muted-foreground max-w-xl mx-auto">{data.interpretation || "Tu número de camino de vida representa tu propósito y misión en la vida."}</p>
            </div>
          </motion.div>
        )}

        {/* Additional Numbers */}
        {data.destinyNumber && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid md:grid-cols-2 gap-6">
            <div className="glass-card rounded-2xl p-6 premium-shadow">
              <p className="text-xs tracking-widest uppercase text-primary mb-2">Número del Destino</p>
              <p className="text-4xl font-serif text-primary font-bold mb-2">{data.destinyNumber}</p>
              <p className="text-muted-foreground text-sm">Tu potencial y lo que el universo te propone.</p>
            </div>
            
            {data.soulUrgeNumber && (
              <div className="glass-card rounded-2xl p-6 premium-shadow">
                <p className="text-xs tracking-widest uppercase text-primary mb-2">Número del Alma</p>
                <p className="text-4xl font-serif text-primary font-bold mb-2">{data.soulUrgeNumber}</p>
                <p className="text-muted-foreground text-sm">Lo que tu alma desea expresar.</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Birth Date Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card rounded-2xl p-6 premium-shadow">
          <p className="text-xs tracking-widest uppercase text-muted-foreground mb-2">Información Base</p>
          <p className="text-foreground"><strong>Fecha de Nacimiento:</strong> {data.birthDate}</p>
          {data.name && <p className="text-foreground mt-1"><strong>Nombre:</strong> {data.name}</p>}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Numerology;
