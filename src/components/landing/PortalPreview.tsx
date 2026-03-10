import { motion } from "framer-motion";
import { Star, Sun, Hash, FileText, MessageCircle, HelpCircle } from "lucide-react";
import astralChart from "@/assets/astral-chart.jpg";

const features = [
  { icon: Star, title: "Carta Natal", desc: "Tu mapa natal completo, siempre accesible" },
  { icon: Sun, title: "Revolución Solar", desc: "El ciclo del año que estás transitando" },
  { icon: Hash, title: "Numerología", desc: "Los números que definen tu estructura" },
  { icon: FileText, title: "Reportes", desc: "Análisis detallados incluidos en tu portal" },
  { icon: MessageCircle, title: "Mensaje Mensual", desc: "Una lectura personal escrita solo para ti" },
  { icon: HelpCircle, title: "Pregunta Mensual", desc: "Una consulta con respuesta humana" },
];

const PortalPreview = () => {
  return (
    <section id="portal" className="relative py-32 px-6">
      <div className="absolute inset-0 section-glow pointer-events-none" />
      
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p className="text-sm tracking-[0.3em] uppercase text-primary mb-4">Tu Portal Personal</p>
          <h2 className="font-serif text-4xl md:text-6xl font-light mb-6">
            Todo tu recorrido,<br />
            <span className="text-gradient-gold italic">en un solo lugar</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Al suscribirte, accedes a un espacio personal y continuo donde cada lectura,
            mensaje y respuesta se conservan como parte de tu camino.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Chart image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative group"
          >
            <div className="relative rounded-2xl overflow-hidden premium-shadow-lg group-hover:glow-gold transition-shadow duration-500">
              <img
                src={astralChart}
                alt="Carta natal con símbolos del zodíaco"
                className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            </div>
            {/* Decorative orbit */}
            <div className="absolute -inset-4 rounded-full border border-primary/10 animate-gentle-rotate pointer-events-none" style={{ animationDuration: "40s" }} />
          </motion.div>

          {/* Feature grid */}
          <div className="grid grid-cols-2 gap-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="p-5 rounded-xl glass-card hover:border-primary/30 transition-all duration-300 group cursor-default premium-shadow"
              >
                <feature.icon className="w-5 h-5 text-primary mb-3 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="font-serif text-lg font-medium mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortalPreview;
