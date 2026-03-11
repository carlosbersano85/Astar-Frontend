import { motion } from "framer-motion";
import { MessageCircle, User, CheckCircle, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { portalGetMessages, type PortalMessage } from "@/lib/api";
import EmptyState from "@/components/EmptyState";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
  const [messages, setMessages] = useState<PortalMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalMessage, setModalMessage] = useState<PortalMessage | null>(null);

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
      <div className="max-w-6xl mx-auto flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="max-w-6xl mx-auto">
        <EmptyState icon={MessageCircle} message="No hay mensajes." />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
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
                  <button
                    key={msg.id}
                    type="button"
                    onClick={() => setModalMessage(msg)}
                    className={`w-full text-left glass-card rounded-2xl p-6 premium-shadow transition-colors hover:bg-accent/20 cursor-pointer ${msg.type === "question" ? "ml-4" : ""}`}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <config.icon className="w-4 h-4 text-primary" />
                      <span className="text-xs text-muted-foreground">{formatDate(msg.createdAt)}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${config.color}`}>{config.label}</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed text-sm line-clamp-2">{msg.content}</p>
                  </button>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      <Dialog open={!!modalMessage} onOpenChange={(open) => !open && setModalMessage(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {modalMessage && (() => {
                const Icon = typeConfig[modalMessage.type]?.icon ?? MessageCircle;
                return <Icon className="w-5 h-5 text-primary" />;
              })()}
              {modalMessage?.type === "answer" ? "Pregunta y respuesta" : "Mensaje"}
            </DialogTitle>
          </DialogHeader>
          {modalMessage && (
            <div className="space-y-6 pt-2">
              {modalMessage.type === "answer" && modalMessage.questionText && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Tu pregunta</p>
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap rounded-xl bg-muted/50 p-4 text-sm">{modalMessage.questionText}</p>
                </div>
              )}
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  {modalMessage.type === "answer" ? "Respuesta" : "Contenido"}
                </p>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap rounded-xl bg-background/80 border border-border/50 p-4 text-sm">{modalMessage.content}</p>
              </div>
              <p className="text-xs text-muted-foreground/80">{formatDate(modalMessage.createdAt)}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Messages;
