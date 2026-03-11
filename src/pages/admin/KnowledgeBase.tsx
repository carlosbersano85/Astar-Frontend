import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, useMemo } from "react";
import { Database, Plus, X, ChevronDown, Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import EmptyState from "@/components/EmptyState";
import {
  adminGetKnowledgeBase,
  adminCreateKnowledgeCategory,
  adminCreateKnowledgeEntry,
  adminUpdateKnowledgeEntry,
  type AdminKnowledgeCategory,
} from "@/lib/api";
import { getPaginationItems } from "@/lib/pagination";

type ModalType = "new" | "edit" | null;

const ITEMS_PER_PAGE = 10;

const AdminKnowledgeBase = () => {
  const [categories, setCategories] = useState<AdminKnowledgeCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalType>(null);
  const [editEntryId, setEditEntryId] = useState<string | null>(null);
  const [formCategoryId, setFormCategoryId] = useState("");
  const [formCategoryTitle, setFormCategoryTitle] = useState("");
  const [formNewCategoryTitle, setFormNewCategoryTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = (showLoader = true) => {
    if (showLoader) setLoading(true);
    adminGetKnowledgeBase().then((data) => {
      setCategories(data);
      setLoading(false);
    });
  };

  const allEntries = useMemo(
    () =>
      categories.flatMap((c) =>
        c.entries.map((e) => ({ categoryId: c.id, categoryTitle: c.title, entryId: e.id, entryContent: e.content }))
      ),
    [categories]
  );

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = useMemo(
    () =>
      allEntries.filter(
        (item) =>
          item.entryContent.toLowerCase().includes(search.toLowerCase()) ||
          item.categoryTitle.toLowerCase().includes(search.toLowerCase())
      ),
    [allEntries, search]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const groupedPaginated = useMemo(() => {
    const groups: Record<string, { id: string; content: string }[]> = {};
    paginated.forEach((item) => {
      if (!groups[item.categoryTitle]) groups[item.categoryTitle] = [];
      groups[item.categoryTitle].push({ id: item.entryId, content: item.entryContent });
    });
    return Object.entries(groups);
  }, [paginated]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const openNew = () => {
    setFormCategoryId("");
    setFormCategoryTitle("");
    setFormNewCategoryTitle("");
    setFormContent("");
    setError(null);
    setModal("new");
  };

  const openEdit = (entryId: string, content: string) => {
    setEditEntryId(entryId);
    setFormContent(content);
    setError(null);
    setModal("edit");
  };

  const closeModal = () => {
    setModal(null);
    setEditEntryId(null);
    setError(null);
  };

  const handleSubmitNew = async () => {
    const content = formContent.trim();
    if (!content) {
      setError("El contenido es obligatorio.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      let categoryId = formCategoryId;
      if (formNewCategoryTitle.trim()) {
        const newCat = await adminCreateKnowledgeCategory(formNewCategoryTitle.trim());
        if (!newCat) {
          setError("No se pudo crear la categoría.");
          setSaving(false);
          return;
        }
        categoryId = newCat.id;
      } else if (!categoryId) {
        setError("Selecciona una categoría o escribe el nombre de una nueva.");
        setSaving(false);
        return;
      }
      const created = await adminCreateKnowledgeEntry(categoryId, content);
      if (created) {
        fetchCategories(false);
        closeModal();
      } else {
        setError("No se pudo crear la entrada.");
      }
    } catch {
      setError("Error al guardar. Intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitEdit = async () => {
    if (!editEntryId) return;
    const content = formContent.trim();
    if (!content) {
      setError("El contenido es obligatorio.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const updated = await adminUpdateKnowledgeEntry(editEntryId, content);
      if (updated) {
        setCategories((prev) =>
          prev.map((c) => ({
            ...c,
            entries: c.entries.map((e) => (e.id === editEntryId ? { id: e.id, content: updated.content } : e)),
          }))
        );
        closeModal();
      } else {
        setError("No se pudo guardar la entrada.");
      }
    } catch {
      setError("Error al guardar. Intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={(e) => handleSearch(e.target.value)} placeholder="Buscar por categoría o contenido..." className="w-full pl-11 pr-4 py-3 rounded-xl bg-background/50 border border-border/50 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 text-sm" />
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-5 py-2.5 rounded-xl shimmer-gold text-primary-foreground text-sm font-medium glow-gold shrink-0">
          <Plus className="w-4 h-4" /> Nueva Entrada
        </button>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={closeModal} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative z-10 w-full max-w-lg glass-card rounded-2xl p-8 premium-shadow border border-border/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-2xl text-foreground">{modal === "new" ? "Nueva Entrada" : "Editar Entrada"}</h3>
                <button onClick={closeModal} className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                {modal === "new" && (
                  <>
                    <div>
                      <label className="text-xs tracking-widest uppercase text-muted-foreground mb-2 block">Categoría</label>
                      <div ref={dropdownRef} className="relative">
                        <button type="button" onClick={() => setDropdownOpen(!dropdownOpen)} className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-background/50 border border-border/50 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors">
                          <span className={formCategoryTitle || formNewCategoryTitle ? "text-foreground" : "text-muted-foreground/50"}>
                            {formNewCategoryTitle || formCategoryTitle || "Seleccionar categoría..."}
                          </span>
                          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                        </button>
                        <AnimatePresence>
                          {dropdownOpen && (
                            <motion.ul initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15 }} className="absolute z-20 mt-1 w-full rounded-xl bg-card border border-border/50 shadow-lg overflow-hidden">
                              {categories.map((c) => (
                                <li
                                  key={c.id}
                                  onClick={() => {
                                    setFormCategoryId(c.id);
                                    setFormCategoryTitle(c.title);
                                    setFormNewCategoryTitle("");
                                    setDropdownOpen(false);
                                  }}
                                  className={`px-4 py-2.5 text-sm cursor-pointer transition-colors hover:bg-accent/50 ${formCategoryId === c.id ? "text-primary bg-accent/30" : "text-foreground"}`}
                                >
                                  {c.title}
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs tracking-widest uppercase text-muted-foreground mb-2 block">O crear categoría nueva</label>
                      <input
                        type="text"
                        value={formNewCategoryTitle}
                        onChange={(e) => {
                          setFormNewCategoryTitle(e.target.value);
                          if (e.target.value.trim()) setFormCategoryId("");
                        }}
                        placeholder="Ej: Planetas personales"
                        className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border/50 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 text-sm"
                      />
                    </div>
                  </>
                )}
                <div>
                  <label className="text-xs tracking-widest uppercase text-muted-foreground mb-2 block">Contenido</label>
                  <textarea value={formContent} onChange={(e) => setFormContent(e.target.value)} rows={4} placeholder="Ej: Júpiter: Expansión, abundancia, sabiduría" className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border/50 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 text-sm resize-none" />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={modal === "new" ? handleSubmitNew : handleSubmitEdit}
                    disabled={saving}
                    className="px-5 py-2.5 rounded-xl shimmer-gold text-primary-foreground text-sm font-medium glow-gold disabled:opacity-50 flex items-center gap-2"
                  >
                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                    {modal === "new" ? "Crear" : "Guardar"}
                  </button>
                  <button onClick={closeModal} disabled={saving} className="px-5 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50">
                    Cancelar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : (
      <div className="space-y-6">
        {groupedPaginated.map(([title, entries], i) => (
          <motion.div key={title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card rounded-2xl p-6 premium-shadow">
            <h3 className="font-sans text-xl text-foreground mb-4 flex items-center gap-2 font-medium"><Database className="w-5 h-5 text-primary shrink-0" /> <span className="tabular-nums">{title}</span></h3>
            <div className="space-y-2">
              {entries.map((e) => (
                <div key={e.id} className="flex items-center gap-3 py-2 border-b border-border/20 last:border-0 min-h-[2.25rem]">
                  <span className="text-sm text-muted-foreground truncate min-w-0 flex-1 font-sans tabular-nums">{e.content}</span>
                  <button onClick={() => openEdit(e.id, e.content)} className="text-xs text-primary hover:text-primary/80 shrink-0">Editar</button>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
        {groupedPaginated.length === 0 && (
          <EmptyState icon={Database} message="No hay base de conocimiento." />
        )}
      </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
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

export default AdminKnowledgeBase;
