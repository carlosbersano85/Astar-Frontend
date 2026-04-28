import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/fonts.css';
import './Homepage.css';

// ─── STARS CANVAS ─── 
const StarsCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
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
    window.addEventListener('resize', drawStars);
    window.addEventListener('load', () => setTimeout(drawStars, 400));

    return () => {
      window.removeEventListener('resize', drawStars);
      window.removeEventListener('load', drawStars);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="stars-canvas"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
};

// ─── SCROLL REVEAL ───
const useScrollReveal = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
};

// ─── NAV SCROLL EFFECT ───
const NavScrollEffect = () => {
  useEffect(() => {
    const handleScroll = () => {
      const nav = document.querySelector('nav');
      if (!nav) return;

      if (window.scrollY > 60) {
        nav.style.background = 'rgba(8,0,16,0.97)';
        nav.style.borderBottom = '1px solid rgba(87,55,89,0.3)';
        nav.style.backdropFilter = 'blur(12px)';
      } else {
        nav.style.background = 'transparent';
        nav.style.borderBottom = 'none';
        nav.style.backdropFilter = 'none';
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return null;
};

// ─── CAROUSEL ───
interface TestimonialCard {
  text: string;
  initials: string;
  name: string;
  origin: string;
  rating: number;
}

const Carousel: React.FC<{ testimonials: TestimonialCard[] }> = ({ testimonials }) => {
  const [current, setCurrent] = useState(0);
  const [perView, setPerView] = useState(3);
  const trackRef = useRef<HTMLDivElement>(null);
  const dotsWrapRef = useRef<HTMLDivElement>(null);
  const autoTimerRef = useRef<NodeJS.Timeout>();

  const total = Math.ceil(testimonials.length / perView);

  const goTo = (idx: number) => {
    const newCurrent = ((idx % total) + total) % total;
    setCurrent(newCurrent);

    if (trackRef.current && testimonials.length > 0) {
      const firstCard = trackRef.current.querySelector('.testi-card') as HTMLElement;
      if (firstCard) {
        const cardW = firstCard.offsetWidth + 24;
        trackRef.current.style.transform = `translateX(-${newCurrent * perView * cardW}px)`;
      }
    }

    if (dotsWrapRef.current) {
      dotsWrapRef.current.querySelectorAll('.carrusel-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === newCurrent);
      });
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width <= 600) setPerView(1);
      else if (width <= 900) setPerView(2);
      else setPerView(3);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const startAuto = () => {
      autoTimerRef.current = setInterval(() => {
        setCurrent((prev) => (prev + 1) % total);
      }, 4000);
    };

    startAuto();
    return () => clearInterval(autoTimerRef.current);
  }, [total]);

  useEffect(() => {
    goTo(current);
  }, [current, perView]);

  return (
    <div className="testimonios">
      <div className="section-inner">
        <div className="testimonios-header fade-in">
          <div className="section-tag">◆ Lo que dicen quienes trabajaron con Carlos</div>
          <h2 className="section-title">
            Resultados<br />
            <span className="gold">reales.</span>
          </h2>
          <p className="section-desc" style={{ margin: '0 auto' }}>
            Estas son palabras de personas reales, después de sus sesiones. El portal es nuevo — pero el trabajo de Carlos no lo es.
          </p>
        </div>

        <div className="carrusel-wrap fade-in">
          <div className="carrusel-track" ref={trackRef}>
            {testimonials.map((testi, idx) => (
              <div key={idx} className="testi-card">
                <p className="testi-text">"{testi.text}"</p>
                <div className="testi-footer">
                  <div className="testi-avatar">{testi.initials}</div>
                  <div>
                    <span className="testi-name">{testi.name}</span>
                    <span className="testi-origin">{testi.origin}</span>
                  </div>
                  <div className="testi-stars">{'★'.repeat(testi.rating)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="carrusel-controls">
          <button
            className="carrusel-btn"
            onClick={() => {
              clearInterval(autoTimerRef.current);
              setCurrent((prev) => (prev - 1 + total) % total);
              setTimeout(() => autoTimerRef.current = setInterval(() => setCurrent((prev) => (prev + 1) % total), 4000), 0);
            }}
          >
            ←
          </button>
          <div className="carrusel-dots" ref={dotsWrapRef} />
          <button
            className="carrusel-btn"
            onClick={() => {
              clearInterval(autoTimerRef.current);
              setCurrent((prev) => (prev + 1) % total);
              setTimeout(() => autoTimerRef.current = setInterval(() => setCurrent((prev) => (prev + 1) % total), 4000), 0);
            }}
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── FAQ ACCORDION ───
interface FAQItem {
  question: string;
  answer: string;
}

const FAQAccordion: React.FC<{ items: FAQItem[] }> = ({ items }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section style={{ position: 'relative', zIndex: 1 }}>
      <div className="section-inner">
        <div className="fade-in">
          <div className="section-tag">◆ Preguntas frecuentes</div>
          <h2 className="section-title">
            Lo que<br />
            <span className="gold">te preguntás.</span>
          </h2>
        </div>
        <div className="faq-list fade-in">
          {items.map((item, idx) => (
            <div
              key={idx}
              className={`faq-item ${openIdx === idx ? 'open' : ''}`}
            >
              <button
                className="faq-question"
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              >
                <span className="faq-q">{item.question}</span>
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-answer">
                <p className="faq-a">{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── MAIN HOMEPAGE ───
export default function Homepage() {
  const navigate = useNavigate();

  // Use scroll reveal effect
  useScrollReveal();

  const testimonials: TestimonialCard[] = [
    { text: 'Hace años me diste una orientación cuando migré a otro país. 5 años después, todo pasó tal cual me dijiste. Tu trabajo cambió mi manera de ver lo que estaba viviendo.', initials: 'V', name: 'Valentina', origin: 'Francia', rating: 5 },
    { text: 'Hace un año me diste una mirada sobre algo que creía imposible. Hoy se está cumpliendo tal cual lo describiste. Nunca había encontrado tanta precisión.', initials: 'L', name: 'Lucía', origin: 'Argentina', rating: 5 },
    { text: 'Tu lectura me dejó sin palabras. Ha sido una herramienta invaluable para mi crecimiento personal. Tus habilidades son impresionantes y estoy profundamente agradecido.', initials: 'H', name: 'Hernán', origin: 'Uruguay', rating: 5 },
    { text: 'Vine con un problema que me hacía sufrir mucho. El análisis de Carlos no solo me ayudó con eso — también sanó algo mucho más profundo que yo ni sabía que cargaba.', initials: 'K', name: 'Karen', origin: 'España', rating: 5 },
    { text: 'Casi 8 años consultándote y nunca fallás. Super claro siempre. Muchas gracias — sos parte de mi proceso desde hace años.', initials: 'G', name: 'Gabriela', origin: 'Argentina', rating: 5 },
    { text: 'Al leer lo que Carlos describió pensé que era imposible según mi contexto. Simplemente sucedió tal cual. No tengo otra explicación que su precisión.', initials: 'M', name: 'Marcos', origin: 'México', rating: 5 },
    { text: 'Tu trabajo es realmente inspirador y ha dejado una huella positiva en mí. Me sentí profundamente acompañado, con claridad y un espacio seguro para entenderme.', initials: 'R', name: 'Ricardo', origin: 'Colombia', rating: 5 },
    { text: 'Tengo el privilegio de ser guiada por Carlos. Su capacidad para leer lo que está pasando realmente es algo que no encontré en ningún otro lugar.', initials: 'S', name: 'Sofía', origin: 'Italia', rating: 5 },
  ];

  const faqItems: FAQItem[] = [
    { question: '¿Esto predice el futuro?', answer: 'No en el sentido tradicional. Astar te ayuda a entender los patrones que están generando tu presente — y eso es lo que realmente te permite anticipar y cambiar lo que viene.' },
    { question: '¿Necesito saber de astrología?', answer: 'Para nada. El portal está diseñado para que entiendas tu carta desde el primer día, sin formación previa.' },
    { question: '¿El chatbot es IA genérica?', answer: 'No. Está entrenado por Carlos con cientos de consultas reales. Habla con su voz y su enfoque — no es un asistente genérico.' },
    { question: '¿Las respuestas de Carlos son automáticas?', answer: 'No. La respuesta mensual del plan Luminary la graba o escribe Carlos en persona — sin IA. Es 100% humana y personalizada para tu situación.' },
    { question: '¿Puedo cancelar cuando quiera?', answer: 'Sí, sin letra chica. El plan Luminary se puede cancelar en cualquier momento desde tu portal, sin penalidades.' },
    { question: '¿Las consultas extras son para cualquiera?', answer: 'Las consultas puntuales y servicios extras son exclusivos para suscriptores del plan Luminary, con precio especial. No están disponibles en el plan gratuito.' },
  ];

  const handleRegister = () => navigate('/register');
  const handleLogin = () => navigate('/login');

  return (
    <div style={{ background: '#080010', color: '#fff', fontFamily: 'Montserrat, sans-serif', overflowX: 'hidden' }}>
      <StarsCanvas />
      <NavScrollEffect />

      <style>{`
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.8; transform: translate(-50%,-58%) scale(1); }
          50% { opacity: 1; transform: translate(-50%,-58%) scale(1.1); }
        }
        @keyframes shimmerText {
          0% { background-position: 0% center; }
          100% { background-position: 300% center; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(8px); }
        }
        nav { font-size: 0; }
        nav a:hover { color: #e8c46a; }
      `}</style>

      {/* ─── NAV ─── */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 60px', transition: 'background 0.3s, border 0.3s' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ fontFamily: 'Arsenica Trial, serif', fontSize: '28px', fontWeight: 900, letterSpacing: '4px', color: '#fff' }}>ASTAR</span>
          <span style={{ fontSize: '9px', fontWeight: 400, letterSpacing: '4px', color: '#bda76c', textTransform: 'uppercase' }}>Astrología · Numerología · Tarot</span>
        </div>
        <ul style={{ display: 'flex', alignItems: 'center', gap: '40px', listStyle: 'none' }}>
          <li><a href="#portal" style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: '#cdb6a8', textDecoration: 'none', transition: 'color 0.3s', cursor: 'pointer' }}>El Portal</a></li>
          <li><a href="#carlos" style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: '#cdb6a8', textDecoration: 'none', transition: 'color 0.3s', cursor: 'pointer' }}>Carlos</a></li>
          <li><a href="#planes" style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: '#cdb6a8', textDecoration: 'none', transition: 'color 0.3s', cursor: 'pointer' }}>Planes</a></li>
          <li><a onClick={handleLogin} style={{ background: '#e8c46a', color: '#080010', padding: '10px 24px', borderRadius: '30px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', textDecoration: 'none', transition: 'color 0.3s', cursor: 'pointer' }}>
              <span style={{ fontSize: '14px', background: 'linear-gradient(135deg, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>♦</span> Entrar →
            </a></li>
        </ul>
      </nav>

      {/* ─── HERO ─── */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '120px 60px 100px', zIndex: 1, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -58%)', width: '800px', height: '500px', background: 'radial-gradient(ellipse, rgba(195,158,214,0.28) 0%, rgba(87,55,89,0.2) 40%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none', filter: 'blur(24px)', animation: 'pulseGlow 5s ease-in-out infinite' }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(87,55,89,0.4)', border: '1px solid rgba(189,167,108,0.3)', borderRadius: '30px', padding: '8px 20px', fontSize: '10px', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', color: '#bda76c', marginBottom: '36px' }}>
            <span style={{ fontSize: '8px', color: '#e8c46a' }}>◆</span> Portal de Autoconocimiento
          </div>
          <h1 style={{ fontFamily: 'Arsenica Trial, serif', fontSize: 'clamp(48px, 7.5vw, 100px)', fontWeight: 900, lineHeight: 0.95, letterSpacing: '-2px', marginBottom: '12px', margin: '0 auto 12px' }}>
            <span style={{ color: '#fff', display: 'block' }}>Tu propio espacio para encontrarle</span>
            <span style={{ display: 'block', fontStyle: 'italic', background: 'linear-gradient(90deg, #e8c46a 0%, #d5b0dd 30%, #ffffff 50%, #d5b0dd 70%, #e8c46a 100%)', backgroundSize: '300% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', animation: 'shimmerText 3s linear infinite' }}>sentido a lo que vivís.</span>
          </h1>
          <p style={{ fontFamily: 'TAN Pearl, serif', fontSize: 'clamp(18px, 2.5vw, 24px)', fontWeight: 300, fontStyle: 'italic', color: '#c39ed6', maxWidth: '540px', margin: '28px auto 52px', lineHeight: 1.6 }}>Porque entender lo que te pasa cambia todo lo que decidís después.</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <button onClick={handleRegister} style={{ background: '#e8c46a', color: '#080010', fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', padding: '16px 40px', borderRadius: '40px', textDecoration: 'none', border: 'none', cursor: 'pointer', transition: 'all 0.3s', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>Acceder al portal →</button>
            <a href="#portal" style={{ background: 'transparent', color: '#f0e8d8', fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', padding: '16px 40px', borderRadius: '40px', textDecoration: 'none', border: '1px solid rgba(205,182,168,0.3)', cursor: 'pointer', transition: 'all 0.3s', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>Ver cómo funciona</a>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: '36px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: '#a89ab5', fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', animation: 'bounce 2.5s ease-in-out infinite' }}>Explorar</div>
      </section>

      {/* ─── PREMISA ─── */}
      <section style={{ background: 'linear-gradient(135deg, rgba(87,55,89,0.12) 0%, rgba(30,5,53,0.7) 100%)', borderTop: '1px solid rgba(189,167,108,0.12)', borderBottom: '1px solid rgba(189,167,108,0.12)', position: 'relative', zIndex: 1 }} id="portal">
        <div className="section-inner">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center', '@media (max-width: 900px)': { gridTemplateColumns: '1fr', gap: '40px' } }} className="fade-in">
            <div>
              <div className="section-tag">◆ La premisa</div>
              <p style={{ fontFamily: 'Arsenica Trial, serif', fontSize: 'clamp(20px, 2.5vw, 32px)', fontStyle: 'italic', fontWeight: 400, lineHeight: 1.5, color: '#fff', borderLeft: '3px solid #e8c46a', paddingLeft: '32px' }}>
                "El problema nunca es <span style={{ color: '#e8c46a' }}>lo que te pasa</span>.<br />
                Es que todavía no entendés<br />
                <span style={{ color: '#e8c46a' }}>por qué te pasa</span>."
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {[
                { num: '01', title: 'Detectar el patrón', desc: 'La astrología describe los mecanismos internos que generan tus resultados externos.' },
                { num: '02', title: 'Comprender cómo opera', desc: 'No es lo que te pasa — es cómo lo estás interpretando. Ahí empieza la transformación.' },
                { num: '03', title: 'Abrir la posibilidad', desc: 'Si lo generaste, también podés cambiarlo. Esa es la mejor noticia posible.' },
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                  <div style={{ fontFamily: 'Arsenica Trial, serif', fontSize: '34px', fontWeight: 900, color: 'rgba(232,196,106,0.18)', lineHeight: 1, minWidth: '44px' }}>{item.num}</div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '12px', fontWeight: 700, letterSpacing: '1px', color: '#bda76c', marginBottom: '4px', textTransform: 'uppercase' }}>{item.title}</strong>
                    <p style={{ fontSize: '13px', color: '#a89ab5', lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── MÓDULOS ─── */}
      <section style={{ position: 'relative', zIndex: 1 }}>
        <div className="section-inner">
          <div className="fade-in">
            <div className="section-tag">◆ Lo que encontrás adentro</div>
            <h2 className="section-title">
              Todo lo que<br />
              <span className="gold">necesitás.</span>
            </h2>
            <p className="section-desc">Un sistema integrado de herramientas que habla un solo idioma: el tuyo.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '60px' }}>
            {[
              { tag: 'Core', icon: '☉', title: 'Carta Natal', desc: 'Tu mapa completo. Sol, Luna, Ascendente, planetas en casas y signos. El punto de partida de todo.', items: ['Patrones inconscientes y arquetipos', 'Informe personal completo'] },
              { tag: 'Predictivo', icon: '◎', title: 'Mirada Predictiva', desc: 'Tres herramientas combinadas para entender qué momento estás viviendo y hacia dónde va tu energía.', items: ['Revolución Solar — el mapa de tu año', 'Numerología — tus ciclos personales', 'Tarot psicológico — qué está emergiendo'] },
              { tag: 'Numerología', icon: '✦', title: 'Numerología Completa', desc: 'Alma, expresión, destino, potencial. Los números como otro lenguaje del mismo patrón.', items: ['Número del alma y expresión', 'Ciclos, desafíos y potenciales'] },
              { tag: 'Tarot', icon: '☽', title: 'Espejo de los Arcanos', desc: 'Lecturas que van más allá de la carta y tocan el patrón real. No predicción — comprensión profunda.', items: ['Lecturas integradas a tu carta natal', 'Arquetipos en tu historia personal'] },
              { tag: 'Luminary', icon: '◈', title: 'Sinastría', desc: 'No es el otro — es lo que ese otro activa en ti. Compatibilidad y vínculos desde adentro.', items: ['Mapa relacional completo', 'Patrones y activaciones mutuas'] },
              { tag: 'Personal · Luminary', icon: '★', title: 'Respuestas de Carlos', desc: 'Podés preguntarle lo que quieras — cualquier tema. Carlos responde personalmente, sin ninguna IA de por medio, en audio, video o escrito.', items: ['Cualquier tema, sin restricciones', '1 respuesta humana personalizada por mes', 'Acceso a servicios extras especiales'] },
            ].map((card, idx) => (
              <div key={idx} className="fade-in" style={{ background: 'rgba(87,55,89,0.1)', border: '1px solid rgba(87,55,89,0.4)', borderRadius: '16px', padding: '30px 26px', transition: 'all 0.4s', position: 'relative', overflow: 'hidden' }}>
                <div style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: '#bda76c', background: 'rgba(189,167,108,0.1)', border: '1px solid rgba(189,167,108,0.2)', borderRadius: '10px', padding: '4px 10px', display: 'inline-block', marginBottom: '18px' }}>{card.tag}</div>
                <div style={{ width: '40px', height: '40px', background: 'rgba(189,167,108,0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', fontSize: '18px' }}>{card.icon}</div>
                <h3 style={{ fontFamily: 'Arsenica Trial, serif', fontSize: '19px', fontWeight: 700, color: '#fff', marginBottom: '10px' }}>{card.title}</h3>
                <p style={{ fontSize: '13px', color: '#a89ab5', lineHeight: 1.65, marginBottom: '16px' }}>{card.desc}</p>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '7px' }}>
                  {card.items.map((item, i) => (
                    <li key={i} style={{ fontSize: '12px', color: '#cdb6a8', display: 'flex', alignItems: 'flex-start', gap: '8px', lineHeight: 1.5 }}>
                      <span style={{ color: '#e8c46a', fontSize: '15px', fontWeight: 700, flexShrink: 0 }}>›</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CHATBOT ─── */}
      <section style={{ background: 'linear-gradient(135deg, rgba(30,5,53,0.9) 0%, rgba(87,55,89,0.2) 100%)', borderTop: '1px solid rgba(189,167,108,0.12)', borderBottom: '1px solid rgba(189,167,108,0.12)', position: 'relative', zIndex: 1 }}>
        <div className="section-inner">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }} className="fade-in">
            <div style={{ background: 'rgba(20,5,35,0.95)', border: '1px solid rgba(87,55,89,0.6)', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.5)' }}>
              <div style={{ background: 'rgba(87,55,89,0.4)', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(87,55,89,0.4)' }}>
                <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #573759, #7c603e)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', color: '#fff' }}>✦</div>
                <div>
                  <strong style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#fff' }}>Astar IA</strong>
                  <span style={{ fontSize: '10px', color: '#bda76c', letterSpacing: '1px' }}>Entrenado por Carlos Bersano</span>
                </div>
                <div style={{ width: '8px', height: '8px', background: '#4ade80', borderRadius: '50%', marginLeft: 'auto', boxShadow: '0 0 8px #4ade80' }} />
              </div>
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ maxWidth: '85%', padding: '12px 16px', borderRadius: '16px', fontSize: '13px', lineHeight: 1.6, background: 'rgba(87,55,89,0.4)', color: '#cdb6a8', borderBottomLeftRadius: '4px' }}>Hola. Contame — ¿qué es lo que sentís que se repite en tu vida y no podés terminar de entender?</div>
                <div style={{ maxWidth: '85%', padding: '12px 16px', borderRadius: '16px', fontSize: '13px', lineHeight: 1.6, background: 'rgba(232,196,106,0.15)', border: '1px solid rgba(232,196,106,0.2)', color: '#fff', borderBottomRightRadius: '4px', marginLeft: 'auto' }}>Siempre llego a un punto en mis relaciones donde siento que doy demasiado y nadie me ve realmente.</div>
                <div style={{ maxWidth: '85%', padding: '12px 16px', borderRadius: '16px', fontSize: '13px', lineHeight: 1.6, background: 'rgba(87,55,89,0.4)', color: '#cdb6a8', borderBottomLeftRadius: '4px' }}>Lo que describís no es mala suerte. Hay algo tuyo que elige ese lugar una y otra vez — y cuando lo entendés, podés elegir diferente.</div>
                <div style={{ maxWidth: '85%', padding: '12px 16px', borderRadius: '16px', fontSize: '13px', lineHeight: 1.6, background: 'rgba(87,55,89,0.55)', border: '1px solid rgba(232,196,106,0.2)', color: '#cdb6a8', borderBottomLeftRadius: '4px' }}>
                  Esta pregunta merece una respuesta profunda y personalizada. Si tenés el plan Luminary, podés enviársela directamente a Carlos — él te responde en persona, sin IA.<br />
                  <a href="#planes" style={{ display: 'inline-block', marginTop: '10px', fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#e8c46a', textDecoration: 'none', borderBottom: '1px solid rgba(232,196,106,0.3)', paddingBottom: '2px' }}>Enviar a Carlos →</a>
                </div>
              </div>
            </div>
            <div>
              <div className="section-tag">◆ Dentro del portal</div>
              <h2 style={{ fontFamily: 'Arsenica Trial, serif', fontSize: 'clamp(32px, 4vw, 54px)', fontWeight: 900, lineHeight: 1, marginBottom: '20px', color: '#fff' }}>
                Un asistente<br />
                <span style={{ color: '#e8c46a', fontStyle: 'italic' }}>que te conoce.</span>
              </h2>
              <p style={{ fontFamily: 'TAN Pearl, serif', fontSize: '19px', fontWeight: 300, color: '#cdb6a8', lineHeight: 1.75, marginBottom: '16px' }}>Dentro del portal hay un chatbot creado y entrenado por Carlos — construido sobre cientos de consultas reales, con su voz, su manera de ver y su forma de acompañar.</p>
              <p style={{ fontFamily: 'TAN Pearl, serif', fontSize: '19px', fontWeight: 300, color: '#a89ab5', lineHeight: 1.75 }}>No es una IA genérica. Es una herramienta que habla desde años de trabajo con personas reales. Y cuando una pregunta lo merece, te invita a llevarla directo a Carlos.</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', margin: '28px 0 36px' }}>
                {['Tu carta natal integrada', 'Voz de Carlos', 'Disponible 24/7', 'Contexto personalizado'].map((chip, i) => (
                  <span key={i} style={{ background: 'rgba(87,55,89,0.3)', border: '1px solid rgba(195,158,214,0.2)', borderRadius: '20px', padding: '7px 16px', fontSize: '11px', color: '#c39ed6', letterSpacing: '0.5px' }}>{chip}</span>
                ))}
              </div>
              <a href="#planes" style={{ background: '#e8c46a', color: '#080010', fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', padding: '16px 40px', borderRadius: '40px', textDecoration: 'none', border: 'none', cursor: 'pointer', transition: 'all 0.3s', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>Quiero acceder →</a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── VIDEO ─── */}
      <section style={{ position: 'relative', zIndex: 1 }}>
        <div className="section-inner">
          <div className="fade-in">
            <div className="section-tag">◆ Mirá el portal por dentro</div>
            <h2 className="section-title">
              Antes de entrar,<br />
              <span className="gold">conocé qué hay.</span>
            </h2>
          </div>
          <div className="fade-in" style={{ marginTop: '56px', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(87,55,89,0.5)', background: 'rgba(20,5,35,0.9)', aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '20px', position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(87,55,89,0.2), transparent)' }} />
            <div style={{ width: '80px', height: '80px', background: 'rgba(232,196,106,0.15)', border: '2px solid rgba(232,196,106,0.4)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', color: '#e8c46a', position: 'relative', zIndex: 1, cursor: 'pointer', transition: 'all 0.3s' }}>▶</div>
            <p style={{ fontSize: '13px', color: '#a89ab5', letterSpacing: '2px', textTransform: 'uppercase', position: 'relative', zIndex: 1 }}>Video próximamente</p>
          </div>
        </div>
      </section>

      {/* ─── PARA QUIÉN ─── */}
      <section style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(30,5,53,0.5) 50%, transparent 100%)', position: 'relative', zIndex: 1 }}>
        <div className="section-inner">
          <div style={{ textAlign: 'center', marginBottom: '60px' }} className="fade-in">
            <div className="section-tag" style={{ justifyContent: 'center' }}>◆ ¿Esto es para ti?</div>
            <h2 className="section-title" style={{ textAlign: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
              Para quien <span className="gold">siente</span><br />
              que hay algo más.
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {[
              { emoji: '🔄', title: 'La que repite', desc: 'Siempre el mismo tipo de vínculo, el mismo punto límite. No es mala suerte — es un patrón que todavía no entendiste.', pred: 'Si querés saber qué viene, primero hay que entender qué se está repitiendo. Ahí está la respuesta.' },
              { emoji: '🌀', title: 'La que busca sentido', desc: 'Algo cambió y no entendés por qué. Las decisiones racionales no te convencen. Necesitás un mapa, no un horóscopo.', pred: 'Muchas veces lo que querés saber del futuro ya está escrito en lo que estás viviendo hoy.' },
              { emoji: '🧭', title: 'La que quiere entenderse', desc: 'No te conformás con "así soy yo". Querés entender tus mecanismos reales para poder hacer algo con ellos.', pred: 'Cuando te entendés, el futuro deja de ser algo que te pasa — y empieza a ser algo que construís.' },
            ].map((card, idx) => (
              <div key={idx} className="fade-in" style={{ background: 'rgba(20,5,35,0.8)', border: '1px solid rgba(87,55,89,0.5)', borderRadius: '20px', padding: '36px 28px', textAlign: 'center', transition: 'all 0.4s', cursor: 'pointer' }}>
                <span style={{ fontSize: '44px', display: 'block', marginBottom: '18px' }}>{card.emoji}</span>
                <div style={{ fontFamily: 'Arsenica Trial, serif', fontSize: '21px', fontWeight: 700, fontStyle: 'italic', color: '#e8c46a', marginBottom: '12px' }}>{card.title}</div>
                <p style={{ fontSize: '13px', color: '#a89ab5', lineHeight: 1.7, marginBottom: '14px' }}>{card.desc}</p>
                <p style={{ marginTop: '14px', fontSize: '12px', color: '#c39ed6', fontStyle: 'italic', lineHeight: 1.6, borderTop: '1px solid rgba(195,158,214,0.15)', paddingTop: '12px' }}>{card.pred}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <div className="fade-in" style={{ background: 'linear-gradient(135deg, rgba(87,55,89,0.5) 0%, rgba(60,35,64,0.8) 100%)', borderTop: '1px solid rgba(232,196,106,0.2)', borderBottom: '1px solid rgba(232,196,106,0.2)', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '40px', flexWrap: 'wrap' }}>
          <div>
            <h3 style={{ fontFamily: 'Arsenica Trial, serif', fontSize: 'clamp(24px, 3vw, 38px)', fontWeight: 900, color: '#fff', marginBottom: '8px' }}>Tu portal te espera.<br />Empezá gratis hoy.</h3>
            <p style={{ fontSize: '14px', color: '#a89ab5' }}>Sin tarjeta. Sin compromiso. Con todo lo que necesitás para empezar.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <button onClick={handleRegister} style={{ background: '#e8c46a', color: '#080010', fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', padding: '16px 40px', borderRadius: '40px', textDecoration: 'none', border: 'none', cursor: 'pointer', transition: 'all 0.3s', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>Crear mi portal →</button>
            <a href="#planes" style={{ background: 'transparent', color: '#c39ed6', fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', padding: '13px 32px', borderRadius: '40px', textDecoration: 'none', border: '1px solid rgba(195,158,214,0.25)', cursor: 'pointer', transition: 'all 0.3s', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>Ver planes</a>
          </div>
        </div>
      </div>

      {/* ─── CARLOS ─── */}
      <section style={{ borderTop: '1px solid rgba(189,167,108,0.1)', borderBottom: '1px solid rgba(189,167,108,0.1)', background: 'rgba(87,55,89,0.06)', position: 'relative', zIndex: 1 }} id="carlos">
        <div className="section-inner">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '80px', alignItems: 'center' }} className="fade-in">
            <div style={{ position: 'relative' }}>
              <div style={{ width: '100%', aspectRatio: '3/4', background: 'linear-gradient(135deg, rgba(87,55,89,0.4), rgba(30,5,53,0.8))', borderRadius: '20px', border: '1px solid rgba(189,167,108,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px', color: '#a89ab5', fontSize: '12px', letterSpacing: '1px' }}>
                <span style={{ fontSize: '48px', color: 'rgba(189,167,108,0.25)' }}>◉</span>
                Foto de Carlos
              </div>
              <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '90px', height: '90px', border: '2px solid rgba(232,196,106,0.18)', borderRadius: '50%' }} />
              <div style={{ position: 'absolute', bottom: '-28px', left: '-28px', width: '130px', height: '130px', border: '1px solid rgba(87,55,89,0.4)', borderRadius: '50%' }} />
            </div>
            <div>
              <div className="section-tag">◆ Quién está detrás</div>
              <h2 style={{ fontFamily: 'Arsenica Trial, serif', fontSize: '46px', fontWeight: 900, lineHeight: 1, marginBottom: '6px', color: '#fff' }}>
                Carlos<br />
                <span style={{ color: '#e8c46a', fontStyle: 'italic' }}>Bersano</span>
              </h2>
              <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', color: '#bda76c', marginBottom: '32px' }}>Astrólogo · Numerólogo · Coach con formación en PNL</p>
              <p style={{ fontFamily: 'TAN Pearl, serif', fontSize: '18px', fontWeight: 300, lineHeight: 1.8, color: '#cdb6a8', marginBottom: '20px' }}>Desde chico supe que los misterios no eran algo a temer — eran algo a explorar. Me fascinaban no porque predecían el futuro, sino porque revelaban algo que la mayoría prefiere ignorar: lo que vivimos afuera es un reflejo de lo que somos adentro.</p>
              <p style={{ fontFamily: 'TAN Pearl, serif', fontSize: '18px', fontWeight: 300, lineHeight: 1.8, color: '#cdb6a8', marginBottom: '20px' }}>Hoy, después de miles de consultas privadas, entiendo algo que no se aprende en ningún libro: el problema nunca es lo que te pasa. Es que todavía no entendés por qué te pasa.</p>
              <div style={{ display: 'flex', gap: '40px', marginTop: '36px', paddingTop: '36px', borderTop: '1px solid rgba(189,167,108,0.15)' }}>
                {[
                  { num: '5.000+', label: 'Consultas privadas' },
                  { num: '2.000+', label: 'Cartas astrales' },
                  { num: 'Referente', label: 'Consultor internacional' },
                ].map((stat, i) => (
                  <div key={i}>
                    <span style={{ fontFamily: 'Arsenica Trial, serif', fontSize: '34px', fontWeight: 900, color: '#e8c46a', display: 'block' }}>{stat.num}</span>
                    <span style={{ fontSize: '10px', color: '#a89ab5', letterSpacing: '1px', textTransform: 'uppercase', marginTop: '4px', display: 'block' }}>{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── BRAND PHRASES ─── */}
      <section style={{ borderTop: '1px solid rgba(189,167,108,0.1)', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '880px', margin: '0 auto', padding: '100px 60px', textAlign: 'center' }}>
          <div className="section-tag" style={{ marginBottom: '56px', justifyContent: 'center' }}>◆ Lo que cambia cuando entendés</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {[
              'No es lo que te pasa…\nes cómo lo estás interpretando.',
              'No es el otro…\nes lo que ese otro activa en ti.',
              'No es falta de oportunidades…\nes un patrón que se está repitiendo.',
              'No es destino…\nes repetición inconsciente.',
            ].map((phrase, idx) => (
              <div key={idx} className="fade-in" style={{ padding: '44px 0', borderBottom: idx < 3 ? '1px solid rgba(189,167,108,0.1)' : 'none', opacity: 0.65, transition: 'opacity 0.4s', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '1'} onMouseLeave={(e) => e.currentTarget.style.opacity = '0.65'}>
                <p style={{ fontFamily: 'Arsenica Trial, serif', fontSize: 'clamp(20px, 2.8vw, 34px)', fontStyle: 'italic', fontWeight: 400, color: '#fff', lineHeight: 1.45, margin: 0 }}>
                  {phrase.split('…').map((part, i) => (
                    <span key={i}>
                      {i === 0 ? part + '…' : <span style={{ color: '#e8c46a', fontStyle: 'normal' }}>{part}</span>}
                    </span>
                  ))}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PLANES ─── */}
      <section style={{ position: 'relative', zIndex: 1 }} id="planes">
        <div className="section-inner">
          <div style={{ textAlign: 'center', marginBottom: '60px' }} className="fade-in">
            <div className="section-tag" style={{ justifyContent: 'center' }}>◆ Planes</div>
            <h2 className="section-title" style={{ textAlign: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
              Elegí tu<br />
              <span className="gold">punto de entrada.</span>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', maxWidth: '900px', margin: '0 auto' }}>
            {[
              { name: 'Essentials', price: '$0', sub: 'Para siempre', badge: null, desc: 'Tu primer mapa. Acceso gratuito al portal y a las herramientas fundamentales.', features: ['Carta astral de nacimiento', 'Informe de numerología básico', 'Acceso al portal personal', 'Chatbot de Astar (versión básica)'], btnText: 'Crear mi portal gratis', btnLink: handleRegister, isFree: true },
              { name: 'Luminary', price: '$29', sub: 'por mes · o anual con 2 meses gratis', badge: '♦ LUMINARY', desc: 'Todo el sistema. Astrología, numerología profunda y acompañamiento real de Carlos.', features: ['Todo lo de Essentials incluido', 'Carta natal completa + sinastría', 'Numerología completa (alma, expresión, destino)', 'Mirada predictiva completa', 'Chatbot entrenado por Carlos (versión completa)', '1 respuesta humana de Carlos por mes — cualquier tema', 'Historial vivo del proceso', 'Precio especial en servicios extras'], btnText: 'Activar Luminary →', btnLink: () => navigate('/subscribe'), isPremium: true },
            ].map((plan, idx) => (
              <div key={idx} className="fade-in" style={{ borderRadius: '24px', padding: '44px 38px', position: 'relative', overflow: 'hidden', transition: 'transform 0.4s', background: plan.isFree ? 'rgba(20,5,35,0.9)' : 'linear-gradient(135deg, rgba(87,55,89,0.6) 0%, rgba(60,35,64,0.95) 100%)', border: plan.isFree ? '1px solid rgba(87,55,89,0.5)' : '1px solid rgba(232,196,106,0.4)', boxShadow: plan.isPremium ? '0 40px 100px rgba(87,55,89,0.35)' : 'none', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-6px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                {plan.isPremium && <div style={{ content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #7c603e, #e8c46a, #7c603e)' }} />}
                {plan.badge && <div style={{ position: 'absolute', top: '22px', right: '22px', fontSize: '9px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', padding: '5px 13px', borderRadius: '20px', background: 'linear-gradient(135deg, #a855f7, #ec4899)', color: '#fff', display: 'flex', alignItems: 'center', gap: '5px' }}>{plan.badge}</div>}
                <div style={{ fontFamily: 'Arsenica Trial, serif', fontSize: '26px', fontWeight: 900, color: '#fff', marginBottom: '6px' }}>{plan.name}</div>
                <div style={{ fontFamily: 'Arsenica Trial, serif', fontSize: '50px', fontWeight: 900, color: '#e8c46a', lineHeight: 1, margin: '18px 0 6px' }}>{plan.price}</div>
                <div style={{ fontSize: '12px', color: '#a89ab5', letterSpacing: '1px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  {plan.sub}
                  {plan.isFree && <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'rgba(232,196,106,0.15)', border: '1px solid rgba(232,196,106,0.5)', borderRadius: '20px', padding: '4px 12px', fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', color: '#e8c46a', textTransform: 'uppercase' }}>✦ Sin tarjeta</span>}
                </div>
                <p style={{ fontSize: '13px', color: '#a89ab5', lineHeight: 1.6, marginBottom: '24px', marginTop: '10px' }}>{plan.desc}</p>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '11px', marginBottom: '32px' }}>
                  {plan.features.map((feature, i) => (
                    <li key={i} style={{ fontSize: '13px', color: '#cdb6a8', display: 'flex', alignItems: 'flex-start', gap: '10px', lineHeight: 1.5 }}>
                      <span style={{ color: '#e8c46a', fontSize: '10px', flexShrink: 0, marginTop: '3px' }}>✦</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button onClick={plan.btnLink} style={{ width: '100%', background: plan.isFree ? 'transparent' : '#e8c46a', color: plan.isFree ? '#f0e8d8' : '#080010', fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', padding: '14px 20px', borderRadius: '40px', textDecoration: 'none', border: plan.isFree ? '1px solid rgba(205,182,168,0.3)' : 'none', cursor: 'pointer', transition: 'all 0.3s', display: 'block' }}>{plan.btnText}</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── EXTRAS ─── */}
      <section style={{ background: 'linear-gradient(135deg, rgba(20,5,35,0.95), rgba(87,55,89,0.15))', position: 'relative', zIndex: 1 }}>
        <div className="section-inner">
          <div className="fade-in" style={{ marginBottom: '50px' }}>
            <div className="section-tag">◆ Servicios extras</div>
            <h2 className="section-title">
              Más allá<br />
              <span className="gold">del plan.</span>
            </h2>
            <p className="section-desc">Además de tu portal, podés contratar servicios adicionales cuando los necesités — sin compromisos.</p>
            <div style={{ marginTop: '32px' }}><a href="#extras" style={{ background: 'rgba(87,55,89,0.25)', color: '#c39ed6', fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', padding: '13px 32px', borderRadius: '40px', textDecoration: 'none', border: '1px solid rgba(195,158,214,0.25)', cursor: 'pointer', transition: 'all 0.3s', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>Ver todos los servicios →</a></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '48px' }}>
            {[
              { icon: '🎙️', title: 'Sesión en vivo', desc: 'Una sesión personal con Carlos en tiempo real. Disponible bajo demanda. Precio especial para suscriptoras activas del plan Luminary.' },
              { icon: '⚡', title: 'Consulta puntual', desc: 'Una pregunta concreta respondida por Carlos en profundidad. Exclusivo para suscriptoras Luminary — no incluido en el plan gratuito.' },
              { icon: '📄', title: 'Informe especial', desc: 'Tránsitos del momento, compatibilidad avanzada, carta progresada. Informes específicos y detallados a pedido.' },
            ].map((service, i) => (
              <div key={i} className="fade-in" style={{ background: 'rgba(87,55,89,0.12)', border: '1px solid rgba(87,55,89,0.4)', borderRadius: '16px', padding: '28px 24px', transition: 'all 0.3s', cursor: 'pointer' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(87,55,89,0.2)'; e.currentTarget.style.borderColor = 'rgba(189,167,108,0.3)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(87,55,89,0.12)'; e.currentTarget.style.borderColor = 'rgba(87,55,89,0.4)'; }}>
                <span style={{ fontSize: '28px', marginBottom: '14px', display: 'block' }}>{service.icon}</span>
                <div style={{ fontFamily: 'Arsenica Trial, serif', fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>{service.title}</div>
                <p style={{ fontSize: '13px', color: '#a89ab5', lineHeight: 1.65, margin: 0 }}>{service.desc}</p>
              </div>
            ))}
          </div>
          <p className="fade-in" style={{ textAlign: 'center', fontFamily: 'TAN Pearl, serif', fontSize: '18px', fontStyle: 'italic', color: '#c39ed6', marginBottom: '40px' }}>Los detalles y precios de cada servicio están disponibles dentro del portal.</p>
        </div>
      </section>

      {/* TESTIMONIALS & FAQ */}
      <Carousel testimonials={testimonials} />
      <FAQAccordion items={faqItems} />

      {/* ─── CTA FINAL ─── */}
      <section style={{ textAlign: 'center', padding: '120px 60px', position: 'relative', zIndex: 1 }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 80% at 50% 50%, rgba(87,55,89,0.22) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(87,55,89,0.3)', border: '1px solid rgba(189,167,108,0.25)', borderRadius: '20px', padding: '6px 16px', fontSize: '9px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: '#bda76c', marginBottom: '32px', position: 'relative', zIndex: 1 }}>
          ◆ El primer paso
        </div>
        <h2 style={{ fontFamily: 'Arsenica Trial, serif', fontSize: 'clamp(38px, 6vw, 78px)', fontWeight: 900, lineHeight: 1, marginBottom: '22px', position: 'relative', zIndex: 1 }}>
          ¿Preparada/o para entender<br />
          lo que <span style={{ fontStyle: 'italic', color: '#e8c46a' }}>realmente</span> está pasando?
        </h2>
        <p style={{ fontFamily: 'TAN Pearl, serif', fontSize: '21px', fontWeight: 300, fontStyle: 'italic', color: '#c39ed6', marginBottom: '48px', position: 'relative', zIndex: 1 }}>Porque si lo estás generando, también podés cambiarlo.</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
          <button onClick={handleRegister} style={{ background: '#e8c46a', color: '#080010', fontFamily: 'Montserrat, sans-serif', fontSize: '13px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', padding: '18px 48px', borderRadius: '40px', textDecoration: 'none', border: 'none', cursor: 'pointer', transition: 'all 0.3s', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>Crear mi portal gratis →</button>
          <a href="https://instagram.com/carlosbersano_" target="_blank" rel="noopener noreferrer" style={{ background: 'transparent', color: '#f0e8d8', fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', padding: '16px 40px', borderRadius: '40px', textDecoration: 'none', border: '1px solid rgba(205,182,168,0.3)', cursor: 'pointer', transition: 'all 0.3s', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>@carlosbersano_ ↗</a>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ borderTop: '1px solid rgba(87,55,89,0.4)', padding: '44px 60px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1, flexWrap: 'wrap', gap: '24px' }}>
        <div style={{ fontFamily: 'Arsenica Trial, serif', fontSize: '22px', fontWeight: 900, letterSpacing: '3px', color: '#fff' }}>
          ASTAR <span style={{ color: '#e8c46a' }}>·</span>
        </div>
        <ul style={{ display: 'flex', gap: '28px', listStyle: 'none', flexWrap: 'wrap', justifyContent: 'center' }}>
          <li><a href="/privacy" style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#a89ab5', textDecoration: 'none', transition: 'color 0.3s', cursor: 'pointer' }}>Privacidad</a></li>
          <li><a href="/terms" style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#a89ab5', textDecoration: 'none', transition: 'color 0.3s', cursor: 'pointer' }}>Términos</a></li>
          <li><a href="mailto:consultas@portalastar.com" style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#a89ab5', textDecoration: 'none', transition: 'color 0.3s', cursor: 'pointer' }}>Contacto</a></li>
          <li><a href="https://instagram.com/carlosbersano_" target="_blank" rel="noopener noreferrer" style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#a89ab5', textDecoration: 'none', transition: 'color 0.3s', cursor: 'pointer' }}>Instagram</a></li>
        </ul>
        <p style={{ fontSize: '11px', color: 'rgba(168,154,181,0.45)', letterSpacing: '1px', margin: 0 }}>© 2026 Astar · Carlos Bersano</p>
      </footer>
    </div>
  );
}
