import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { XCircle } from "lucide-react";

const SubscribeMercadoPagoCancel = () => {
  return (
    <section className="min-h-[75vh] px-6 py-20 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full glass-card rounded-2xl p-8 premium-shadow text-center"
      >
        <XCircle className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
        <h1 className="font-serif text-3xl mb-3 text-foreground">Pago cancelado</h1>
        <p className="text-muted-foreground mb-6">
          No se realizó ningún cargo. Puedes volver a intentar cuando quieras.
        </p>

        <div className="flex justify-center gap-3 flex-wrap">
          <Link to="/#subscription" className="px-6 py-3 rounded-xl shimmer-gold text-primary-foreground text-sm font-medium">
            Elegir plan otra vez
          </Link>
          <Link to="/" className="px-6 py-3 rounded-xl border border-border/60 text-sm hover:bg-accent/40 transition-colors">
            Volver al inicio
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

export default SubscribeMercadoPagoCancel;
