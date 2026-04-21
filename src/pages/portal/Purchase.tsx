// Purchase.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import { Loader2, ShoppingCart, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import {
  apiConfirmPayPalExtraSessionOrder,
  apiCreatePayPalExtraSessionOrder,
  apiGetPayPalExtraSessionPricing,
  type PayPalExtraSessionPricing,
} from "@/lib/api";

function formatMoney(value: string, currency: string) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return `${currency} ${value}`;
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Matches the sentinel prefix the backend puts in the error message for
// terminal PayPal states (EXPIRED, CANCELLED, SUSPENDED).
const isExpiredCheckout = (message: string) => message.includes("EXPIRED_CHECKOUT");

const Purchase = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [pricing, setPricing] = useState<PayPalExtraSessionPricing | null>(null);
  const [loadingPricing, setLoadingPricing] = useState(true);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpired, setIsExpired] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  // Stores the subscription ID that was already attempted so the auto-confirm
  // effect never fires twice for the same ID, even across re-renders.
  const autoConfirmAttemptedRef = useRef<string | null>(null);
  const setSearchParamsRef = useRef(setSearchParams);
  setSearchParamsRef.current = setSearchParams;

  const paypalStatus = searchParams.get("paypal");

  const paypalCheckoutId =
    searchParams.get("token") ??
    searchParams.get("order_id") ??
    searchParams.get("subscription_id");

  const appliedPrice = useMemo(() => {
    if (!pricing) return null;
    return formatMoney(pricing.amount, pricing.currency);
  }, [pricing]);

  // ── Pricing fetch ──────────────────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;
    setLoadingPricing(true);
    apiGetPayPalExtraSessionPricing()
      .then((data) => { if (mounted) setPricing(data); })
      .catch((err) => {
        if (mounted) setError(err instanceof Error ? err.message : "No se pudo cargar el precio de sesion extra");
      })
      .finally(() => { if (mounted) setLoadingPricing(false); });
    return () => { mounted = false; };
  }, []);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const clearPayPalParams = () => {
    setSearchParamsRef.current((prev) => {
      const next = new URLSearchParams(prev);
      ["paypal", "product", "token", "subscription_id", "ba_token", "PayerID"].forEach((k) => next.delete(k));
      return next;
    }, { replace: true });
  };

  const runConfirmation = async (checkoutId: string) => {
    setConfirming(true);
    setError(null);
    setIsExpired(false);
    setSuccess(null);

    try {
      const result = await apiConfirmPayPalExtraSessionOrder(checkoutId);
      setSuccess(
        result.created === false
          ? `Pago ya confirmado: ${formatMoney(result.amount, result.currency)}.`
          : `Pago confirmado: ${formatMoney(result.amount, result.currency)}.`
      );
      clearPayPalParams();
    } catch (err) {
      const message = err instanceof Error ? err.message : "No se pudo confirmar tu pago con PayPal";
      if (isExpiredCheckout(message)) {
        // Terminal state — clear the stale PayPal params so the user
        // can start a fresh checkout without old IDs in the URL.
        setIsExpired(true);
        setError("Este pago ha expirado o fue cancelado en PayPal. Por favor inicia un nuevo pago.");
        clearPayPalParams();
      } else {
        setError(`${message}. Puedes reintentar desde abajo.`);
      }
    } finally {
      setConfirming(false);
    }
  };

  // ── Auto-confirm on PayPal redirect ───────────────────────────────────────
  useEffect(() => {
    if (paypalStatus !== "success" || !paypalCheckoutId) return;
    if (autoConfirmAttemptedRef.current === paypalCheckoutId) return;

    autoConfirmAttemptedRef.current = paypalCheckoutId;
    runConfirmation(paypalCheckoutId);

  // runConfirmation is stable (defined outside effect, no deps that change).
  // paypalCheckoutId and paypalStatus are the only values that should re-trigger.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paypalStatus, paypalCheckoutId]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleRetryConfirmation = () => {
    if (!paypalCheckoutId || confirming) return;
    runConfirmation(paypalCheckoutId);
  };

  const handlePayNow = async () => {
    setError(null);
    setSuccess(null);
    setIsExpired(false);
    setCreatingOrder(true);
    try {
      const result = await apiCreatePayPalExtraSessionOrder();
      window.location.href = result.approvalUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo iniciar el pago con PayPal");
      setCreatingOrder(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-8 premium-shadow border border-primary/20"
      >
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">Compra De Extras</p>
            <h1 className="font-serif text-3xl text-foreground">Sesion privada adicional</h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-2xl">Reserva una sesion privada extra.</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-primary/12 border border-primary/30 flex items-center justify-center">
            <ShoppingCart className="w-5 h-5 text-primary" />
          </div>
        </div>

        {loadingPricing && (
          <div className="mt-6 rounded-xl p-3 border border-primary/30 bg-primary/10 text-sm text-foreground flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Cargando precio...
          </div>
        )}

        {pricing && (
          <div className="mt-6 rounded-xl border border-border/50 bg-background/30 p-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Tu precio ahora</p>
              <p className="text-xl font-semibold text-foreground mt-1">{appliedPrice}</p>
            </div>
            <button
              onClick={handlePayNow}
              disabled={creatingOrder || confirming}
              className="px-6 py-3 rounded-xl shimmer-gold text-primary-foreground text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
            >
              {creatingOrder ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingCart className="w-4 h-4" />}
              {creatingOrder ? "Redirigiendo..." : "Pagar con PayPal"}
            </button>
          </div>
        )}

        {paypalStatus === "cancel" && !error && (
          <div className="mt-6 rounded-xl p-3 border border-amber-300/40 bg-amber-200/10 text-sm text-amber-100 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> Pago cancelado en PayPal.
          </div>
        )}

        {confirming && (
          <div className="mt-6 rounded-xl p-3 border border-primary/30 bg-primary/10 text-sm text-foreground flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Confirmando pago con PayPal...
          </div>
        )}

        {success && (
          <div className="mt-6 rounded-xl p-3 border border-emerald-400/40 bg-emerald-200/10 text-sm text-emerald-100 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> {success}
          </div>
        )}

        {error && (
          <div className="mt-6 space-y-3">
            <div className="rounded-xl p-3 border border-destructive/30 bg-destructive/10 text-sm text-destructive flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>

            {/* Expired: prompt to start a new checkout, not retry the dead ID */}
            {isExpired && pricing && (
              <button
                onClick={handlePayNow}
                disabled={creatingOrder || confirming}
                className="px-4 py-2 rounded-lg shimmer-gold text-primary-foreground text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
              >
                {creatingOrder ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                {creatingOrder ? "Redirigiendo..." : "Iniciar nuevo pago"}
              </button>
            )}

            {/* Transient error (not expired): allow retrying the same ID */}
            {!isExpired && paypalCheckoutId && (
              <button
                onClick={handleRetryConfirmation}
                disabled={confirming}
                className="px-4 py-2 rounded-lg border border-primary/40 text-sm text-primary hover:bg-primary/10 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
              >
                {confirming ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                {confirming ? "Reintentando..." : "Reintentar confirmacion"}
              </button>
            )}
          </div>
        )}

        <div className="mt-6 text-xs text-muted-foreground">
          Si prefieres, puedes revisar tu estado en{" "}
          <Link to="/portal/subscription" className="text-primary hover:underline">
            Suscripcion
          </Link>{" "}
          antes de comprar.
        </div>
      </motion.section>
    </div>
  );
};

export default Purchase;