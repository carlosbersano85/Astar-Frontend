import { Bell, HelpCircle, CreditCard, Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import EmptyState from "@/components/EmptyState";
import { getPaginationItems } from "@/lib/pagination";
import { adminGetNotifications, type AdminNotificationItem } from "@/lib/api";

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

function getIconAndCategory(type: string): { icon: typeof HelpCircle; category: string } {
  if (type === "order") return { icon: CreditCard, category: "Pedido" };
  return { icon: HelpCircle, category: "Pregunta" };
}

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState<AdminNotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    adminGetNotifications().then((data) => {
      setNotifications(data);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(
    () =>
      notifications.filter(
        (n) =>
          n.title.toLowerCase().includes(search.toLowerCase()) ||
          n.description.toLowerCase().includes(search.toLowerCase()) ||
          n.type.toLowerCase().includes(search.toLowerCase())
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

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl tracking-wide text-gradient-gold font-semibold">Notificaciones</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {unreadCount > 0 ? `${unreadCount} notificación${unreadCount !== 1 ? "es" : ""} nueva${unreadCount !== 1 ? "s" : ""}` : "Sin notificaciones nuevas"}
          </p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input value={search} onChange={(e) => handleSearch(e.target.value)} placeholder="Buscar notificaciones..." className="w-full pl-11 pr-4 py-3 rounded-xl bg-background/50 border border-border/50 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 text-sm" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : (
      <div className="rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm overflow-hidden divide-y divide-border/20">
        {paginated.map((notif) => {
          const { icon: Icon, category } = getIconAndCategory(notif.type);
          return (
            <div
              key={notif.id}
              className={`flex items-start gap-4 px-5 py-4 hover:bg-accent/20 transition-colors ${notif.unread ? "bg-primary/5" : ""}`}
            >
              <div className={`mt-0.5 p-2 rounded-xl flex-shrink-0 ${notif.unread ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className={`text-sm font-medium ${notif.unread ? "text-foreground" : "text-muted-foreground"}`}>{notif.title}</p>
                  {notif.unread && <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{notif.description}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[10px] text-muted-foreground/60">{formatNotificationTime(notif.date)}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground">{category}</span>
                </div>
              </div>
            </div>
          );
        })}
        {paginated.length === 0 && (
          <div className="p-6">
            <EmptyState icon={Bell} message="No hay notificaciones nuevas." />
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

export default AdminNotifications;
