import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  apiCreatePayPalServiceOrder,
  apiCreateMercadoPagoServicePreference,
} from "@/lib/api";

const services = [
  {
    id: "current-moment",
    title: "Lectura de tu momento actual + preguntas",
    description:
      "Comprendé qué está pasando en tu vida ahora y por qué. Además, vas a poder hacer preguntas en vivo por chat conmigo, para profundizar y llevar claridad a lo que realmente te está moviendo.",
    emoji: "🔮",
    regular: 260,
    subscriber: 130,
  },
  {
    id: "inner-energy",
    title: "Tu energía interna vs lo que estás mostrando",
    description:
      "Descubrí la diferencia entre quién sos por dentro y lo que estás expresando hacia afuera. Ideal para entender bloqueos, incoherencias y empezar a alinearte.",
    emoji: "🪞",
    regular: 200,
    subscriber: 100,
  },
  {
    id: "making-decision",
    title: "Tomar una decisión",
    description:
      "Si estás frente a una decisión importante, te ayudo a ver qué la está condicionando y desde dónde estás eligiendo. Más claridad para decidir con conciencia.",
    emoji: "⚖️",
    regular: 160,
    subscriber: 80,
  },
  {
    id: "next-6-months",
    title: "Tus próximos movimientos (6 meses)",
    description:
      "Interpretación de las energías que se están activando en tu vida en el corto plazo, para que entiendas hacia dónde te estás moviendo y cómo acompañarlo.",
    emoji: "🗺️",
    regular: 380,
    subscriber: 180,
  },
  {
    id: "next-12-months",
    title: "Tus próximos movimientos (12 meses)",
    description:
      "Una mirada más amplia de tu proceso. No se trata de predecir, sino de entender los ciclos que se activan y cómo pueden influir en tus decisiones.",
    emoji: "🌌",
    regular: 520,
    subscriber: 260,
  },
  {
    id: "personal-audio",
    title: "Audio personalizado de lo que necesites",
    description:
      "Una respuesta directa, profunda y personalizada en formato audio, enfocada en tu situación actual. Ideal para escuchar, integrar y reflexionar.",
    emoji: "🎧",
    regular: 100,
    subscriber: 50,
  },
  {
    id: "live-birth-chart",
    title: "Lectura en vivo de tu carta astral",
    description:
      "Un encuentro donde interpretamos tu carta desde una mirada profunda, conectando tus patrones, tu historia y tu presente.",
    emoji: "🧭",
    regular: 560,
    subscriber: 280,
  },
  {
    id: "live-solar-return",
    title: "Lectura en vivo de tu revolución solar",
    description:
      "Comprendé el ciclo que estás atravesando este año, qué áreas se activan y cómo podés aprovechar ese movimiento.",
    emoji: "☀️",
    regular: 560,
    subscriber: 280,
  },
  {
    id: "three-questions",
    title: "3 preguntas (integrando todas mis herramientas)",
    description:
      "Respuestas profundas a tus preguntas, integrando astrología, tarot, numerología y lectura de patrones inconscientes.",
    emoji: "❓",
    regular: 120,
    subscriber: 60,
  },
];

function formatUSD(value: number) {
  return `$${value} USD`;
}

export default function ServiceCards() {
  const navigate = useNavigate();
  const { isAuthenticated, hasActiveSubscription } = useAuth();

  const [openService, setOpenService] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedService = services.find((service) => service.id === openService) ?? null;
  const payableAmount = selectedService
    ? hasActiveSubscription
      ? selectedService.subscriber
      : selectedService.regular
    : 0;
  const payableLabel = hasActiveSubscription ? "Subscriber price" : "Regular price";
  return (
    <div className="grid md:grid-cols-3 gap-6 mb-12">
      {services.map((s) => (
        <div key={s.id} className="rounded-2xl p-6 transition-all duration-300 fade-in" style={{ background: "rgba(87,55,89,0.12)", border: "1px solid rgba(87,55,89,0.4)" }}>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-lg flex items-center justify-center text-3xl" style={{ background: "rgba(189,167,108,0.08)" }}>{s.emoji}</div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white mb-1">
                {s.title}
              </h3>
              <p className="text-sm text-[#a89ab5]">{s.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-5">
            <div className="rounded-xl border border-border/40 bg-black/10 p-3">
              <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Regular</div>
              <div className="font-numeric text-2xl font-black text-white mt-1">{formatUSD(s.regular)}</div>
            </div>
            <div className="rounded-xl border border-[#cdb6a8]/30 bg-[#cdb6a8]/10 p-3">
              <div className="text-[11px] uppercase tracking-[0.18em] text-[#e9d8c5]">Subscriber</div>
              <div className="font-numeric text-2xl font-black text-[#e9d8c5] mt-1">{formatUSD(s.subscriber)}</div>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            <button
              onClick={() => setOpenService(s.id)}
              className="px-4 py-2 rounded-lg shimmer-gold text-primary-foreground font-medium text-center"
            >
              Buy now
            </button>
            <div className="text-xs uppercase tracking-[0.18em] text-[#a89ab5]">
              Los suscriptores obtienen el precio con descuento.
            </div>
          </div>
        </div>
      ))}

      {openService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpenService(null)} />
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-border/60 bg-card/95 p-6 shadow-2xl backdrop-blur-xl">
            <div className="mb-5">
              <p className="text-[11px] tracking-[0.25em] uppercase text-muted-foreground mb-2">Your cart</p>
              <h3 className="font-serif text-2xl text-foreground leading-tight">{selectedService?.title}</h3>
              <p className="text-sm text-muted-foreground mt-2">Selecciona tu método de pago</p>
            </div>

            {error && <div className="mb-3 text-destructive">{error}</div>}
            <div className="mb-5 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-4 flex items-end justify-between gap-4">
              <div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{payableLabel}</div>
                <div className="mt-1 text-xs text-muted-foreground">Este es el precio que pagarás ahora.</div>
              </div>
              <div className="text-right">
                <div className="font-numeric text-3xl font-semibold text-foreground">{formatUSD(payableAmount)}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary/30 bg-gradient-to-r from-primary/90 to-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-[0_10px_30px_rgba(189,167,108,0.25)] transition-all hover:brightness-110 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={creating}
                onClick={async () => {
                  setError(null);
                  if (!isAuthenticated) {
                    navigate('/login', { state: { servicePurchaseIntent: { serviceId: openService } } });
                    return;
                  }
                  try {
                    setCreating(true);
                    const result = await apiCreatePayPalServiceOrder(openService as any);
                    window.location.href = result.approvalUrl;
                  } catch (err) {
                    setError(err instanceof Error ? err.message : String(err));
                    setCreating(false);
                  }
                }}
              >
                PayPal
              </button>
              <button
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border/60 bg-card px-4 py-3 text-sm font-medium text-foreground shadow-sm transition-all hover:border-primary/40 hover:bg-accent/50 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={creating}
                onClick={async () => {
                  setError(null);
                  if (!isAuthenticated) {
                    navigate('/login', { state: { servicePurchaseIntent: { serviceId: openService } } });
                    return;
                  }
                  try {
                    setCreating(true);
                    const result = await apiCreateMercadoPagoServicePreference(openService as any);
                    window.location.href = result.checkoutUrl;
                  } catch (err) {
                    setError(err instanceof Error ? err.message : String(err));
                    setCreating(false);
                  }
                }}
              >
                Mercado Pago
              </button>
            </div>

            <div className="mt-4 flex justify-end">
              <button className="text-sm text-muted-foreground transition-colors hover:text-foreground" onClick={() => setOpenService(null)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
