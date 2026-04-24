import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, AlertTriangle } from "lucide-react";
import { apiConfirmPayPalSubscription } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

type Status = "loading" | "success" | "error";

const SubscribePayPalSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, authLoading, refreshUser } = useAuth();
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("Estamos confirmando tu suscripción con PayPal...");

  const subscriptionId = useMemo(() => params.get("subscription_id") ?? "", [params]);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }

    if (!subscriptionId) {
      setStatus("error");
      setMessage("No encontramos el identificador de suscripción en el retorno de PayPal.");
      return;
    }

    let alive = true;

    apiConfirmPayPalSubscription(subscriptionId)
      .then(async (result) => {
        if (!alive) return;
        await refreshUser();

        if (result.subscriptionStatus === "active") {
          setStatus("success");
          setMessage("Tu suscripción está activa. Ya tienes acceso al portal.");
          return;
        }

        setStatus("error");
        setMessage("PayPal devolvió un estado no activo. Intenta nuevamente o contáctanos.");
      })
      .catch((error: unknown) => {
        if (!alive) return;
        const text = error instanceof Error ? error.message : "No se pudo confirmar la suscripción.";
        setStatus("error");
        setMessage(text);
      });

    return () => {
      alive = false;
    };
  }, [authLoading, isAuthenticated, navigate, refreshUser, subscriptionId]);

  return (
    <section className="min-h-[75vh] px-6 py-20 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full glass-card rounded-2xl p-8 premium-shadow text-center"
      >
        {status === "loading" && <Loader2 className="w-10 h-10 text-primary mx-auto mb-4 animate-spin" />}
        {status === "success" && <CheckCircle2 className="w-10 h-10 text-primary mx-auto mb-4" />}
        {status === "error" && <AlertTriangle className="w-10 h-10 text-destructive mx-auto mb-4" />}

        <h1 className="font-serif text-3xl mb-3 text-foreground">
          {status === "loading" && "Confirmando pago"}
          {status === "success" && "Suscripción activada"}
          {status === "error" && "No se pudo activar"}
        </h1>

        <p className="text-muted-foreground mb-6">{message}</p>

        <div className="flex justify-center gap-3 flex-wrap">
          <Link to="/portal/subscription" className="px-6 py-3 rounded-xl shimmer-gold text-primary-foreground text-sm font-medium">
            Ir a mi suscripción
          </Link>
          <Link to="/" className="px-6 py-3 rounded-xl border border-border/60 text-sm hover:bg-accent/40 transition-colors">
            Volver al inicio
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

export default SubscribePayPalSuccess;
