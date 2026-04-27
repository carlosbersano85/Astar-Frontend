import { motion } from "framer-motion";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, User, Calendar, CreditCard, Power, Loader2, ShieldCheck } from "lucide-react";
import { adminGetUser, adminUpdateUser, type AdminUserDetail } from "@/lib/api";
import EmptyState from "@/components/EmptyState";

const statusLabel: Record<string, string> = {
  active: "Activa",
  inactive: "Inactiva",
  cancelled: "Cancelada",
};

const AdminUserDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<AdminUserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [granting, setGranting] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    adminGetUser(id)
      .then((u) => {
        if (!cancelled) setUser(u);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Error al cargar usuario");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleToggleAccountActive = async () => {
    if (!user || user.role === "admin") return;
    const next = !user.isActive;
    setUpdating(true);
    try {
      await adminUpdateUser(user.id, { isActive: next });
      setUser((prev) => (prev ? { ...prev, isActive: next } : null));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al actualizar");
    } finally {
      setUpdating(false);
    }
  };

  const handleGrantFullAccess = async () => {
    if (!user || user.role === "admin") return;

    const alreadyGranted = user.isActive && user.subscriptionStatus === "active";
    if (alreadyGranted) return;

    setGranting(true);
    try {
      if (!user.isActive) {
        await adminUpdateUser(user.id, { isActive: true });
      }
      if (user.subscriptionStatus !== "active") {
        await adminUpdateUser(user.id, { subscriptionStatus: "active" });
      }
      setUser((prev) => (prev ? { ...prev, isActive: true, subscriptionStatus: "active" } : null));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al conceder acceso completo");
    } finally {
      setGranting(false);
    }
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
    } catch {
      return iso;
    }
  };

  const formatBirthDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="max-w-6xl mx-auto">
        <Link
          to="/admin/users"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Volver a usuarios
        </Link>
        <div className="p-6 rounded-xl bg-destructive/10 border border-destructive/30">
          <EmptyState icon={User} message={error ?? "Usuario no encontrado"} className="text-destructive py-6" />
        </div>
      </div>
    );
  }

  const accountActive = user.isActive;
  const isClient = user.role === "client";
  const hasFullAccess = accountActive && user.subscriptionStatus === "active";

  return (
    <div className="max-w-6xl mx-auto">
      <Link
        to="/admin/users"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" /> Volver a usuarios
      </Link>

      {isClient && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-end mb-8 flex-wrap gap-4"
        >
          <button
            onClick={handleGrantFullAccess}
            disabled={granting || hasFullAccess || updating}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium shimmer-gold text-primary-foreground disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {granting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
            {hasFullAccess ? "Acceso completo concedido" : "Conceder acceso completo"}
          </button>
          <button
            onClick={handleToggleAccountActive}
            disabled={updating || granting}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-60 ${
              accountActive
                ? "border border-destructive/30 text-destructive hover:bg-destructive/10"
                : "shimmer-gold text-primary-foreground glow-gold"
            }`}
          >
            {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Power className="w-4 h-4" />}
            {accountActive ? "Desactivar usuario" : "Activar usuario"}
          </button>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6 premium-shadow">
          <h3 className="font-serif text-lg text-foreground mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-primary" /> Información
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nombre</span>
              <span className="text-foreground">{user.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email</span>
              <span className="text-foreground">{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Registro</span>
              <span className="text-foreground">{formatDate(user.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Rol</span>
              <span className="text-foreground">{user.role === "admin" ? "Administrador" : "Cliente"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estado cuenta</span>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  accountActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                }`}
              >
                {accountActive ? "Activo" : "Inactivo"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estado suscripción</span>
              <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                {statusLabel[user.subscriptionStatus] ?? user.subscriptionStatus}
              </span>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 premium-shadow">
          <h3 className="font-serif text-lg text-foreground mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" /> Datos de Nacimiento
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fecha</span>
              <span className="text-foreground">{formatBirthDate(user.birthDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Hora</span>
              <span className="text-foreground">{user.birthTime ?? "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Lugar</span>
              <span className="text-foreground">{user.birthPlace ?? "—"}</span>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 premium-shadow md:col-span-2">
          <h3 className="font-serif text-lg text-foreground mb-4 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-primary" /> Suscripción
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estado suscripción</span>
              <span className="text-muted-foreground">
                {statusLabel[user.subscriptionStatus] ?? user.subscriptionStatus}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserDetail;
