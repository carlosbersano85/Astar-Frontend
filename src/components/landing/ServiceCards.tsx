import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const services = [
  { id: "current-moment", title: "Your Current Moment Reading + Questions", emoji: "🔮", regular: 260, subscriber: 130 },
  { id: "inner-energy", title: "Inner Energy vs. Outward Expression", emoji: "🪞", regular: 200, subscriber: 100 },
  { id: "making-decision", title: "Making a Decision", emoji: "⚖️", regular: 160, subscriber: 80 },
  { id: "next-6-months", title: "Your Next Steps (6 Months)", emoji: "🗺️", regular: 380, subscriber: 180 },
  { id: "next-12-months", title: "Your Next Steps (12 Months)", emoji: "🌌", regular: 520, subscriber: 260 },
  { id: "personal-audio", title: "Personalized Audio", emoji: "🎧", regular: 100, subscriber: 50 },
  { id: "live-birth-chart", title: "Live Birth Chart Reading", emoji: "🧭", regular: 560, subscriber: 280 },
  { id: "live-solar-return", title: "Live Solar Return Reading", emoji: "☀️", regular: 560, subscriber: 280 },
  { id: "three-questions", title: "3 Questions (All Tools)", emoji: "❓", regular: 120, subscriber: 60 },
];

function formatUSD(value: number) {
  return `$${value} USD`;
}

export default function ServiceCards() {
  const { hasActiveSubscription, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleBuy = (serviceId: string) => {
    // route to the public purchase flow; backend will map product/service later
    navigate(`/portal/purchase?product=extra-session&service=${serviceId}`);
  };

  return (
    <div className="grid md:grid-cols-3 gap-6 mb-12">
      {services.map((s) => (
        <div key={s.id} className="rounded-2xl p-6 transition-all duration-300 fade-in" style={{ background: "rgba(87,55,89,0.12)", border: "1px solid rgba(87,55,89,0.4)" }}>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-lg flex items-center justify-center text-3xl" style={{ background: "rgba(189,167,108,0.08)" }}>{s.emoji}</div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white mb-1">
                {s.id === "three-questions" ? <><span className="font-numeric">3</span> Questions (All Tools)</> : s.title}
              </h3>
              <p className="text-sm text-[#a89ab5]">{/* short desc could be added here */}</p>
            </div>
          </div>

          <div className="mb-4">
            <div className="text-sm text-muted-foreground">Precio regular</div>
            <div className="font-numeric text-2xl font-black text-white">{formatUSD(s.regular)}</div>
            <div className="text-sm text-muted-foreground mt-2">Precio para suscriptoras Luminary</div>
            <div className="font-numeric text-xl font-semibold text-[#cdb6a8]">{formatUSD(s.subscriber)}</div>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={() => handleBuy(s.id)}
              className="px-4 py-2 rounded-lg shimmer-gold text-primary-foreground font-medium"
            >
              {hasActiveSubscription ? `Comprar — ${formatUSD(s.subscriber)}` : `Comprar — ${formatUSD(s.regular)}`}
            </button>

            {!isAuthenticated && (
              <Link to="/register" className="px-4 py-2 rounded-lg border border-border/50 text-sm text-muted-foreground">Crear cuenta</Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
