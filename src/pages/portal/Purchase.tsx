// Purchase.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, ShoppingCart, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  apiConfirmMercadoPagoServicePayment,
  apiConfirmPayPalServiceOrder,
  apiCreateMercadoPagoServicePreference,
  apiCreatePayPalServiceOrder,
  apiGetMercadoPagoServicePricing,
  apiGetPayPalServicePricing,
  type OneTimeServiceId,
  type MercadoPagoServicePricing,
  type PayPalServicePricing,
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

const SERVICE_TITLES: Record<OneTimeServiceId, string> = {
  "current-moment": "Your Current Moment Reading + Questions",
  "inner-energy": "Inner Energy vs. Outward Expression",
  "making-decision": "Making a Decision",
  "next-6-months": "Your Next Steps (6 Months)",
  "next-12-months": "Your Next Steps (12 Months)",
  "personal-audio": "Personalized Audio",
  "live-birth-chart": "Live Birth Chart Reading",
  "live-solar-return": "Live Solar Return Reading",
  "three-questions": "3 Questions (All Tools)",
};

const isOneTimeServiceId = (value: string | null): value is OneTimeServiceId => {
  return !!value && value in SERVICE_TITLES;
};

const Purchase = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, authLoading } = useAuth();
  const [pricing, setPricing] = useState<PayPalServicePricing | null>(null);
  const [mercadoPagoPricing, setMercadoPagoPricing] = useState<MercadoPagoServicePricing | null>(null);
  const [loadingPricing, setLoadingPricing] = useState(true);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpired, setIsExpired] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("paypal");
  const serviceParam = searchParams.get("service");
  const selectedServiceId = isOneTimeServiceId(serviceParam) ? serviceParam : null;

  useEffect(() => {
    if (authLoading) return;
    if (isAuthenticated) return;

    navigate("/login", {
      replace: true,
      state: {
        servicePurchaseIntent: {
          serviceId: selectedServiceId,
        },
      },
    });
  }, [authLoading, isAuthenticated, navigate, selectedServiceId]);

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
      apiGetPayPalServicePricing(selectedServiceId),
      apiGetMercadoPagoServicePricing(selectedServiceId),
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
  }, [selectedServiceId]);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const clearCheckoutParams = () => {
    setSearchParamsRef.current((prev) => {
      const next = new URLSearchParams(prev);
      [
        "paypal",
        "product",
        "service",
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
        ? await apiConfirmPayPalServiceOrder(checkoutId, selectedServiceId)
        : await apiConfirmMercadoPagoServicePayment(checkoutId, selectedServiceId);
      setSuccess(
        result.created === false
          ? `Pago ya confirmado: ${result.serviceTitle ?? "tu servicio"} - ${formatMoney(result.amount, result.currency)}.`
          : `Pago confirmado: ${result.serviceTitle ?? "tu servicio"} - ${formatMoney(result.amount, result.currency)}.`
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
        const result = await apiCreatePayPalServiceOrder(selectedServiceId);
        window.location.href = result.approvalUrl;
        return;
      }

      const result = await apiCreateMercadoPagoServicePreference(selectedServiceId);
      window.location.href = result.checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo iniciar el pago");
      setCreatingOrder(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  const serviceTitle = selectedServiceId ? SERVICE_TITLES[selectedServiceId] : "Sesion privada adicional";
  const serviceSubtitle = selectedServiceId
    ? "Pago único para este servicio seleccionado."
    : "Reserva una sesion privada extra.";

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">No hay sesiones adicionales disponibles.</p>
    </div>
  );
};

export default Purchase;