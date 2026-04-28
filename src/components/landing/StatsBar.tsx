import { motion } from "framer-motion";

const stats = [
  { value: "1,200+", label: "Cartas leídas" },
  { value: "98%", label: "Tasa de renovación" },
  { value: "12+", label: "Años de práctica" },
  { value: "100%", label: "Respuestas humanas" },
];

const CountItem = ({ stat, index }: { stat: typeof stats[0]; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1, type: "spring", stiffness: 100 }}
      className="text-center group"
    >
      <p className="font-numeric text-4xl md:text-5xl font-light text-gradient-gold mb-2 group-hover:scale-110 transition-transform duration-300 tabular-nums">
        {stat.value}
      </p>
      <p className="text-sm text-muted-foreground tracking-wide">{stat.label}</p>
    </motion.div>
  );
};

const StatsBar = () => {
  return (
    <section className="relative py-20 px-6 border-y border-border/30">
      <div className="absolute inset-0 section-glow pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-radial-gold pointer-events-none opacity-20" />
      <div className="relative max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {stats.map((stat, i) => (
            <CountItem key={stat.label} stat={stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsBar;
