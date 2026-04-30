import { motion } from "framer-motion";
import { Check, Shield, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  apiCreateMercadoPagoSubscription,
  apiCreatePayPalSubscription,
} from "@/lib/api";

const plans = [
  {
    name: "Free",
    icon: Shield,
    price: 0,
    tagline: "Acceso gratuito al portal",
    cta: "Empezar gratis",
    highlighted: false,
    paid: false,
    features: [
      "Acceso básico al portal",
      "Lecturas iniciales",
      "Explora tu recorrido personal",
    ],
  },
  {
    name: "Luminary",
    icon: Star,
    price: 29,
    tagline: "Acompañamiento humano mensual",
    cta: "Elegir Luminary",
    highlighted: true,
    paid: true,
    features: [
      "Todo lo de Free, más:",
      "1 respuesta humana mensual",
      "Chatbot de Astar entrenado por Carlos",
      "Precio especial en servicios",
      "Acceso completo al portal",
    ],
  },
];

const PricingSection = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubscribe = async (provider: "paypal" | "mercado_pago") => {
    if (!isAuthenticated) {
      toast({
        title: "Inicia sesión para continuar",
        description: "Necesitas una cuenta para activar Luminary.",
      });
      navigate("/login", { state: { subscriptionIntent: { plan: "portal", billing: "monthly", provider } } });
      return;
    }

    try {
      const result = provider === "paypal"
        ? await apiCreatePayPalSubscription({ plan: "portal", billing: "monthly" })
        : await apiCreateMercadoPagoSubscription({ plan: "portal", billing: "monthly" });
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
    }
  };

  return (
    <section id="subscription" className="relative py-32 px-6">
      <div className="absolute inset-0 section-glow pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <p className="text-sm tracking-[0.3em] uppercase text-primary mb-4">Suscripción Mensual</p>
          <h2 className="font-serif text-4xl md:text-6xl font-light mb-6">
            Un espacio
            <br />
            <span className="text-gradient-gold italic">que crece contigo</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
          Tu vida cambia, tus decisiones cambian, tus ciclos también. Este espacio guarda, interpreta y acompaña cada etapa de tu proceso.
          </p>
        </motion.div>

        {/* Plans grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              whileHover={{ y: -6 }}
              className={`relative overflow-hidden rounded-2xl p-8 flex flex-col transition-all duration-300 ${plan.highlighted
                  ? "border-2 border-primary/70 glass-card premium-shadow-lg shadow-[0_0_0_2px_hsl(var(--primary)/0.7),0_0_32px_hsl(var(--primary)/0.24),inset_0_0_0_1px_hsl(var(--primary)/0.7)] before:content-[''] before:absolute before:inset-[6px] before:rounded-[0.85rem] before:border before:border-primary/70 before:pointer-events-none"
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
                  key={plan.name}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="font-numeric text-5xl font-light text-gradient-gold inline-block tabular-nums"
                >
                  ${plan.price}
                </motion.span>
                <span className="text-muted-foreground text-sm ml-2">{plan.name === "Free" ? "USD" : "USD / mes"}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-8">{plan.tagline}</p>

              {/* CTA */}
              <div className="space-y-3 mb-8">
                {plan.paid ? (
                  <>
                    <button
                      onClick={() => handleSubscribe("paypal")}
                      className={`w-full py-3.5 rounded-xl font-medium tracking-wide text-sm transition-all duration-300 ${plan.highlighted
                          ? "shimmer-gold text-primary-foreground hover:opacity-90 glow-gold"
                          : "border border-border text-foreground hover:border-primary/50 hover:bg-primary/5"
                        } disabled:opacity-60 disabled:cursor-not-allowed`}
                    >
                      {plan.cta} con PayPal
                    </button>
                    <button
                      onClick={() => handleSubscribe("mercado_pago")}
                      className="w-full py-3.5 rounded-xl border border-border/50 text-foreground hover:border-primary/50 hover:bg-primary/5 font-medium tracking-wide text-sm transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {plan.cta} con Mercado Pago
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => navigate("/register")}
                    className="w-full py-3.5 rounded-xl border border-border/50 text-foreground hover:border-primary/50 hover:bg-primary/5 font-medium tracking-wide text-sm transition-all duration-300"
                  >
                    Crear cuenta gratis
                  </button>
                )}
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-8 p-6 rounded-xl glass-card text-center premium-shadow"
        >
          <p className="text-sm text-muted-foreground">
            Free is available to everyone. Luminary unlocks the full experience for $29 USD/month.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
