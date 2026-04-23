import { motion } from "framer-motion";
import { CreditCard, Calendar, Receipt, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  apiCancelMercadoPagoSubscription,
  apiCancelPayPalSubscription,
  portalGetMyOrders,
  portalGetProfile,
  type PortalOrder,
  type PortalProfile,
} from "@/lib/api";
import EmptyState from "@/components/EmptyState";

function formatOrderDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return iso;
  }
}

function formatAmount(amount: string) {
  if (!amount) return "—";
  const n = amount.replace(/[^0-9.,]/g, "").replace(",", ".");
  const num = parseFloat(n);
  if (Number.isNaN(num)) return amount;
  return `$${num.toFixed(2)} USD`;
}

function planLabelFromType(type: string) {
  const labels: Record<string, string> = {
    monthly: "Plan Mensual",
    month: "Plan Mensual",
    mensual: "Plan Mensual",
    annual: "Plan Anual",
    year: "Plan Anual",
    anual: "Plan Anual",
  };
  return labels[type?.toLowerCase()] ?? type ?? "Plan";
}

function nextRenewalFromLastOrder(createdAt: string, type: string) {
  try {
    const d = new Date(createdAt);
    if (
      type?.toLowerCase().includes("month") ||
      type?.toLowerCase() === "monthly" ||
      type?.toLowerCase() === "mensual" ||
      type?.toLowerCase() === "annual" ||
      type?.toLowerCase() === "year" ||
      type?.toLowerCase() === "anual"
    ) {
      d.setMonth(d.getMonth() + 1);
    } else {
      d.setFullYear(d.getFullYear() + 1);
    }
    return d.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return null;
  }
}

const Subscription = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<PortalProfile | null>(null);
  const [orders, setOrders] = useState<PortalOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    Promise.all([portalGetProfile(), portalGetMyOrders()]).then(([p, o]) => {
      setProfile(p ?? null);
      setOrders(Array.isArray(o) ? o : []);
      setLoading(false);
    });
  }, []);

  const handleCancelSubscription = async () => {
    if (cancelling || status !== "active") return;
    const confirm = window.confirm("¿Seguro que quieres cancelar tu suscripción?");
    if (!confirm) return;

    try {
      setCancelling(true);
      const latestMethod = (orders[0]?.method ?? "").toLowerCase();
      if (latestMethod === "mercado_pago") {
        const mpSubscriptionId = localStorage.getItem("astar_mp_subscription_id") ?? "";
        if (!mpSubscriptionId) {
          throw new Error("No encontramos el identificador de suscripción de Mercado Pago.");
        }
        await apiCancelMercadoPagoSubscription(mpSubscriptionId);
      } else {
        await apiCancelPayPalSubscription();
      }
      const updatedProfile = await portalGetProfile();
      setProfile(updatedProfile);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "No se pudo cancelar la suscripción.";
      window.alert(message);
    } finally {
      setCancelling(false);
    }
  };

  const handleUpdatePaymentMethod = () => {
    const proceed = window.confirm(
      "Te llevaremos al checkout para actualizar tu método de pago. ¿Deseas continuar?",
    );
    if (!proceed) return;

    navigate("/subscribe");
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const status = profile?.subscriptionStatus ?? "inactive";
  const lastOrder = orders[0] ?? null;
  const planLabel = lastOrder ? planLabelFromType(lastOrder.type) : "Plan";
  const planAmount = lastOrder ? formatAmount(lastOrder.amount) : null;
  const nextRenewal = lastOrder && status === "active" ? nextRenewalFromLastOrder(lastOrder.createdAt, lastOrder.type) : null;

  return (
    <div className="max-w-6xl mx-auto">

      {/* Current plan */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-8 premium-shadow border border-primary/20 mb-8">
        <div className="flex items-center gap-4 mb-4">
          <CreditCard className="w-8 h-8 text-primary" />
          <div>
            <p className="text-xs tracking-widest uppercase text-primary">
              {status === "active" ? "Plan Activo" : status === "cancelled" ? "Suscripción cancelada" : "Suscripción inactiva"}
            </p>
            <p className="text-2xl text-foreground">
              {planLabel}
              {planAmount != null && (
                <span className="tabular-nums font-semibold ml-1">— {planAmount}</span>
              )}
            </p>
          </div>
        </div>
        {nextRenewal && status === "active" && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Calendar className="w-4 h-4" />
            Próxima renovación: {nextRenewal}
          </div>
        )}
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={handleUpdatePaymentMethod}
            className="px-6 py-2.5 rounded-xl border border-border/50 text-foreground text-sm hover:bg-accent/50 transition-colors"
          >
            Actualizar Método de Pago
          </button>
          <button
            onClick={handleCancelSubscription}
            disabled={status !== "active" || cancelling}
            className="px-6 py-2.5 rounded-xl border border-destructive/30 text-destructive text-sm hover:bg-destructive/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelling ? "Cancelando..." : "Cancelar Suscripción"}
          </button>
        </div>
      </motion.div>

      {/* Payment history */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-2xl p-6 premium-shadow">
        <h3 className="font-serif text-xl text-foreground mb-4 flex items-center gap-2">
          <Receipt className="w-5 h-5 text-primary" /> Historial de Pagos
        </h3>
        {orders.length === 0 ? (
          <EmptyState icon={Receipt} message="No hay pagos registrados." className="py-8" />
        ) : (
          <div className="space-y-3">
            {orders.map((o) => (
              <div key={o.id} className="flex items-center justify-between text-sm py-3 border-b border-border/30 last:border-0">
                <span className="text-muted-foreground">{formatOrderDate(o.createdAt)}</span>
                <span className="text-foreground tabular-nums">{formatAmount(o.amount)}</span>
                <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">Pagado</span>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Subscription;
