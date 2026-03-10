import { motion } from "framer-motion";
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Send, User } from "lucide-react";

const AdminQuestionDetail = () => {
  const { id } = useParams();
  const [answer, setAnswer] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div className="max-w-3xl mx-auto">
      <Link to="/admin/questions" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" /> Volver a preguntas
      </Link>


      <div className="glass-card rounded-2xl p-6 premium-shadow mb-6">
        <div className="flex items-center gap-3 mb-4">
          <User className="w-5 h-5 text-primary" />
          <span className="text-foreground font-medium">María García</span>
          <span className="text-xs text-muted-foreground">5 Mar 2026</span>
        </div>
        <p className="text-muted-foreground leading-relaxed">¿Es buen momento para cambiar de trabajo? Siento que necesito algo nuevo pero no sé si es el momento correcto según mis tránsitos.</p>
      </div>

      {sent ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-2xl p-8 premium-shadow text-center">
          <Send className="w-8 h-8 text-primary mx-auto mb-3" />
          <h3 className="font-serif text-xl text-foreground mb-2">Respuesta Enviada</h3>
          <p className="text-muted-foreground text-sm">La respuesta aparecerá en los mensajes del usuario.</p>
        </motion.div>
      ) : (
        <div className="glass-card rounded-2xl p-6 premium-shadow">
          <label className="text-xs tracking-widest uppercase text-muted-foreground mb-3 block">Tu Respuesta</label>
          <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} rows={8} placeholder="Escribe la respuesta basada en la lectura simbólica..." className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border/50 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 text-sm resize-none mb-4" />
          <button onClick={() => setSent(true)} disabled={!answer.trim()} className="w-full py-3.5 rounded-xl shimmer-gold text-primary-foreground font-medium text-sm disabled:opacity-50 flex items-center justify-center gap-2 glow-gold">
            <Send className="w-4 h-4" /> Enviar Respuesta
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminQuestionDetail;
