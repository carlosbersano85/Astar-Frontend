import { motion } from "framer-motion";
import { useState } from "react";
import { Send, HelpCircle, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

const Questions = () => {
  const [question, setQuestion] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [remaining] = useState(1);
  const maxChars = 500;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim() && remaining > 0) {
      setSubmitted(true);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">

      {/* Remaining indicator */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={`glass-card rounded-2xl p-6 premium-shadow mb-8 flex items-center gap-4 ${remaining === 0 ? "border border-accent-foreground/20" : "border border-primary/20"}`}>
        <HelpCircle className={`w-8 h-8 shrink-0 ${remaining > 0 ? "text-primary" : "text-muted-foreground"}`} />
        <div className="flex-1">
          {remaining > 0 ? (
            <>
              <p className="text-foreground font-medium">Preguntas disponibles este mes: {remaining}</p>
              <p className="text-sm text-muted-foreground">Tu suscripción incluye 1 pregunta por mes. Se renueva el 1 de cada mes.</p>
            </>
          ) : (
            <>
              <p className="text-foreground font-medium">Ya usaste tu pregunta mensual</p>
              <p className="text-sm text-muted-foreground">
                Puedes comprar una pregunta extra.{" "}
                <Link to="/portal/purchase" className="text-primary hover:text-primary/80 inline-flex items-center gap-1">
                  <ShoppingCart className="w-3 h-3" /> Comprar extra
                </Link>
              </p>
            </>
          )}
        </div>
      </motion.div>

      {submitted ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card rounded-2xl p-10 premium-shadow text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-serif text-2xl text-foreground mb-2">Pregunta Enviada</h3>
          <p className="text-muted-foreground">Tu pregunta ha sido recibida. Recibirás una respuesta personalizada en la sección de mensajes en las próximas 48 horas.</p>
        </motion.div>
      ) : (
        <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-2xl p-8 premium-shadow">
          <label className="text-xs tracking-widest uppercase text-muted-foreground mb-3 block">Tu Pregunta</label>
          <textarea
            value={question}
            onChange={(e) => e.target.value.length <= maxChars && setQuestion(e.target.value)}
            placeholder="Escribe tu pregunta aquí. Sé específico para recibir una respuesta más precisa..."
            rows={6}
            className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border/50 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-sm resize-none mb-2"
            disabled={remaining === 0}
          />
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs text-muted-foreground">{question.length}/{maxChars} caracteres</span>
          </div>
          <button type="submit" disabled={!question.trim() || remaining === 0} className="w-full py-3.5 rounded-xl shimmer-gold text-primary-foreground font-medium tracking-wide text-sm disabled:opacity-50 disabled:cursor-not-allowed glow-gold flex items-center justify-center gap-2">
            <Send className="w-4 h-4" /> Enviar Pregunta
          </button>
        </motion.form>
      )}
    </div>
  );
};

export default Questions;
