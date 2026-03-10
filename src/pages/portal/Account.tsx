import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { User, Calendar as CalendarIcon, Lock, Bell, CalendarDays, Eye, EyeOff, Camera, Loader2 } from "lucide-react";
import { format, parse } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import TimePicker from "@/components/ui/time-picker";
import { portalGetProfile } from "@/lib/api";

const Account = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<{ birthDate: string | null; birthPlace: string | null; birthTime: string | null } | null>(null);
  const [loading, setLoading] = useState(true);
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);
  const [form, setForm] = useState({
    name: user?.name || "",
    birthPlace: "",
    birthTime: "00:00",
    newPassword: "",
    confirmPassword: "",
  });
  useEffect(() => {
    portalGetProfile().then((p) => {
      if (p) {
        setProfile(p);
        setForm((f) => ({ ...f, name: p.name, birthPlace: p.birthPlace || "", birthTime: p.birthTime || "00:00" }));
        if (p.birthDate) {
          try {
            setBirthDate(parse(p.birthDate, "yyyy-MM-dd", new Date()));
          } catch {
            setBirthDate(undefined);
          }
        }
      }
      setLoading(false);
    });
  }, []);
  useEffect(() => {
    if (user?.name && !profile) setForm((f) => ({ ...f, name: user.name }));
  }, [user?.name, profile]);
  const [notifications, setNotifications] = useState({
    email: true,
    messages: true,
    offers: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const update = (f: string, v: string) => setForm((p) => ({ ...p, [f]: v }));

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="space-y-6">
        {/* Avatar Upload */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6 premium-shadow flex flex-col items-center">
          <div className="relative group cursor-pointer mb-4" onClick={() => fileInputRef.current?.click()}>
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary/30 group-hover:border-primary/60 transition-colors">
              {avatar ? (
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                  <span className="font-serif text-3xl text-primary">{user?.name?.charAt(0) || "U"}</span>
                </div>
              )}
            </div>
            <div className="absolute inset-0 rounded-full bg-background/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-6 h-6 text-foreground" />
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>
          <p className="text-sm text-foreground font-medium">{user?.name}</p>
          <p className="text-xs text-muted-foreground">{user?.email}</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-3 text-xs text-primary hover:text-primary/80 transition-colors font-medium"
          >
            Cambiar foto de perfil
          </button>
        </motion.div>

        {/* Profile */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-6 premium-shadow">
          <h3 className="font-serif text-lg text-foreground mb-4 flex items-center gap-2"><User className="w-4 h-4 text-primary" /> Datos Personales</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs tracking-widest uppercase text-muted-foreground mb-2 block">Nombre</label>
              <input value={form.name} onChange={(e) => update("name", e.target.value)} className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border/50 text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 text-sm" />
            </div>
            <div>
              <label className="text-xs tracking-widest uppercase text-muted-foreground mb-2 block">Email</label>
              <input value={user?.email || ""} disabled className="w-full px-4 py-3 rounded-xl bg-background/30 border border-border/30 text-muted-foreground text-sm cursor-not-allowed" />
            </div>
          </div>
        </motion.div>

        {/* Birth data */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-2xl p-6 premium-shadow">
          <h3 className="font-serif text-lg text-foreground mb-4 flex items-center gap-2"><CalendarIcon className="w-4 h-4 text-primary" /> Datos de Nacimiento</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs tracking-widest uppercase text-muted-foreground mb-2 block">Fecha</label>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    className={cn(
                      "w-full px-4 py-3 rounded-xl bg-background/50 border border-border/50 text-sm text-left flex items-center justify-between transition-colors focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20",
                      birthDate ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {birthDate ? format(birthDate, "dd/MM/yyyy") : "Seleccionar fecha"}
                    <CalendarDays className="w-4 h-4 text-muted-foreground" />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 border-border/50 bg-card/95 backdrop-blur-xl shadow-[0_8px_32px_hsl(var(--primary)/0.1)] rounded-xl"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={birthDate}
                    onSelect={setBirthDate}
                    defaultMonth={birthDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <label className="text-xs tracking-widest uppercase text-muted-foreground mb-2 block">Hora</label>
              <TimePicker value={form.birthTime} onChange={(v) => update("birthTime", v)} />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs tracking-widest uppercase text-muted-foreground mb-2 block">Lugar</label>
              <input value={form.birthPlace} onChange={(e) => update("birthPlace", e.target.value)} className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border/50 text-foreground focus:outline-none focus:border-primary/50 text-sm" />
            </div>
          </div>
        </motion.div>

        {/* Security */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-2xl p-6 premium-shadow">
          <h3 className="font-serif text-lg text-foreground mb-4 flex items-center gap-2"><Lock className="w-4 h-4 text-primary" /> Seguridad</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs tracking-widest uppercase text-muted-foreground mb-2 block">Nueva Contraseña</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={form.newPassword} onChange={(e) => update("newPassword", e.target.value)} placeholder="••••••••" className="w-full px-4 py-3 pr-11 rounded-xl bg-background/50 border border-border/50 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 text-sm" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs tracking-widest uppercase text-muted-foreground mb-2 block">Confirmar Contraseña</label>
              <div className="relative">
                <input type={showConfirm ? "text" : "password"} value={form.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)} placeholder="••••••••" className="w-full px-4 py-3 pr-11 rounded-xl bg-background/50 border border-border/50 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 text-sm" />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card rounded-2xl p-6 premium-shadow">
          <h3 className="font-serif text-lg text-foreground mb-4 flex items-center gap-2"><Bell className="w-4 h-4 text-primary" /> Notificaciones</h3>
          <div className="space-y-4">
            {[
              { key: "email" as const, label: "Notificaciones por email" },
              { key: "messages" as const, label: "Alertas de mensajes" },
              { key: "offers" as const, label: "Ofertas y novedades" },
            ].map((n) => (
              <label key={n.key} className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-muted-foreground">{n.label}</span>
                <button
                  type="button"
                  onClick={() => setNotifications((p) => ({ ...p, [n.key]: !p[n.key] }))}
                  className={`relative w-11 h-6 rounded-full transition-colors ${notifications[n.key] ? "bg-primary" : "bg-muted-foreground/30"}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-foreground transition-transform ${notifications[n.key] ? "translate-x-5 bg-primary-foreground" : ""}`} />
                </button>
              </label>
            ))}
          </div>
        </motion.div>

        <button className="w-full py-3.5 rounded-xl shimmer-gold font-medium tracking-wide text-sm glow-gold text-foreground">
          Guardar Cambios
        </button>
      </div>
    </div>
  );
};

export default Account;
