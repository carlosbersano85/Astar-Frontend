import { motion } from "framer-motion";
import { Compass, Heart, Zap, Leaf } from "lucide-react";

const personas = [
  {
    icon: Compass,
    title: "Cuando sientes que tu vida está cambiando",
    description:
      "Hay momentos en los que algo empieza a moverse dentro de ti. Cambios, decisiones, nuevas etapas. Necesitas comprender qué está ocurriendo realmente en tu proceso.",
  },
  {
    icon: Heart,
    title: "Cuando sientes que repites los mismos patrones",
    description:
      "Situaciones que vuelven a aparecer. Relaciones similares. Decisiones que parecen llevarte siempre al mismo lugar.Tal vez no sea casualidad.",
  },
  {
    icon: Zap,
    title: "Cuando necesitas claridad",
    description:
      "A veces falta información y perspectiva. En este espacio podrás observar tu historia, tus ciclos y tu momento actual con más claridad.",
  },
  {
    icon: Leaf,
    title: "Cuando decides conocerte de verdad",
    description:
      "No todo el mundo quiere mirarse hacia adentro.Pero cuando decides hacerlo, todo empieza a cambiar.Este portal está pensado para acompañar ese proceso",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 25, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } },
};

const WhoIsThisFor = () => {
  return (
    <section className="relative py-32 px-6">
      <div className="absolute inset-0 section-glow pointer-events-none" />

      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p className="text-sm tracking-[0.3em] uppercase text-primary mb-4">¿Es para ti?</p>
          <h2 className="font-serif text-4xl md:text-6xl font-light mb-6">
            Pensado para quienes<br />
            <span className="text-gradient-gold italic">buscan comprender su propio proceso</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Astar no es un espacio de respuestas rápidas ni de predicciones vacías.
            Es un espacio para quienes sienten que su vida tiene un sentido y quieren comprender qué está ocurriendo REALMENTE
            Personas que están listas para observar, cuestionar y entender sus propios procesos
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid sm:grid-cols-2 gap-6"
        >
          {personas.map((p) => (
            <motion.div
              key={p.title}
              variants={cardVariants}
              whileHover={{ y: -4 }}
              className="p-8 rounded-2xl glass-card hover:border-primary/20 transition-all duration-300 group premium-shadow"
            >
              <div className="flex items-center gap-4 mb-4">
                <motion.div
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="min-w-10 min-h-10 rounded-full border border-primary/30 flex items-center justify-center group-hover:border-primary/60 group-hover:bg-primary/5 transition-all duration-300"
                >
                  <p.icon className="w-5 h-5 text-primary" />
                </motion.div>
                <h3 className="font-serif text-2xl font-medium">{p.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed pl-14">
                {p.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="section-divider max-w-2xl mx-auto mt-32" />
    </section>
  );
};

export default WhoIsThisFor;
