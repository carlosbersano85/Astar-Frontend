import { motion } from "framer-motion";
import { CreditCard, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useMemo } from "react";
import EmptyState from "@/components/EmptyState";

const ITEMS_PER_PAGE = 10;

const AdminOrders = () => {
  const [orders] = useState<{ id: string; user: string; type: string; amount: string; method: string; date: string }[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(
    () =>
      orders.filter(
        (o) =>
          o.user.toLowerCase().includes(search.toLowerCase()) ||
          o.id.toLowerCase().includes(search.toLowerCase()) ||
          o.type.toLowerCase().includes(search.toLowerCase())
      ),
    [orders, search]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Ingresos (período)", value: "—" },
          { label: "Total Pedidos", value: String(orders.length) },
          { label: "Método Principal", value: "—" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card rounded-2xl p-6 premium-shadow text-center">
            <p className="font-sans text-2xl text-foreground tabular-nums">{s.value}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} placeholder="Buscar por usuario, ID o tipo..." className="w-full pl-11 pr-4 py-3 rounded-xl bg-background/50 border border-border/50 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 text-sm" />
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="glass-card rounded-2xl premium-shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border/30"><th className="text-left p-4 text-muted-foreground font-normal">ID</th><th className="text-left p-4 text-muted-foreground font-normal">Usuario</th><th className="text-left p-4 text-muted-foreground font-normal">Tipo</th><th className="text-left p-4 text-muted-foreground font-normal">Monto</th><th className="text-left p-4 text-muted-foreground font-normal">Método</th><th className="text-left p-4 text-muted-foreground font-normal">Fecha</th></tr></thead>
          <tbody>
            {paginated.map((o) => (
              <tr key={o.id} className="border-b border-border/20 hover:bg-accent/30 transition-colors">
                <td className="p-4 text-muted-foreground">{o.id}</td>
                <td className="p-4 text-foreground">{o.user}</td>
                <td className="p-4 text-muted-foreground">{o.type}</td>
                <td className="p-4 text-primary font-sans tabular-nums">{o.amount}</td>
                <td className="p-4 text-muted-foreground">{o.method}</td>
                <td className="p-4 text-muted-foreground">{o.date}</td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={6} className="p-0">
                  <EmptyState icon={CreditCard} message="No hay pedidos." />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </motion.div>

      {totalPages > 1 && filtered.length > 0 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-xs text-muted-foreground">
            Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} de {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button key={page} onClick={() => goToPage(page)} className={`w-8 h-8 rounded-lg text-sm transition-colors ${page === currentPage ? "bg-primary/10 text-primary border border-primary/20 font-medium" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"}`}>
                {page}
              </button>
            ))}
            <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
