import { motion } from "framer-motion";
import { LayoutDashboard, Users, CreditCard, HelpCircle, Mail, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { adminGetStats, type AdminStats } from "@/lib/api";
import EmptyState from "@/components/EmptyState";

const subscriptionPieColors = { Activas: "hsl(38, 70%, 55%)", Inactivas: "hsl(225, 15%, 40%)", Canceladas: "hsl(0, 50%, 45%)" };

const tooltipStyle = {
  contentStyle: {
    background: "hsl(225, 25%, 10%)",
    border: "1px solid hsl(225, 15%, 18%)",
    borderRadius: "12px",
    fontSize: "12px",
    color: "hsl(40, 20%, 90%)",
  },
};

const AdminDashboard = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [statsError, setStatsError] = useState<string | null>(null);

  useEffect(() => {
    adminGetStats()
      .then(setStats)
      .catch((e) => setStatsError(e instanceof Error ? e.message : "Error al cargar estadísticas"));
  }, []);

  const kpiCards = stats
    ? [
        { icon: Users, label: "Usuarios (clientes)", value: String(stats.totalUsers), up: true },
        { icon: CreditCard, label: "Suscripciones Activas", value: String(stats.activeSubscriptions), up: true },
        { icon: HelpCircle, label: "Suscripciones Inactivas", value: String(stats.inactiveSubscriptions), up: false },
        { icon: Mail, label: "Suscripciones Canceladas", value: String(stats.cancelledSubscriptions), up: false },
      ]
    : [];

  const subscriptionPieData = stats
    ? [
        { name: "Activas", value: stats.activeSubscriptions, color: subscriptionPieColors.Activas },
        { name: "Inactivas", value: stats.inactiveSubscriptions, color: subscriptionPieColors.Inactivas },
        { name: "Canceladas", value: stats.cancelledSubscriptions, color: subscriptionPieColors.Canceladas },
      ].filter((d) => d.value > 0)
    : [];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {statsError && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm">
          {statsError}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats === null && !statsError ? (
          <div className="col-span-full flex items-center justify-center py-12 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          kpiCards.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card rounded-2xl p-6 premium-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <s.icon className="w-5 h-5 text-primary" />
              </div>
              <p className="font-sans text-3xl text-foreground tabular-nums">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </motion.div>
          ))
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-2xl p-6 premium-shadow"
      >
        <h3 className="font-serif text-lg text-foreground mb-4">Estado de Suscripciones</h3>
        {subscriptionPieData.length === 0 ? (
          <EmptyState icon={LayoutDashboard} message="No hay datos en el panel." />
        ) : (
          <>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={subscriptionPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {subscriptionPieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip {...tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2 flex-wrap">
              {subscriptionPieData.map((d) => (
                <div key={d.name} className="flex items-center gap-2 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                  <span className="text-muted-foreground">
                    {d.name}: {d.value}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
