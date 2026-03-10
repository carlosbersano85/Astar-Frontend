import { motion } from "framer-motion";
import { UserPlus, Sparkles, MessageCircle } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    number: "01",
    title: "Suscríbete y crea tu espacio personal",
    description:
      "Completa tus datos y activa tu portal.A partir de ese momento comienza a construirse tu espacio de autoconocimiento.",
  },
  {
    icon: Sparkles,
    number: "02",
    title: "Explora tu portal personal",
    description:
      "Accede a tus documentos, análisis y herramientas de autoconocimiento.Todo organizado en un mismo lugar para observar tu proceso a lo largo del tiempo.",
  },
  {
    icon: MessageCircle,
    number: "03",
    title: "Acompañamiento directo con Carlos Bersano",
    description:
      "Cada mes podrás recibir una reflexión personalizada y realizar tu consulta.Un espacio de acompañamiento real, escrito y analizado personalmente por Carlos Bersano.",
  },
];

const HowItWorks = () => {
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
          <p className="text-sm tracking-[0.3em] uppercase text-primary mb-4">Cómo Funciona</p>
          <h2 className="font-serif text-4xl md:text-6xl font-light mb-6">
            Tres pasos para<br />
            <span className="text-gradient-gold italic">comenzar tu proceso</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Empezar es simple. Tu espacio personal se activa en pocos minutos.
          </p>
        </motion.div>

        <div className="relative grid md:grid-cols-3 gap-8">
          {/* Connecting line */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="hidden md:block absolute top-16 left-[16.6%] right-[16.6%] h-px line-gold origin-left"
          />

          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className="relative text-center group"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative inline-flex items-center justify-center w-16 h-16 rounded-full border border-primary/30 glass-card mb-6 group-hover:glow-gold transition-shadow duration-500 premium-shadow"
              >
                <step.icon className="w-6 h-6 text-primary" />
              </motion.div>
              <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3">{step.number}</p>
              <h3 className="font-serif text-xl md:text-2xl font-medium mb-3">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Section divider */}
      <div className="section-divider max-w-2xl mx-auto mt-32" />
    </section>
  );
};

export default HowItWorks;
