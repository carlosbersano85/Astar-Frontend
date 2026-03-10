import { motion } from "framer-motion";
import { MessageCircle, User, CheckCircle, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { portalGetMessages } from "@/lib/api";
import EmptyState from "@/components/EmptyState";

const typeConfig: Record<string, { label: string; color: string; icon: typeof MessageCircle }> = {
  monthly: { label: "Mensaje mensual", color: "bg-primary/10 text-primary", icon: MessageCircle },
  question: { label: "Tu pregunta", color: "bg-accent text-accent-foreground", icon: User },
  answer: { label: "Respuesta", color: "bg-primary/20 text-primary", icon: CheckCircle },
};

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return iso;
  }
};

const Messages = () => {
  const [messages, setMessages] = useState<{ id: string; type: string; content: string; monthLabel: string | null; createdAt: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    portalGetMessages()
      .then(setMessages)
      .finally(() => setLoading(false));
  }, []);

  const byMonth = messages.reduce<Record<string, typeof messages>>((acc, m) => {
    const key = m.monthLabel || formatDate(m.createdAt).split(" ").slice(1).join(" ") || "Otros";
    if (!acc[key]) acc[key] = [];
    acc[key].push(m);
    return acc;
  }, {});
  const groups = Object.entries(byMonth).sort((a, b) => {
    const d1 = b[1][0]?.createdAt ?? "";
    const d2 = a[1][0]?.createdAt ?? "";
    return d1.localeCompare(d2);
  });

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="max-w-3xl mx-auto">
        <EmptyState icon={MessageCircle} message="No hay mensajes." />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="space-y-10">
        {groups.map(([month, items], gi) => (
          <motion.div key={month} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: gi * 0.1 }}>
            <h2 className="font-sans text-xl text-foreground mb-4 flex items-center gap-2 tabular-nums">
              <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
              {month}
            </h2>
            <div className="space-y-4 pl-4 border-l border-border/50">
              {items.map((msg) => {
                const config = typeConfig[msg.type] ?? { label: msg.type, color: "bg-muted text-muted-foreground", icon: MessageCircle };
                return (
                  <div key={msg.id} className={`glass-card rounded-2xl p-6 premium-shadow ${msg.type === "question" ? "ml-4" : ""}`}>
                    <div className="flex items-center gap-2 mb-3">
                      <config.icon className="w-4 h-4 text-primary" />
                      <span className="text-xs text-muted-foreground">{formatDate(msg.createdAt)}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${config.color}`}>{config.label}</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed text-sm">{msg.content}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Messages;
