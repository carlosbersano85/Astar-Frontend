import { motion } from "framer-motion";
import { CreditCard, Calendar, Receipt } from "lucide-react";

const Subscription = () => {
  return (
    <div className="max-w-3xl mx-auto">

      {/* Current plan */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-8 premium-shadow border border-primary/20 mb-8">
        <div className="flex items-center gap-4 mb-4">
          <CreditCard className="w-8 h-8 text-primary" />
          <div>
            <p className="text-xs tracking-widest uppercase text-primary">Plan Activo</p>
            <p className="font-serif text-2xl text-foreground">Plan Mensual — $29 USD</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Calendar className="w-4 h-4" />
          Próxima renovación: 1 de Abril, 2026
        </div>
        <div className="flex gap-3 flex-wrap">
          <button className="px-6 py-2.5 rounded-xl border border-border/50 text-foreground text-sm hover:bg-accent/50 transition-colors">
            Actualizar Método de Pago
          </button>
          <button className="px-6 py-2.5 rounded-xl border border-destructive/30 text-destructive text-sm hover:bg-destructive/10 transition-colors">
            Cancelar Suscripción
          </button>
        </div>
      </motion.div>

      {/* Payment history */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-2xl p-6 premium-shadow">
        <h3 className="font-serif text-xl text-foreground mb-4 flex items-center gap-2">
          <Receipt className="w-5 h-5 text-primary" /> Historial de Pagos
        </h3>
        <div className="space-y-3">
          {[
            { date: "1 Mar 2026", amount: "$29.00 USD", status: "Pagado" },
            { date: "1 Feb 2026", amount: "$29.00 USD", status: "Pagado" },
            { date: "1 Ene 2026", amount: "$29.00 USD", status: "Pagado" },
          ].map((p) => (
            <div key={p.date} className="flex items-center justify-between text-sm py-3 border-b border-border/30 last:border-0">
              <span className="text-muted-foreground">{p.date}</span>
              <span className="text-foreground">{p.amount}</span>
              <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">{p.status}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Subscription;
