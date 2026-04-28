import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ServiceCards from "@/components/landing/ServiceCards";
import { motion } from "framer-motion";
import { PrivacyPolicyModal } from "@/components/legal/LegalDocumentsModal";
import { TermsModal } from "@/components/legal/LegalDocumentsModal";
import { Menu, X } from "lucide-react";

// Brand colors
const colors = {
  purple: "#573759",
  gold: "#7c603e",
  goldBright: "#e8c46a",
  goldLight: "#bda76c",
  lavender: "#c39ed6",
  arena: "#cdb6a8",
  background: "#080010",
  textMuted: "#a89ab5",
};

// Testimonials data
const testimonials = [
  { text: "Hace años me diste una orientación cuando migré a otro país. 5 años después, todo pasó tal cual me dijiste. Tu trabajo cambió mi manera de ver lo que estaba viviendo.", name: "Valentina", origin: "Francia", initial: "V" },
  { text: "Hace un año me diste una mirada sobre algo que creía imposible. Hoy se está cumpliendo tal cual lo describiste. Nunca había encontrado tanta precisión.", name: "Lucía", origin: "Argentina", initial: "L" },
  { text: "Tu lectura me dejó sin palabras. Ha sido una herramienta invaluable para mi crecimiento personal. Tus habilidades son impresionantes y estoy profundamente agradecido.", name: "Hernán", origin: "Uruguay", initial: "H" },
  { text: "Vine con un problema que me hacía sufrir mucho. El análisis de Carlos no solo me ayudó con eso — también sanó algo mucho más profundo que yo ni sabía que cargaba.", name: "Karen", origin: "España", initial: "K" },
  { text: "Casi 8 años consultándote y nunca fallás. Super claro siempre. Muchas gracias — sos parte de mi proceso desde hace años.", name: "Gabriela", origin: "Argentina", initial: "G" },
  { text: "Al leer lo que Carlos describió pensé que era imposible según mi contexto. Simplemente sucedió tal cual. No tengo otra explicación que su precisión.", name: "Marcos", origin: "México", initial: "M" },
  { text: "Tu trabajo es realmente inspirador y ha dejado una huella positiva en mí. Me sentí profundamente acompañado, con claridad y un espacio seguro para entenderme.", name: "Ricardo", origin: "Colombia", initial: "R" },
  { text: "Tengo el privilegio de ser guiada por Carlos. Su capacidad para leer lo que está pasando realmente es algo que no encontré en ningún otro lugar.", name: "Sofía", origin: "Italia", initial: "S" },
];

// FAQ data
const faqItems = [
  { q: "¿Esto predice el futuro?", a: "No en el sentido tradicional. Astar te ayuda a entender los patrones que están generando tu presente — y eso es lo que realmente te permite anticipar y cambiar lo que viene." },
  { q: "¿Necesito saber de astrología?", a: "Para nada. El portal está diseñado para que entiendas tu carta desde el primer día, sin formación previa." },
  { q: "¿El chatbot es IA genérica?", a: "No. Está entrenado por Carlos con cientos de consultas reales. Habla con su voz y su enfoque — no es un asistente genérico." },
  { q: "¿Las respuestas de Carlos son automáticas?", a: "No. La respuesta mensual del plan Luminary la graba o escribe Carlos en persona — sin IA. Es 100% humana y personalizada para tu situación." },
  { q: "¿Puedo cancelar cuando quiera?", a: "Sí, sin letra chica. El plan Luminary se puede cancelar en cualquier momento desde tu portal, sin penalidades." },
  { q: "¿Las consultas extras son para cualquiera?", a: "Las consultas puntuales y servicios extras son exclusivos para suscriptores del plan Luminary, con precio especial. No están disponibles en el plan gratuito." },
];

// Brand phrases
const frases = [
  "No es lo que te pasa… es cómo lo estás interpretando.",
  "No es el otro… es lo que ese otro activa en ti.",
  "No es falta de oportunidades… es un patrón que se está repitiendo.",
  "No es destino… es repetición inconsciente.",
];

const Index = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Carlos", hash: "#carlos" },
    { to: "/subscribe", label: "Planes" },
    { to: "/", label: "Servicios", hash: "#servicios" },
  ] as const;

  // Stars canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawStars = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.body.scrollHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // White stars
      for (let i = 0; i < 300; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const r = Math.random() * 1.4;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.55 + 0.1})`;
        ctx.fill();
      }
      // Gold stars
      for (let i = 0; i < 50; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        ctx.beginPath();
        ctx.arc(x, y, Math.random() * 1.1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232,196,106,${Math.random() * 0.35 + 0.1})`;
        ctx.fill();
      }
    };

    drawStars();
    window.addEventListener("resize", drawStars);
    setTimeout(drawStars, 400);

    return () => window.removeEventListener("resize", drawStars);
  }, []);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Nav scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const nav = document.querySelector("nav");
      if (!nav) return;
      if (window.scrollY > 60) {
        (nav as HTMLElement).style.background = "rgba(8,0,16,0.97)";
        (nav as HTMLElement).style.borderBottom = "1px solid rgba(87,55,89,0.3)";
      } else {
        (nav as HTMLElement).style.background = "transparent";
        (nav as HTMLElement).style.borderBottom = "none";
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // FAQ accordion
  const toggleFaq = (index: number) => {
    const items = document.querySelectorAll(".faq-item");
    items.forEach((item, i) => {
      if (i === index) {
        item.classList.toggle("open");
      } else {
        item.classList.remove("open");
      }
    });
  };

  return (
    <main className="bg-[#080010] text-white min-h-screen overflow-x-hidden relative">
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" id="stars" />

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 md:px-[60px] py-4 md:py-5 transition-all duration-300" style={{ background: "transparent" }}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="font-serif text-xl sm:text-2xl font-black tracking-[3px] sm:tracking-[4px] leading-none">ASTAR</span>
            <span className="hidden sm:block text-[9px] font-normal tracking-[4px] uppercase whitespace-nowrap" style={{ color: colors.goldLight }}>Astrología · Numerología · Tarot</span>
          </div>

          <div className="hidden lg:flex items-center gap-10 list-none">
            {navLinks.map((link) => (
              "hash" in link ? (
                <a
                  key={link.to + link.hash}
                  href={link.to + link.hash}
                  onClick={(e) => {
                    if (window.location.pathname === link.to) {
                      e.preventDefault();
                      document.getElementById(link.hash.slice(1))?.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="text-xs font-semibold tracking-[2px] uppercase text-[#cdb6a8] hover:text-white transition-colors"
                >
                  {link.label}
                </a>
              ) : (
                <Link key={link.to} to={link.to} className="text-xs font-semibold tracking-[2px] uppercase text-[#cdb6a8] hover:text-white transition-colors">
                  {link.label}
                </Link>
              )
            ))}
            <Link to="/portal" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold uppercase transition-all hover:opacity-90" style={{ background: colors.goldBright, color: "#080010" }}>
              <span style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>♦</span>
              Entrar →
            </Link>
          </div>

          <div className="flex items-center gap-3 lg:hidden">
            <Link to="/register" className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold uppercase" style={{ background: colors.goldBright, color: "#080010" }}>
              Entrar
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Abrir menú"
              aria-expanded={menuOpen}
              className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-[rgba(205,182,168,0.25)] text-[#f0e8d8] hover:border-[#bda76c] hover:text-[#bda76c] transition-colors"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed top-[72px] left-0 right-0 z-40 lg:hidden px-4 sm:px-6">
          <div className="rounded-2xl border border-[rgba(189,167,108,0.18)] bg-[#0d0518]/95 backdrop-blur-xl p-4 shadow-2xl">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                "hash" in link ? (
                  <a
                    key={link.to + link.hash}
                    href={link.to + link.hash}
                    onClick={(e) => {
                      setMenuOpen(false);
                      if (window.location.pathname === link.to) {
                        e.preventDefault();
                        document.getElementById(link.hash.slice(1))?.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className="rounded-xl px-4 py-3 text-sm font-semibold tracking-[1.5px] uppercase text-[#cdb6a8] hover:text-white hover:bg-white/5 transition-colors"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-xl px-4 py-3 text-sm font-semibold tracking-[1.5px] uppercase text-[#cdb6a8] hover:text-white hover:bg-white/5 transition-colors"
                  >
                    {link.label}
                  </Link>
                )
              ))}
            </div>
          </div>
        </div>
      )}

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center text-center px-4 sm:px-6 md:px-[60px] py-[120px] z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[58%] w-[800px] h-[500px] rounded-[50%] pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(195,158,214,0.28) 0%, rgba(87,55,89,0.2) 40%, transparent 70%)", filter: "blur(24px)", animation: "pulseGlow 5s ease-in-out infinite" }} />
        
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-20">
          <div className="inline-flex items-center gap-2 rounded-full px-5 py-2 mb-9" style={{ background: "rgba(87,55,89,0.4)", border: "1px solid rgba(189,167,108,0.3)" }}>
            <span style={{ color: colors.goldBright }}>◆</span>
            <span className="text-[10px] font-semibold tracking-[3px] uppercase" style={{ color: colors.goldLight }}>Portal de Autoconocimiento</span>
          </div>
          
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-black leading-[0.95] tracking-[-2px] mb-3">
            <span className="block text-white">Tu propio espacio para encontrarle</span>
            <span className="block italic" style={{ background: "linear-gradient(90deg, #e8c46a 0%, #d5b0dd 30%, #ffffff 50%, #d5b0dd 70%, #e8c46a 100%)", backgroundSize: "300% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "shimmerText 3s linear infinite" }}>sentido a lo que vivís.</span>
          </h1>
          
          <p className="font-serif text-lg md:text-xl italic text-[#c39ed6] max-w-[540px] mx-auto mt-7 mb-[52px] leading-relaxed">Porque entender lo que te pasa cambia todo lo que decidís después.</p>
          
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/register" className="inline-flex items-center gap-2.5 px-10 py-4 rounded-full text-xs font-bold tracking-[2px] uppercase transition-all hover:opacity-90 hover:translate-y-[-2px]" style={{ background: colors.goldBright, color: "#080010", boxShadow: "0 20px 60px rgba(232,196,106,0.3)" }}>
              Acceder al portal →
            </Link>
            <a href="#video" className="inline-flex items-center gap-2 px-10 py-4 rounded-full text-xs font-semibold tracking-[2px] uppercase border transition-all hover:border-[#bda76c] hover:text-[#bda76c]" style={{ borderColor: "rgba(205,182,168,0.3)", color: "#f0e8d8" }}>
              Ver cómo funciona
            </a>
          </div>
        </motion.div>
        
        <div className="absolute bottom-9 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#a89ab5] text-[9px] tracking-[3px] uppercase animate-bounce">
          <span>Explorar</span>
          <div className="w-px h-9 bg-gradient-to-b from-[#bda76c] to-transparent" />
        </div>
      </section>

      {/* PREMISA */}
      <section className="relative z-10 py-24" style={{ background: "linear-gradient(135deg, rgba(87,55,89,0.12) 0%, rgba(30,5,53,0.7) 100%)", borderTop: "1px solid rgba(189,167,108,0.12)", borderBottom: "1px solid rgba(189,167,108,0.12)" }}>
        <div className="max-w-[1200px] mx-auto px-[60px]">
          <div className="grid md:grid-cols-2 gap-20 items-center fade-in">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-7" style={{ background: "rgba(87,55,89,0.3)", border: "1px solid rgba(189,167,108,0.25)" }}>
                <span style={{ color: colors.goldBright }}>◆</span>
                <span className="text-[9px] font-bold tracking-[3px] uppercase" style={{ color: colors.goldLight }}>La premisa</span>
              </div>
              <p className="font-serif text-2xl md:text-3xl italic font-normal leading-relaxed text-white border-l-2 pl-8" style={{ borderColor: colors.goldBright }}>
                "El problema nunca es <span style={{ color: colors.goldBright }}>lo que te pasa</span>.<br />
                Es que todavía no entendés<br />
                <span style={{ color: colors.goldBright }}>por qué te pasa</span>."
              </p>
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex gap-5 items-start">
                <span className="font-numeric text-[34px] font-black text-white opacity-20 leading-none w-11">01</span>
                <div>
                  <strong className="block text-xs font-bold tracking-[1px] uppercase mb-1" style={{ color: colors.goldLight }}>Detectar el patrón</strong>
                  <p className="text-sm text-[#a89ab5] leading-relaxed">La astrología describe los mecanismos internos que generan tus resultados externos.</p>
                </div>
              </div>
              <div className="flex gap-5 items-start">
                <span className="font-numeric text-[34px] font-black text-white opacity-20 leading-none w-11">02</span>
                <div>
                  <strong className="block text-xs font-bold tracking-[1px] uppercase mb-1" style={{ color: colors.goldLight }}>Comprender cómo opera</strong>
                  <p className="text-sm text-[#a89ab5] leading-relaxed">No es lo que te pasa — es cómo lo estás interpretando. Ahí empieza la transformación.</p>
                </div>
              </div>
              <div className="flex gap-5 items-start">
                <span className="font-numeric text-[34px] font-black text-white opacity-20 leading-none w-11">03</span>
                <div>
                  <strong className="block text-xs font-bold tracking-[1px] uppercase mb-1" style={{ color: colors.goldLight }}>Abrir la posibilidad</strong>
                  <p className="text-sm text-[#a89ab5] leading-relaxed">Si lo generaste, también podés cambiarlo. Esa es la mejor noticia posible.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MÓDULOS */}
      <section className="relative z-10 py-24">
        <div className="max-w-[1200px] mx-auto px-[60px]">
          <div className="fade-in mb-16">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-7" style={{ background: "rgba(87,55,89,0.3)", border: "1px solid rgba(189,167,108,0.25)" }}>
              <span style={{ color: colors.goldBright }}>◆</span>
              <span className="text-[9px] font-bold tracking-[3px] uppercase" style={{ color: colors.goldLight }}>Lo que encontrás adentro</span>
            </div>
            <h2 className="font-serif text-4xl md:text-6xl font-black leading-none tracking-[-1px] mb-5">
              Todo lo que<br /><span style={{ color: colors.goldBright, fontStyle: "italic" }}>necesitás.</span>
            </h2>
            <p className="font-serif text-xl font-light text-[#a89ab5] leading-relaxed max-w-[600px]">Un sistema integrado de herramientas que habla un solo idioma: el tuyo.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { tag: "Core", icon: "☉", title: "Carta Natal", desc: "Tu mapa completo. Sol, Luna, Ascendente, planetas en casas y signos. El punto de partida de todo.", items: ["Patrones inconscientes y arquetipos", "Informe personal completo"] },
              { tag: "Predictivo", icon: "◎", title: "Mirada Predictiva", desc: "Tres herramientas combinadas para entender qué momento estás viviendo y hacia dónde va tu energía.", items: ["Revolución Solar — el mapa de tu año", "Numerología — tus ciclos personales", "Tarot psicológico — qué está emergiendo"] },
              { tag: "Numerología", icon: "✦", title: "Numerología Completa", desc: "Alma, expresión, destino, potencial. Los números como otro lenguaje del mismo patrón.", items: ["Número del alma y expresión", "Ciclos, desafíos y potenciales"] },
              { tag: "Tarot", icon: "☽", title: "Espejo de los Arcanos", desc: "Lecturas que van más allá de la carta y tocan el patrón real. No predicción — comprensión profunda.", items: ["Lecturas integradas a tu carta natal", "Arquetipos en tu historia personal"] },
              { tag: "Luminary", icon: "◈", title: "Sinastría", desc: "No es el otro — es lo que ese otro activa en ti. Compatibilidad y vínculos desde adentro.", items: ["Mapa relacional completo", "Patrones y activaciones mutuas"] },
              { tag: "Personal · Luminary", icon: "★", title: "Respuestas de Carlos", desc: "Podés preguntarle lo que quieras — cualquier tema. Carlos responde personalmente, sin ninguna IA de por medio.", items: ["Cualquier tema, sin restricciones", "1 respuesta humana personalizada por mes", "Acceso a servicios extras especiales"], highlight: true },
            ].map((modulo, i) => (
              <div key={i} className="rounded-2xl p-7 transition-all duration-400 hover:translate-y-[-4px] fade-in" style={{ background: "rgba(87,55,89,0.1)", border: "1px solid rgba(87,55,89,0.4)" }}>
                <span className="text-[8px] font-bold tracking-[2.5px] uppercase inline-block mb-4" style={{ color: colors.goldLight, background: "rgba(189,167,108,0.1)", border: "1px solid rgba(189,167,108,0.2)", borderRadius: "10px", padding: "4px 10px" }}>{modulo.tag}</span>
                {modulo.highlight && (
                  <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 mb-3.5 text-[10px] font-bold tracking-[1.5px] uppercase" style={{ background: "rgba(232,196,106,0.12)", border: "1px solid rgba(232,196,106,0.35)", color: colors.goldBright }}>
                    ★ No es IA — es Carlos en persona
                  </div>
                )}
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 text-xl" style={{ background: "rgba(189,167,108,0.1)" }}>{modulo.icon}</div>
                <h3 className="font-serif text-lg font-bold text-white mb-2.5">{modulo.title}</h3>
                <p className="text-sm text-[#a89ab5] leading-relaxed mb-4">{modulo.desc}</p>
                <ul className="flex flex-col gap-1.5">
                  {modulo.items.map((item, j) => (
                    <li key={j} className="text-sm text-[#cdb6a8] flex items-start gap-2">
                      <span style={{ color: colors.goldBright }}>›</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CHATBOT */}
      <section className="relative z-10 py-24" style={{ background: "linear-gradient(135deg, rgba(30,5,53,0.9) 0%, rgba(87,55,89,0.2) 100%)", borderTop: "1px solid rgba(189,167,108,0.12)", borderBottom: "1px solid rgba(189,167,108,0.12)" }}>
        <div className="max-w-[1200px] mx-auto px-[60px]">
          <div className="grid md:grid-cols-2 gap-20 items-center fade-in">
            <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(20,5,35,0.95)", border: "1px solid rgba(87,55,89,0.6)", boxShadow: "0 40px 100px rgba(0,0,0,0.5)" }}>
              <div className="p-4 flex items-center gap-3" style={{ background: "rgba(87,55,89,0.4)", borderBottom: "1px solid rgba(87,55,89,0.4)" }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-base font-bold" style={{ background: `linear-gradient(135deg, ${colors.purple}, ${colors.gold})` }}>✦</div>
                <div>
                  <strong className="block text-sm font-bold text-white">Astar IA</strong>
                  <span className="text-[10px]" style={{ color: colors.goldLight, letterSpacing: "1px" }}>Entrenado por Carlos Bersano</span>
                </div>
                <div className="w-2 h-2 rounded-full ml-auto" style={{ background: "#4ade80", boxShadow: "0 0 8px #4ade80" }} />
              </div>
              <div className="p-6 flex flex-col gap-4">
                <div className="max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed self-start" style={{ background: "rgba(87,55,89,0.4)", color: "#cdb6a8", borderBottomLeftRadius: "4px" }}>
                  Hola. Contame — ¿qué es lo que sentís que se repite en tu vida y no podés terminar de entender?
                </div>
                <div className="max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed self-end" style={{ background: "rgba(232,196,106,0.15)", border: "1px solid rgba(232,196,106,0.2)", color: "white", borderBottomRightRadius: "4px" }}>
                  Siempre llego a un punto en mis relaciones donde siento que doy demasiado y nadie me ve realmente.
                </div>
                <div className="max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed self-start" style={{ background: "rgba(87,55,89,0.55)", border: "1px solid rgba(232,196,106,0.2)", color: "#cdb6a8", borderBottomLeftRadius: "4px" }}>
                  Lo que describís no es mala suerte. Hay algo tuyo que elige ese lugar una y otra vez — y cuando lo entendés, podés elegir diferente.
                  <Link to="/subscribe" className="block mt-2.5 text-[11px] font-bold tracking-[1.5px] uppercase" style={{ color: colors.goldBright, borderBottom: "1px solid rgba(232,196,106,0.3)", paddingBottom: "2px", width: "fit-content" }}>Enviar a Carlos →</Link>
                </div>
              </div>
            </div>
            <div>
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-7" style={{ background: "rgba(87,55,89,0.3)", border: "1px solid rgba(189,167,108,0.25)" }}>
                <span style={{ color: colors.goldBright }}>◆</span>
                <span className="text-[9px] font-bold tracking-[3px] uppercase" style={{ color: colors.goldLight }}>Dentro del portal</span>
              </div>
              <h2 className="font-serif text-3xl md:text-5xl font-black leading-none mb-5">
                Un asistente<br /><span style={{ color: colors.goldBright, fontStyle: "italic" }}>que te conoce.</span>
              </h2>
              <p className="font-serif text-lg font-light text-[#cdb6a8] leading-relaxed mb-4">Dentro del portal hay un chatbot creado y entrenado por Carlos — construido sobre cientos de consultas reales, con su voz, su manera de ver y su forma de acompañar.</p>
              <p className="font-serif text-lg font-light text-[#a89ab5] leading-relaxed mb-6">No es una IA genérica. Es una herramienta que habla desde años de trabajo con personas reales.</p>
              <div className="flex flex-wrap gap-2.5 mb-6">
                {["Tu carta natal integrada", "Voz de Carlos", "Disponible 24/7", "Contexto personalizado"].map((chip, i) => (
                  <span key={i} className="rounded-full px-4 py-1.5 text-sm" style={{ background: "rgba(87,55,89,0.3)", border: "1px solid rgba(195,158,214,0.2)", color: colors.lavender }}>{chip}</span>
                ))}
              </div>
              <Link to="/subscribe" className="inline-flex items-center gap-2.5 px-10 py-4 rounded-full text-xs font-bold tracking-[2px] uppercase transition-all hover:opacity-90" style={{ background: colors.goldBright, color: "#080010" }}>
                Quiero acceder →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* VIDEO */}
      <section className="relative z-10 py-24"  id="video">
        <div className="max-w-[1200px] mx-auto px-[60px]">
          <div className="fade-in">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-7" style={{ background: "rgba(87,55,89,0.3)", border: "1px solid rgba(189,167,108,0.25)" }}>
              <span style={{ color: colors.goldBright }}>◆</span>
              <span className="text-[9px] font-bold tracking-[3px] uppercase" style={{ color: colors.goldLight }}>Mirá el portal por dentro</span>
            </div>
            <h2 className="font-serif text-4xl md:text-6xl font-black leading-none tracking-[-1px] mb-5">
              Antes de entrar,<br /><span style={{ color: colors.goldBright, fontStyle: "italic" }}>conoce qué hay.</span>
            </h2>
          </div>
          <div className="mt-14 rounded-2xl overflow-hidden border" style={{ background: "rgba(20,5,35,0.9)", borderColor: "rgba(87,55,89,0.5)", aspectRatio: "16/9" }}>
            <div className="w-full h-full flex items-center justify-center flex-col gap-5">
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl transition-all cursor-pointer hover:scale-108" style={{ background: "rgba(232,196,106,0.15)", border: "2px solid rgba(232,196,106,0.4)", color: colors.goldBright }}>▶</div>
              <span className="text-sm tracking-[2px] uppercase text-[#a89ab5]">Video próximamente</span>
            </div>
          </div>
        </div>
      </section>

      {/* PARA QUIÉN */}
      <section className="relative z-10 py-24" style={{ background: "linear-gradient(180deg, transparent 0%, rgba(30,5,53,0.5) 50%, transparent 100%)" }}>
        <div className="max-w-[1200px] mx-auto px-[60px]">
          <div className="text-center mb-16 fade-in">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-7" style={{ background: "rgba(87,55,89,0.3)", border: "1px solid rgba(189,167,108,0.25)" }}>
              <span style={{ color: colors.goldBright }}>◆</span>
              <span className="text-[9px] font-bold tracking-[3px] uppercase" style={{ color: colors.goldLight }}>¿Esto es para ti?</span>
            </div>
            <h2 className="font-serif text-4xl md:text-6xl font-black leading-none mb-5">
              Para quien <span style={{ color: colors.goldBright, fontStyle: "italic" }}>siente</span><br />que hay algo más.
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { emoji: "🔄", title: "La que repite", desc: "Siempre el mismo tipo de vínculo, el mismo punto límite. No es mala suerte — es un patrón que todavía no entendiste.", pred: "Si querés saber qué viene, primero hay que entender qué se está repitiendo. Ahí está la respuesta." },
              { emoji: "🌀", title: "La que busca sentido", desc: "Algo cambió y no entendés por qué. Las decisiones racionales no te convencen. Necesitás un mapa, no un horóscopo.", pred: "Muchas veces lo que querés saber del futuro ya está escrito en lo que estás viviendo hoy." },
              { emoji: "🧭", title: "La que quiere entenderse", desc: "No te conformás con \"así soy yo\". Querés entender tus mecanismos reales para poder hacer algo con ellos.", pred: "Cuando te entendés, el futuro deja de ser algo que te pasa — y empieza a ser algo que construís." },
            ].map((card, i) => (
              <div key={i} className="rounded-2xl p-9 text-center transition-all duration-400 hover:translate-y-[-6px] fade-in" style={{ background: "rgba(20,5,35,0.8)", border: "1px solid rgba(87,55,89,0.5)" }}>
                <span className="text-5xl block mb-4">{card.emoji}</span>
                <h3 className="font-serif text-xl font-bold italic mb-3" style={{ color: colors.goldBright }}>{card.title}</h3>
                <p className="text-sm text-[#a89ab5] leading-relaxed mb-3">{card.desc}</p>
                <p className="text-sm text-[#c39ed6] italic leading-relaxed pt-3 border-t border-[rgba(195,158,214,0.15)]">{card.pred}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BANNER CTA */}
      <div className="relative z-10 py-16 fade-in" style={{ background: "linear-gradient(135deg, rgba(87,55,89,0.5) 0%, rgba(60,35,64,0.8) 100%)", borderTop: "1px solid rgba(232,196,106,0.2)", borderBottom: "1px solid rgba(232,196,106,0.2)" }}>
        <div className="max-w-[1200px] mx-auto px-[60px] flex items-center justify-between gap-10 flex-wrap">
          <div>
            <h3 className="font-serif text-2xl md:text-4xl font-black text-white mb-2">Tu portal te espera.<br />Empezá gratis hoy.</h3>
            <p className="text-sm text-[#a89ab5]">Sin tarjeta. Sin compromiso. Con todo lo que necesitás para empezar.</p>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <Link to="/register" className="inline-flex items-center gap-2.5 px-10 py-4 rounded-full text-xs font-bold tracking-[2px] uppercase transition-all hover:opacity-90 hover:translate-y-[-2px]" style={{ background: colors.goldBright, color: "#080010", boxShadow: "0 20px 60px rgba(232,196,106,0.3)" }}>
              Crear mi portal →
            </Link>
            <Link to="/subscribe" className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-xs font-semibold tracking-[2px] uppercase border transition-all hover:border-[#bda76c] hover:text-[#bda76c]" style={{ background: "rgba(87,55,89,0.25)", border: "1px solid rgba(195,158,214,0.25)", color: colors.lavender }}>
              Ver planes
            </Link>
          </div>
        </div>
      </div>

      {/* CARLOS */}
      <section className="relative z-10 py-24" id="carlos" style={{ borderTop: "1px solid rgba(189,167,108,0.1)", borderBottom: "1px solid rgba(189,167,108,0.1)", background: "rgba(87,55,89,0.06)" }}>
        <div className="max-w-[1200px] mx-auto px-[60px]">
          <div className="grid md:grid-cols-2 gap-20 items-center fade-in">
            <div className="relative">
              <div className="w-full aspect-[3/4] rounded-2xl flex items-center justify-center flex-col gap-3" style={{ background: `linear-gradient(135deg, rgba(87,55,89,0.4), rgba(30,5,53,0.8))`, border: "1px solid rgba(189,167,108,0.2)" }}>
                <span className="text-6xl opacity-25" style={{ color: "rgba(189,167,108,0.25)" }}>◉</span>
                <span className="text-sm tracking-[1px] text-[#a89ab5]">Foto de Carlos</span>
              </div>
              <div className="absolute -top-5 -right-5 w-[90px] h-[90px] rounded-full border-2" style={{ borderColor: "rgba(232,196,106,0.18)" }} />
              <div className="absolute -bottom-7 -left-7 w-[130px] h-[130px] rounded-full border" style={{ borderColor: "rgba(87,55,89,0.4)" }} />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-7" style={{ background: "rgba(87,55,89,0.3)", border: "1px solid rgba(189,167,108,0.25)" }}>
                <span style={{ color: colors.goldBright }}>◆</span>
                <span className="text-[9px] font-bold tracking-[3px] uppercase" style={{ color: colors.goldLight }}>Quién está detrás</span>
              </div>
              <h2 className="font-serif text-5xl font-black leading-none mb-1.5">
                Carlos<br /><span style={{ color: colors.goldBright, fontStyle: "italic" }}>Bersano</span>
              </h2>
              <p className="text-xs font-semibold tracking-[3px] uppercase mb-8" style={{ color: colors.goldLight }}>Astrólogo · Numerólogo · Coach con formación en PNL</p>
              <p className="font-serif text-lg font-light text-[#cdb6a8] leading-relaxed mb-5">Desde chico supe que los misterios no eran algo a temer — eran algo a explorar. Me fascinaban no porque predecían el futuro, sino porque revelaban algo que la mayoría prefiere ignorar: lo que vivimos afuera es un reflejo de lo que somos adentro.</p>
              <p className="font-serif text-lg font-light text-[#cdb6a8] leading-relaxed mb-9">Hoy, después de miles de consultas privadas, entiendo algo que no se aprende en ningún libro: el problema nunca es lo que te pasa. Es que todavía no entendés por qué te pasa.</p>
              <div className="flex gap-10 pt-9 border-t border-[rgba(189,167,108,0.15)]">
                <div>
                  <span className="font-numeric text-[34px] font-black block" style={{ color: colors.goldBright }}>5.000+</span>
                  <span className="text-[10px] text-[#a89ab5] tracking-[1px] uppercase mt-1 block">Consultas privadas</span>
                </div>
                <div>
                  <span className="font-numeric text-[34px] font-black block" style={{ color: colors.goldBright }}>2.000+</span>
                  <span className="text-[10px] text-[#a89ab5] tracking-[1px] uppercase mt-1 block">Cartas astrales</span>
                </div>
                <div>
                  <span className="font-serif text-[34px] font-black block" style={{ color: colors.goldBright }}>Referente</span>
                  <span className="text-[10px] text-[#a89ab5] tracking-[1px] uppercase mt-1 block">Consultor internacional</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section className="relative z-10 py-24" style={{ background: "linear-gradient(135deg, rgba(30,5,53,0.95) 0%, rgba(87,55,89,0.15) 100%)", borderTop: "1px solid rgba(189,167,108,0.12)", borderBottom: "1px solid rgba(189,167,108,0.12)" }}>
        <div className="max-w-[1200px] mx-auto px-[60px]">
          <div className="text-center mb-16 fade-in">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-7" style={{ background: "rgba(87,55,89,0.3)", border: "1px solid rgba(189,167,108,0.25)" }}>
              <span style={{ color: colors.goldBright }}>◆</span>
              <span className="text-[9px] font-bold tracking-[3px] uppercase" style={{ color: colors.goldLight }}>Lo que dicen quienes trabajaron con Carlos</span>
            </div>
            <h2 className="font-serif text-4xl md:text-6xl font-black leading-none mb-5">
              Resultados<br /><span style={{ color: colors.goldBright, fontStyle: "italic" }}>reales.</span>
            </h2>
            <p className="font-serif text-xl font-light text-[#a89ab5] leading-relaxed max-w-[600px] mx-auto">Estas son palabras de personas reales, después de sus sesiones. El portal es nuevo — pero el trabajo de Carlos no lo es.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 fade-in">
            {testimonials.map((testi, i) => (
              <div key={i} className="rounded-2xl p-9 relative" style={{ background: "rgba(20,5,35,0.85)", border: "1px solid rgba(87,55,89,0.5)" }}>
                <span className="absolute top-4 left-6 font-serif text-6xl opacity-20" style={{ color: "rgba(232,196,106,0.12)" }}>"</span>
                <p className="font-serif text-base font-light italic text-[#cdb6a8] leading-relaxed mb-6 relative z-10">{testi.text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: `linear-gradient(135deg, ${colors.purple}, ${colors.gold})` }}>{testi.initial}</div>
                  <div>
                    <span className="block text-sm font-bold" style={{ color: colors.goldLight, letterSpacing: "1px" }}>{testi.name}</span>
                    <span className="text-xs text-[#a89ab5]">{testi.origin}</span>
                  </div>
                  <div className="ml-auto text-xs tracking-[2px]" style={{ color: colors.goldBright }}>★★★★★</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLANES */}
      <section className="relative z-10 py-24" id="planes">
        <div className="max-w-[1200px] mx-auto px-[60px]">
          <div className="text-center mb-16 fade-in">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-7" style={{ background: "rgba(87,55,89,0.3)", border: "1px solid rgba(189,167,108,0.25)" }}>
              <span style={{ color: colors.goldBright }}>◆</span>
              <span className="text-[9px] font-bold tracking-[3px] uppercase" style={{ color: colors.goldLight }}>Planes</span>
            </div>
            <h2 className="font-serif text-4xl md:text-6xl font-black leading-none mb-5">
              Elegí tu<br /><span style={{ color: colors.goldBright, fontStyle: "italic" }}>punto de entrada.</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-[900px] mx-auto">
            <div className="rounded-3xl p-11 fade-in" style={{ background: "rgba(20,5,35,0.9)", border: "1px solid rgba(87,55,89,0.5)" }}>
              <h3 className="font-serif text-2xl font-black text-white mb-1.5">Essentials</h3>
              <div className="font-numeric text-5xl font-black mb-1.5" style={{ color: colors.goldBright }}>$0</div>
              <div className="text-sm text-[#a89ab5] mb-4 flex items-center gap-2.5 flex-wrap">
                Para siempre <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-bold tracking-[1.5px] uppercase" style={{ background: "rgba(232,196,106,0.15)", border: "1px solid rgba(232,196,106,0.5)", color: colors.goldBright }}>✦ Sin tarjeta</span>
              </div>
              <p className="text-sm text-[#a89ab5] leading-relaxed mb-6">Tu primer mapa. Acceso gratuito al portal y a las herramientas fundamentales.</p>
              <ul className="flex flex-col gap-2.5 mb-8">
                {["Carta astral de nacimiento", "Informe de numerología básico", "Acceso al portal personal", "Chatbot de Astar (versión básica)"].map((item, i) => (
                  <li key={i} className="text-sm text-[#cdb6a8] flex items-start gap-2.5">
                    <span style={{ color: colors.goldBright }}>✦</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/register" className="block text-center py-3.5 rounded-full text-sm font-semibold tracking-[2px] uppercase border transition-all hover:border-[#bda76c] hover:text-[#bda76c]" style={{ borderColor: "rgba(205,182,168,0.3)", color: "#f0e8d8" }}>Crear mi portal gratis</Link>
            </div>
            
            <div className="rounded-3xl p-11 relative overflow-hidden fade-in" style={{ background: "linear-gradient(135deg, rgba(87,55,89,0.6) 0%, rgba(60,35,64,0.95) 100%)", border: "1px solid rgba(232,196,106,0.4)", boxShadow: "0 40px 100px rgba(87,55,89,0.35)" }}>
              <div className="absolute top-0 left-0 right-0 h-0.75" style={{ background: `linear-gradient(90deg, ${colors.gold}, ${colors.goldBright}, ${colors.gold})` }} />
              <div className="absolute top-6 right-6 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[9px] font-bold tracking-[2px] uppercase" style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)", color: "#fff" }}>♦ LUMINARY</div>
              <h3 className="font-serif text-2xl font-black text-white mb-1.5">Luminary</h3>
              <div className="font-numeric text-5xl font-black mb-1.5" style={{ color: colors.goldBright }}><sup>$</sup>29</div>
              <p className="text-sm text-[#a89ab5] mb-4">por mes</p>
              <p className="text-sm text-[#a89ab5] leading-relaxed mb-6">Todo el sistema. Astrología, numerología profunda y acompañamiento real de Carlos.</p>
              <ul className="flex flex-col gap-2.5 mb-8">
                {["Todo lo de Essentials incluido", "Carta natal completa + sinastría", "Numerología completa", "Mirada predictiva completa", "Chatbot entrenado por Carlos", "1 respuesta humana de Carlos por mes", "Historial vivo del proceso", "Precio especial en servicios extras"].map((item, i) => (
                  <li key={i} className="text-sm text-[#cdb6a8] flex items-start gap-2.5">
                    <span style={{ color: colors.goldBright }}>✦</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/subscribe" className="block text-center py-3.5 rounded-full text-xs font-bold tracking-[2px] uppercase transition-all hover:opacity-90" style={{ background: colors.goldBright, color: "#080010" }}>Activar Luminary →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* EXTRAS - Public purchase cards with dual pricing */}
      <section className="relative z-10 py-24" id="servicios" style={{ background: "linear-gradient(135deg, rgba(20,5,35,0.95), rgba(87,55,89,0.15))" }}>
        <div className="max-w-[1200px] mx-auto px-[60px]">
          <div className="mb-12 fade-in">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-7" style={{ background: "rgba(87,55,89,0.3)", border: "1px solid rgba(189,167,108,0.25)" }}>
              <span style={{ color: colors.goldBright }}>◆</span>
              <span className="text-[9px] font-bold tracking-[3px] uppercase" style={{ color: colors.goldLight }}>Servicios adicionales</span>
            </div>
            <h2 className="font-serif text-4xl md:text-6xl font-black leading-none mb-5">
              Servicios<br /><span style={{ color: colors.goldBright, fontStyle: "italic" }}>para pedir ahora.</span>
            </h2>
            <p className="font-serif text-xl font-light text-[#a89ab5] leading-relaxed max-w-[600px] mb-8">Comprá un servicio directamente desde la página principal. Mostramos precio regular y precio para suscriptoras Luminary.</p>
          </div>

          {/* services list */}
          <ServiceCards />
        </div>
      </section>

      {/* FRASES */}
      <section className="relative z-10 py-24" style={{ borderTop: "1px solid rgba(189,167,108,0.1)" }}>
        <div className="max-w-[880px] mx-auto px-[60px]">
          <div className="text-center mb-14 fade-in">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-7" style={{ background: "rgba(87,55,89,0.3)", border: "1px solid rgba(189,167,108,0.25)" }}>
              <span style={{ color: colors.goldBright }}>◆</span>
              <span className="text-[9px] font-bold tracking-[3px] uppercase" style={{ color: colors.goldLight }}>Lo que cambia cuando entendés</span>
            </div>
          </div>
          <div className="flex flex-col">
            {frases.map((frase, i) => (
              <div key={i} className="py-11 border-b border-[rgba(189,167,108,0.1)] opacity-65 hover:opacity-100 transition-opacity duration-400 fade-in">
                <p className="font-serif text-2xl md:text-3xl italic font-normal text-white leading-relaxed text-center">
                  "No es {frase.split("es")[0].replace('"', '').trim()}…<br />
                  <strong style={{ color: colors.goldBright, fontStyle: "normal" }}>{frase.split("es")[1].trim()}</strong>"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative z-10 py-24">
        <div className="max-w-[1200px] mx-auto px-[60px]">
          <div className="fade-in mb-14">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-7" style={{ background: "rgba(87,55,89,0.3)", border: "1px solid rgba(189,167,108,0.25)" }}>
              <span style={{ color: colors.goldBright }}>◆</span>
              <span className="text-[9px] font-bold tracking-[3px] uppercase" style={{ color: colors.goldLight }}>Preguntas frecuentes</span>
            </div>
            <h2 className="font-serif text-4xl md:text-6xl font-black leading-none mb-5">
              Lo que<br /><span style={{ color: colors.goldBright, fontStyle: "italic" }}>te preguntás.</span>
            </h2>
          </div>
          
          <div className="rounded-2xl overflow-hidden border fade-in" style={{ borderColor: "rgba(87,55,89,0.4)" }}>
            {faqItems.map((item, i) => (
              <div key={i} className="faq-item border-b border-[rgba(87,55,89,0.3)] last:border-b-0">
                <button onClick={() => toggleFaq(i)} className="w-full bg-none border-none cursor-pointer p-6 flex items-center justify-between gap-5 text-left transition-colors hover:bg-[rgba(87,55,89,0.1)]">
                  <span className="text-xs font-bold tracking-[0.5px] uppercase" style={{ color: colors.goldLight }}>{item.q}</span>
                  <span className="text-lg" style={{ color: colors.goldLight, transform: "rotate(0deg)", transition: "transform 0.3s" }}>+</span>
                </button>
                <div className="max-h-0 overflow-hidden transition-all duration-400 px-6">
                  <p className="text-sm text-[#a89ab5] leading-relaxed pb-6">{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="relative z-10 py-24 text-center px-[60px]">
        <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8" style={{ background: "rgba(87,55,89,0.3)", border: "1px solid rgba(189,167,108,0.25)" }}>
          <span style={{ color: colors.goldBright }}>◆</span>
          <span className="text-[9px] font-bold tracking-[3px] uppercase" style={{ color: colors.goldLight }}>El primer paso</span>
        </div>
        <h2 className="font-serif text-4xl md:text-7xl font-black leading-none mb-5 relative z-10">
          ¿Preparada/o para entender<br />lo que <span className="italic" style={{ color: colors.goldBright }}>realmente</span> está pasando?
        </h2>
        <p className="font-serif text-xl italic text-[#c39ed6] mb-12 relative z-10">Porque si lo estás generando, también podés cambiarlo.</p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link to="/register" className="inline-flex items-center gap-2.5 px-12 py-4.5 rounded-full text-xs font-bold tracking-[2px] uppercase transition-all hover:opacity-90 hover:translate-y-[-2px]" style={{ background: colors.goldBright, color: "#080010", fontSize: "13px", boxShadow: "0 20px 60px rgba(232,196,106,0.3)" }}>
            Crear mi portal gratis →
          </Link>
          <a href="https://instagram.com/carlosbersano_" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-10 py-4 rounded-full text-xs font-semibold tracking-[2px] uppercase border transition-all hover:border-[#bda76c] hover:text-[#bda76c]" style={{ borderColor: "rgba(205,182,168,0.3)", color: "#f0e8d8" }}>
            @carlosbersano_ ↗
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 py-12 px-[60px] border-t border-[rgba(87,55,89,0.4)] flex items-center justify-between flex-wrap gap-6">
        <div className="font-serif text-xl font-black tracking-[3px] text-white">
          ASTAR <span style={{ color: colors.goldBright }}>·</span>
        </div>
        <ul className="flex gap-7 list-none flex-wrap">
          <li>
            <PrivacyPolicyModal>
              <button className="text-xs font-medium tracking-[1.5px] uppercase text-[#a89ab5] hover:text-[#bda76c] transition-colors">Privacidad</button>
            </PrivacyPolicyModal>
          </li>
          <li>
            <TermsModal>
              <button className="text-xs font-medium tracking-[1.5px] uppercase text-[#a89ab5] hover:text-[#bda76c] transition-colors">Términos</button>
            </TermsModal>
          </li>
          <li><a href="mailto:consultas@astarportal.com" className="text-xs font-medium tracking-[1.5px] uppercase text-[#a89ab5] hover:text-[#bda76c] transition-colors">Contacto</a></li>
          <li><a href="https://instagram.com/carlosbersano_" target="_blank" rel="noopener noreferrer" className="text-xs font-medium tracking-[1.5px] uppercase text-[#a89ab5] hover:text-[#bda76c] transition-colors">Instagram</a></li>
          <li><a href="https://astarportal.com" target="_blank" rel="noopener noreferrer" className="text-xs font-medium tracking-[1.5px] uppercase text-[#a89ab5] hover:text-[#bda76c] transition-colors">astarportal.com</a></li>
        </ul>
        <p className="text-xs text-[rgba(168,154,181,0.45)] tracking-[1px]">© 2026 Astar · Carlos Bersano</p>
      </footer>

      <style>{`
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.8; transform: translate(-50%,-58%) scale(1); }
          50% { opacity: 1; transform: translate(-50%,-58%) scale(1.1); }
        }
        @keyframes shimmerText {
          0% { background-position: 0% center; }
          100% { background-position: 300% center; }
        }
        .fade-in { opacity: 0; transform: translateY(28px); transition: opacity 0.8s ease, transform 0.8s ease; }
        .fade-in.visible { opacity: 1; transform: translateY(0); }
        .faq-item.open .faq-answer { max-height: 200px; padding: 0 24px 24px; }
        .faq-item.open .faq-icon { transform: rotate(45deg); }
        @media (max-width: 900px) {
          nav { padding: 18px 24px !important; }
          .nav-links { display: none; }
        }
      `}</style>
    </main>
  );
};

export default Index;
