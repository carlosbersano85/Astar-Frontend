import { Bell, Loader2, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { portalGetNotifications, portalMarkNotificationRead } from "@/lib/api";
import EmptyState from "@/components/EmptyState";

const Notifications = () => {
  const [notifications, setNotifications] = useState<{ id: string; title: string; body: string | null; category: string | null; read: boolean; createdAt: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => portalGetNotifications().then(setNotifications).finally(() => setLoading(false));
  useEffect(() => {
    load();
  }, []);

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
    } catch {
      return iso;
    }
  };

  const unreadCount = notifications.filter((n) => n.read === false).length;

  const handleMarkAllRead = async () => {
    await Promise.all(notifications.filter((n) => !n.read).map((n) => portalMarkNotificationRead(n.id)));
    load();
  };

  const handleMarkRead = async (id: string) => {
    await portalMarkNotificationRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="max-w-3xl mx-auto">
        <EmptyState icon={Bell} message="No hay notificaciones." />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Tienes {unreadCount} notificación{unreadCount !== 1 ? "es" : ""} sin leer</p>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-2 text-xs text-primary hover:text-primary/80 transition-colors font-medium px-3 py-1.5 rounded-lg border border-primary/20 hover:bg-primary/5"
          >
            <Check className="w-3.5 h-3.5" />
            Marcar todo como leído
          </button>
        )}
      </div>

      <div className="rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm overflow-hidden divide-y divide-border/20">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            onClick={() => !notif.read && handleMarkRead(notif.id)}
            className={`flex items-start gap-4 px-5 py-4 hover:bg-accent/20 transition-colors cursor-pointer ${!notif.read ? "bg-primary/5" : ""}`}
          >
            <div className={`mt-0.5 p-2 rounded-xl flex-shrink-0 ${!notif.read ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
              <Bell className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className={`text-sm font-medium ${!notif.read ? "text-foreground" : "text-muted-foreground"}`}>{notif.title}</p>
                {!notif.read && <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{notif.body || ""}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-[10px] text-muted-foreground/60">{formatDate(notif.createdAt)}</span>
                {notif.category && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground">{notif.category}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
