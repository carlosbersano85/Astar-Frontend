// Purchase.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import { Loader2, ShoppingCart, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import {
  apiConfirmMercadoPagoExtraSessionPayment,
  apiConfirmPayPalExtraSessionOrder,
  apiCreateMercadoPagoExtraSessionPreference,
  apiCreatePayPalExtraSessionOrder,
  apiGetMercadoPagoExtraSessionPricing,
  apiGetPayPalExtraSessionPricing,
  type MercadoPagoExtraSessionPricing,
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
type PaymentMethod = "paypal" | "mercado_pago";

const Purchase = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [pricing, setPricing] = useState<PayPalExtraSessionPricing | null>(null);
  const [mercadoPagoPricing, setMercadoPagoPricing] = useState<MercadoPagoExtraSessionPricing | null>(null);
  const [loadingPricing, setLoadingPricing] = useState(true);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpired, setIsExpired] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("paypal");

  // Stores the subscription ID that was already attempted so the auto-confirm
  // effect never fires twice for the same ID, even across re-renders.
  const autoConfirmAttemptedRef = useRef<string | null>(null);
  const setSearchParamsRef = useRef(setSearchParams);
  setSearchParamsRef.current = setSearchParams;

  const paypalStatus = searchParams.get("paypal");
  const mercadoPagoStatus = searchParams.get("mp");

  const paypalCheckoutId =
    searchParams.get("token") ??
    searchParams.get("order_id") ??
    searchParams.get("subscription_id");

  const mercadoPagoPaymentId =
    searchParams.get("payment_id") ??
    searchParams.get("collection_id");

  const appliedPrice = useMemo(() => {
    if (!pricing) return null;
    return formatMoney(pricing.amount, pricing.currency);
  }, [pricing]);

  // ── Pricing fetch ──────────────────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;
    setLoadingPricing(true);
    Promise.all([
      apiGetPayPalExtraSessionPricing(),
      apiGetMercadoPagoExtraSessionPricing(),
    ])
      .then(([paypalData, mercadoPagoData]) => {
        if (mounted) {
          setPricing(paypalData);
          setMercadoPagoPricing(mercadoPagoData);
        }
      })
      .catch((err) => {
        if (mounted) setError(err instanceof Error ? err.message : "No se pudo cargar el precio de sesion extra");
      })
      .finally(() => { if (mounted) setLoadingPricing(false); });
    return () => { mounted = false; };
  }, []);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const clearCheckoutParams = () => {
    setSearchParamsRef.current((prev) => {
      const next = new URLSearchParams(prev);
      [
        "paypal",
        "product",
        "token",
        "subscription_id",
        "ba_token",
        "PayerID",
        "mp",
        "payment_id",
        "collection_id",
        "collection_status",
        "status",
        "merchant_order_id",
      ].forEach((k) => next.delete(k));
      return next;
    }, { replace: true });
  };

  const runConfirmation = async (checkoutId: string, method: PaymentMethod) => {
    setConfirming(true);
    setError(null);
    setIsExpired(false);
    setSuccess(null);

    try {
      const result = method === "paypal"
        ? await apiConfirmPayPalExtraSessionOrder(checkoutId)
        : await apiConfirmMercadoPagoExtraSessionPayment(checkoutId);
      setSuccess(
        result.created === false
          ? `Pago ya confirmado: ${formatMoney(result.amount, result.currency)}.`
          : `Pago confirmado: ${formatMoney(result.amount, result.currency)}.`
      );
      clearCheckoutParams();
    } catch (err) {
      const message = err instanceof Error ? err.message : "No se pudo confirmar tu pago";
      if (isExpiredCheckout(message)) {
        setIsExpired(true);
        setError("Este pago ha expirado, fue cancelado o rechazado. Por favor inicia un nuevo pago.");
        clearCheckoutParams();
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
    runConfirmation(paypalCheckoutId, "paypal");

  // runConfirmation is stable (defined outside effect, no deps that change).
  // paypalCheckoutId and paypalStatus are the only values that should re-trigger.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paypalStatus, paypalCheckoutId]);

  useEffect(() => {
    if (mercadoPagoStatus !== "success" || !mercadoPagoPaymentId) return;
    if (autoConfirmAttemptedRef.current === mercadoPagoPaymentId) return;

    autoConfirmAttemptedRef.current = mercadoPagoPaymentId;
    runConfirmation(mercadoPagoPaymentId, "mercado_pago");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mercadoPagoStatus, mercadoPagoPaymentId]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleRetryConfirmation = () => {
    const checkoutId = paymentMethod === "paypal" ? paypalCheckoutId : mercadoPagoPaymentId;
    if (!checkoutId || confirming) return;
    runConfirmation(checkoutId, paymentMethod);
  };

  const handlePayNow = async (method: PaymentMethod) => {
    setError(null);
    setSuccess(null);
    setIsExpired(false);
    setCreatingOrder(true);
    try {
      if (method === "paypal") {
        const result = await apiCreatePayPalExtraSessionOrder();
        window.location.href = result.approvalUrl;
        return;
      }

      const result = await apiCreateMercadoPagoExtraSessionPreference();
      window.location.href = result.checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo iniciar el pago");
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

        {pricing && mercadoPagoPricing && (
          <div className="mt-6 rounded-xl border border-border/50 bg-background/30 p-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Tu precio ahora</p>
              <p className="text-xl font-semibold text-foreground mt-1">{appliedPrice}</p>
            </div>
            <div className="flex flex-col items-end gap-3">
              <div className="flex items-center gap-2 text-xs">
                <button
                  onClick={() => setPaymentMethod("paypal")}
                  className={`px-3 py-1 rounded-full border ${paymentMethod === "paypal" ? "border-primary bg-primary/15 text-primary" : "border-border/50 text-muted-foreground"}`}
                >
                  PayPal
                </button>
                <button
                  onClick={() => setPaymentMethod("mercado_pago")}
                  className={`px-3 py-1 rounded-full border ${paymentMethod === "mercado_pago" ? "border-primary bg-primary/15 text-primary" : "border-border/50 text-muted-foreground"}`}
                >
                  Mercado Pago
                </button>
              </div>
              <button
                onClick={() => handlePayNow(paymentMethod)}
                disabled={creatingOrder || confirming}
                className="px-6 py-3 rounded-xl shimmer-gold text-primary-foreground text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
              >
                {creatingOrder ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingCart className="w-4 h-4" />}
                {creatingOrder
                  ? "Redirigiendo..."
                  : paymentMethod === "paypal"
                    ? "Pagar con PayPal"
                    : "Pagar con Mercado Pago"}
              </button>
            </div>
          </div>
        )}

        {paypalStatus === "cancel" && !error && (
          <div className="mt-6 rounded-xl p-3 border border-amber-300/40 bg-amber-200/10 text-sm text-amber-100 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> Pago cancelado en PayPal.
          </div>
        )}

        {mercadoPagoStatus === "failure" && !error && (
          <div className="mt-6 rounded-xl p-3 border border-amber-300/40 bg-amber-200/10 text-sm text-amber-100 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> Pago rechazado o cancelado en Mercado Pago.
          </div>
        )}

        {mercadoPagoStatus === "pending" && !error && (
          <div className="mt-6 rounded-xl p-3 border border-primary/30 bg-primary/10 text-sm text-foreground flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Pago pendiente en Mercado Pago. Te avisaremos cuando se apruebe.
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
                onClick={() => handlePayNow(paymentMethod)}
                disabled={creatingOrder || confirming}
                className="px-4 py-2 rounded-lg shimmer-gold text-primary-foreground text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
              >
                {creatingOrder ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                {creatingOrder ? "Redirigiendo..." : "Iniciar nuevo pago"}
              </button>
            )}

            {/* Transient error (not expired): allow retrying the same ID */}
            {!isExpired && (paypalCheckoutId || mercadoPagoPaymentId) && (
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