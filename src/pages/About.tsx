import { motion } from "framer-motion";
import { Star, Eye, Compass } from "lucide-react";

const sections = [
  {
    icon: Star,
    title: "Sobre Astar",
    content: "Astar es una plataforma de acompañamiento astrológico y simbólico. Ofrecemos lecturas de carta natal, revolución solar, numerología y mensajes mensuales personalizados. Nuestro objetivo es brindarte herramientas de autoconocimiento profundo, no predicciones superficiales."
  },
  {
    icon: Eye,
    title: "Nuestra Perspectiva",
    content: "Creemos que la astrología es un lenguaje simbólico que conecta lo celestial con lo humano. No leemos el futuro: leemos patrones, ciclos y arquetipos. Cada persona es única, y cada lectura refleja esa singularidad. Trabajamos con respeto, profundidad y sensibilidad."
  },
  {
    icon: Compass,
    title: "Cómo Funciona la Lectura Simbólica",
    content: "La lectura simbólica interpreta los planetas, casas y aspectos de tu carta natal como reflejos de tu psique y tu camino de vida. No se trata de destino fijo, sino de tendencias energéticas. Comprender estos símbolos te permite tomar decisiones más conscientes y alineadas con tu esencia."
  },
];

const About = () => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="font-serif text-5xl md:text-6xl text-gradient-gold font-semibold mb-4 text-center">Sobre Nosotros</h1>
          <p className="text-center text-muted-foreground mb-16 max-w-xl mx-auto">
            Conoce la filosofía detrás de Astar y cómo la lectura simbólica puede transformar tu vida.
          </p>
        </motion.div>

        <div className="space-y-12">
          {sections.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="glass-card rounded-2xl p-8 md:p-10 premium-shadow"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <s.icon className="w-6 h-6 text-primary" />
                </div>
                <h2 className="font-serif text-2xl text-foreground">{s.title}</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed text-lg">{s.content}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
