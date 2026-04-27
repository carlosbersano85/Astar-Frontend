import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Check, Shield, Star, Crown } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  apiCreateMercadoPagoSubscription,
  apiCreatePayPalSubscription,
  type SubscriptionPlan,
} from "@/lib/api";
import { PrivacyPolicyModal } from "@/components/legal/LegalDocumentsModal";
import { TermsModal } from "@/components/legal/LegalDocumentsModal";

const plans = [
  {
    name: "Essentials",
    icon: Shield,
    price: { monthly: 19, annual: 15 },
    tagline: "Ideal para explorar tu mapa simbólico",
    highlighted: false,
    features: [
      "Carta natal completa (acceso permanente)",
      "Reporte de numerología personal",
      "Reportes simbólicos base",
      "Acceso al portal con historial completo",
      "Soporte comunitario",
    ],
  },
  {
    name: "Portal",
    icon: Star,
    price: { monthly: 39, annual: 29 },
    tagline: "Guía completa con acompañamiento humano",
    highlighted: true,
    features: [
      "Todo de Essentials, más:",
      "Revolución solar del año en curso",
      "Mensaje mensual personalizado",
      "1 pregunta mensual con respuesta humana",
      "Soporte prioritario por email",
      "Acceso anticipado a nuevas funciones",
    ],
  },
  {
    name: "Depth",
    icon: Crown,
    price: { monthly: 79, annual: 59 },
    tagline: "Máxima profundidad con soporte dedicado",
    highlighted: false,
    features: [
      "Todo de Portal, más:",
      "3 preguntas mensuales con respuesta humana",
      "1 sesión privada por mes",
      "Reportes simbólicos extendidos",
      "Guía dedicada",
      "Agendamiento de sesiones personalizado",
    ],
  },
];

const Subscribe = () => {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const [loadingPlan, setLoadingPlan] = useState<SubscriptionPlan | null>(null);
  const [loadingProvider, setLoadingProvider] = useState<"paypal" | "mercado_pago" | null>(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const planKeyByName: Record<string, SubscriptionPlan> = {
    Essentials: "essentials",
    Portal: "portal",
    Depth: "depth",
  };

  const handleSubscribe = async (planName: string, provider: "paypal" | "mercado_pago") => {
    const plan = planKeyByName[planName];
    if (!plan) return;

    if (!isAuthenticated) {
      toast({
        title: "Inicia sesión para continuar",
        description: "Necesitas una cuenta para activar tu suscripción.",
      });
      navigate("/login", { state: { subscriptionIntent: { plan, billing, provider } } });
      return;
    }

    try {
      setLoadingPlan(plan);
      setLoadingProvider(provider);
      const result = provider === "paypal"
        ? await apiCreatePayPalSubscription({ plan, billing })
        : await apiCreateMercadoPagoSubscription({ plan, billing });
      if (provider === "mercado_pago") {
        localStorage.setItem("astar_mp_subscription_id", result.subscriptionId);
      }
      window.location.assign(result.approvalUrl);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "No se pudo iniciar el pago.";
      toast({
        title: provider === "paypal" ? "Error con PayPal" : "Error con Mercado Pago",
        description: message,
        variant: "destructive",
      });
      setLoadingPlan(null);
      setLoadingProvider(null);
    }
  };

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="font-serif text-5xl md:text-6xl text-gradient-gold font-semibold mb-4">Suscripción</h1>
          <p className="text-muted-foreground">Tu acompañamiento astrológico personalizado, cada mes.</p>
        </motion.div>

        {/* Billing toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-center gap-1 mb-16"
        >
          <button
            onClick={() => setBilling("monthly")}
            className={`px-6 py-2.5 rounded-full text-sm font-medium tracking-wide transition-all duration-300 ${
              billing === "monthly"
                ? "bg-primary/20 border border-primary/50 text-primary"
                : "border border-border/50 text-muted-foreground hover:text-foreground"
            }`}
          >
            Pago Mensual
          </button>
          <button
            onClick={() => setBilling("annual")}
            className={`px-6 py-2.5 rounded-full text-sm font-medium tracking-wide transition-all duration-300 ${
              billing === "annual"
                ? "bg-primary/20 border border-primary/50 text-primary"
                : "border border-border/50 text-muted-foreground hover:text-foreground"
            }`}
          >
            Pago Anual
          </button>
        </motion.div>

        {/* Plans grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.1 }}
              whileHover={{ y: -6 }}
              className={`relative overflow-hidden rounded-2xl p-8 flex flex-col transition-all duration-300 ${
                plan.highlighted
                  ? "border-2 border-primary/70 glass-card premium-shadow-lg ring-2 ring-primary/70 ring-offset-2 ring-offset-background shadow-[0_0_0_2px_hsl(var(--primary)/0.7),0_0_32px_hsl(var(--primary)/0.24),inset_0_0_0_1px_hsl(var(--primary)/0.7)] before:content-[''] before:absolute before:inset-[6px] before:rounded-[0.85rem] before:border before:border-primary/70 before:pointer-events-none"
                  : "border border-border/70 glass-card hover:border-primary/30 premium-shadow"
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-2xl font-medium">{plan.name}</h3>
                <plan.icon className={`w-5 h-5 ${plan.highlighted ? "text-primary" : "text-muted-foreground"}`} />
              </div>

              {/* Price */}
              <div className="mb-2">
                <motion.span
                  key={`${plan.name}-${billing}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="font-sans text-5xl font-light text-gradient-gold inline-block tabular-nums"
                >
                  ${plan.price[billing]}
                </motion.span>
                <span className="text-muted-foreground text-sm ml-2">USD / mes</span>
              </div>
              <p className="text-sm text-muted-foreground mb-8">{plan.tagline}</p>

              {/* CTA Buttons */}
              <div className="space-y-3 mb-8">
                <button
                  onClick={() => handleSubscribe(plan.name, "paypal")}
                  disabled={loadingPlan === planKeyByName[plan.name]}
                  className={`w-full py-3.5 rounded-xl font-medium tracking-wide text-sm transition-all duration-300 ${
                    plan.highlighted
                      ? "shimmer-gold text-primary-foreground hover:opacity-90 glow-gold"
                      : "shimmer-gold text-primary-foreground hover:opacity-90"
                  } disabled:opacity-60 disabled:cursor-not-allowed`}
                >
                  {loadingPlan === planKeyByName[plan.name] && loadingProvider === "paypal"
                    ? "Redirigiendo..."
                    : "Pagar con Paypal"}
                </button>
                <button
                  onClick={() => handleSubscribe(plan.name, "mercado_pago")}
                  disabled={loadingPlan === planKeyByName[plan.name]}
                  className="w-full py-3.5 rounded-xl bg-accent border border-border/50 text-foreground font-medium tracking-wide hover:bg-accent/80 transition-colors text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loadingPlan === planKeyByName[plan.name] && loadingProvider === "mercado_pago"
                    ? "Redirigiendo..."
                    : "Pagar con Mercado Pago"}
                </button>
              </div>

              {/* Divider */}
              <div className="h-px w-full bg-border/50 mb-8" />

              {/* Features */}
              <ul className="space-y-3 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground mb-8">
          Cancela cuando quieras. Sin compromisos.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground mb-8">
          <PrivacyPolicyModal>
            <button className="text-muted-foreground hover:text-primary transition-colors underline-offset-2 hover:underline">
              Política de Privacidad
            </button>
          </PrivacyPolicyModal>
          <span>·</span>
          <TermsModal>
            <button className="text-muted-foreground hover:text-primary transition-colors underline-offset-2 hover:underline">
              Términos y Condiciones
            </button>
          </TermsModal>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          ¿Aún no estás seguro?{" "}
          <Link to="/portal-preview" className="text-primary hover:text-primary/80 transition-colors">
            Mira la vista previa del portal
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Subscribe;
