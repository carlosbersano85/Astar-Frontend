import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { HelpCircle, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import EmptyState from "@/components/EmptyState";

const ITEMS_PER_PAGE = 10;

type QuestionItem = { id: string; user: string; question: string; status: string; date: string };

const AdminQuestions = () => {
  const [questions] = useState<QuestionItem[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = questions.filter(
    (q) =>
      q.user.toLowerCase().includes(search.toLowerCase()) ||
      q.question.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const statusLabels: Record<string, { label: string; cls: string }> = {
    new: { label: "Nueva", cls: "bg-primary/10 text-primary" },
    waiting: { label: "En espera", cls: "bg-accent text-accent-foreground" },
    answered: { label: "Respondida", cls: "bg-muted text-muted-foreground" },
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Buscar por usuario o pregunta..."
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-background/50 border border-border/50 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 text-sm"
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-2xl premium-shadow overflow-hidden"
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/30">
              <th className="text-left p-4 text-muted-foreground font-normal">Usuario</th>
              <th className="text-left p-4 text-muted-foreground font-normal">Pregunta</th>
              <th className="text-left p-4 text-muted-foreground font-normal">Estado</th>
              <th className="text-left p-4 text-muted-foreground font-normal">Fecha</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((q) => (
              <tr key={q.id} className="border-b border-border/20 hover:bg-accent/30 transition-colors">
                <td className="p-4 text-foreground">{q.user}</td>
                <td className="p-4 text-muted-foreground max-w-xs truncate">{q.question}</td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${statusLabels[q.status]?.cls ?? "bg-muted text-muted-foreground"}`}>
                    {statusLabels[q.status]?.label ?? q.status}
                  </span>
                </td>
                <td className="p-4 text-muted-foreground">{q.date}</td>
                <td className="p-4">
                  <Link to={`/admin/questions/${q.id}`} className="text-primary text-xs hover:text-primary/80">
                    Responder →
                  </Link>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={5} className="p-0">
                  <EmptyState icon={HelpCircle} message="No hay preguntas." />
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
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`w-8 h-8 rounded-lg text-sm transition-colors ${
                  page === currentPage ? "bg-primary/10 text-primary border border-primary/20 font-medium" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminQuestions;
