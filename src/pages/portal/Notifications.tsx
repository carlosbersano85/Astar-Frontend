import { Bell, Search, ChevronLeft, ChevronRight, Loader2, Check } from "lucide-react";
import { useState, useMemo } from "react";
import EmptyState from "@/components/EmptyState";
import { getPaginationItems } from "@/lib/pagination";
import { usePortalNotifications } from "@/contexts/PortalNotificationsContext";
import { portalMarkNotificationRead, portalMarkAllNotificationsRead } from "@/lib/api";

const ITEMS_PER_PAGE = 10;

function formatNotificationTime(iso: string): string {
  try {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1) return "Ahora";
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours} h`;
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return d.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return iso;
  }
}

const Notifications = () => {
  const { notifications, loading, refetch } = usePortalNotifications();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [markingId, setMarkingId] = useState<string | null>(null);
  const [markingAll, setMarkingAll] = useState(false);

  const markAsRead = async (id: string) => {
    setMarkingId(id);
    try {
      await portalMarkNotificationRead(id);
      await refetch();
    } finally {
      setMarkingId(null);
    }
  };

  const markAllAsRead = async () => {
    setMarkingAll(true);
    try {
      await portalMarkAllNotificationsRead();
      await refetch();
    } finally {
      setMarkingAll(false);
    }
  };

  const filtered = useMemo(
    () =>
      notifications.filter(
        (n) =>
          n.title.toLowerCase().includes(search.toLowerCase()) ||
          (n.body?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
          (n.category?.toLowerCase().includes(search.toLowerCase()) ?? false)
      ),
    [notifications, search]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Buscar notificaciones..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-background/50 border border-border/50 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 text-sm"
          />
        </div>
        <button
          type="button"
          onClick={markAllAsRead}
          disabled={markingAll || unreadCount === 0}
          className="flex items-center gap-2 px-4 py-3 rounded-xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors text-sm font-medium whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {markingAll ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          Marcar todas como leídas
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        <div className="rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm overflow-hidden divide-y divide-border/20">
          {paginated.map((notif) => {
            const unread = !notif.read;
            const isMarking = markingId === notif.id;
            return (
              <div
                key={notif.id}
                className={`flex items-start gap-4 px-5 py-4 hover:bg-accent/20 transition-colors ${unread ? "bg-primary/5" : ""}`}
              >
                <div className={`mt-0.5 p-2 rounded-xl flex-shrink-0 ${unread ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
                  <Bell className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className={`text-sm font-medium ${unread ? "text-foreground" : "text-muted-foreground"}`}>{notif.title}</p>
                    {unread && <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{notif.body ?? ""}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[10px] text-muted-foreground/60">{formatNotificationTime(notif.createdAt)}</span>
                    {notif.category && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground">{notif.category}</span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => markAsRead(notif.id)}
                  disabled={isMarking}
                  className={`mt-0.5 p-2 rounded-xl flex-shrink-0 transition-colors ${unread ? "text-muted-foreground hover:text-primary hover:bg-primary/10" : "text-primary/60 bg-primary/5"} disabled:opacity-50`}
                  title={unread ? "Marcar como leída" : "Leída"}
                >
                  {isMarking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                </button>
              </div>
            );
          })}
          {paginated.length === 0 && (
            <div className="p-6">
              <EmptyState icon={Bell} message="No hay notificaciones." />
            </div>
          )}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} de {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"><ChevronLeft className="w-4 h-4" /></button>
            {getPaginationItems(totalPages, currentPage).map((item, i) =>
              item === "ellipsis" ? (
                <span key={`ellipsis-${i}`} className="w-8 h-8 flex items-center justify-center text-muted-foreground text-sm">…</span>
              ) : (
                <button key={item} onClick={() => goToPage(item)} className={`w-8 h-8 rounded-lg text-sm transition-colors ${item === currentPage ? "bg-primary/10 text-primary border border-primary/20 font-medium" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"}`}>{item}</button>
              )
            )}
            <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
