import { motion } from "framer-motion";

const AccompanimentSection = () => {
  return (
    <section id="accompaniment" className="relative py-32 px-6">
      <div className="absolute inset-0 bg-gradient-radial-gold pointer-events-none opacity-30" />

      <div className="relative max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p className="text-sm tracking-[0.3em] uppercase text-primary mb-4">Qué nos diferencia</p>
          <h2 className="font-serif text-4xl md:text-6xl font-light mb-6">
            Acompañamiento<br />
            <span className="text-gradient-gold italic">humano real</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            whileHover={{ y: -4 }}
            className="p-8 md:p-10 rounded-2xl glass-card hover:border-primary/20 relative overflow-hidden transition-all duration-300 premium-shadow"
          >
            <div className="absolute top-0 left-0 right-0 h-px line-gold" />
            <span className="text-xs tracking-[0.25em] uppercase text-primary mb-6 block">Cada mes</span>
            <h3 className="font-serif text-2xl md:text-3xl font-light mb-4">
              Cada mes. Un mensaje personal sobre el momento que estás viviendo
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Cada mes recibirás un análisis personalizado que interpreta las energías y procesos activos en tu vida durante ese período.
              Este mensaje te ayudará a comprender el momento que estás atravesando, observar tus tendencias y tomar decisiones con mayor claridad.

            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.15 }}
            whileHover={{ y: -4 }}
            className="p-8 md:p-10 rounded-2xl glass-card hover:border-primary/20 relative overflow-hidden transition-all duration-300 premium-shadow"
          >
            <div className="absolute top-0 left-0 right-0 h-px line-gold" />
            <span className="text-xs tracking-[0.25em] uppercase text-primary mb-6 block">Incluido</span>
            <h3 className="font-serif text-2xl md:text-3xl font-light mb-4">
              Incluido. Una pregunta mensual con respuesta personal
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Cada mes podrás enviar una pregunta sobre cualquier aspecto de tu vida: trabajo, decisiones, relaciones o procesos personales.
              La respuesta será escrita personalmente por Carlos Bersano y quedará guardada en tu portal como parte de tu recorrido.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-8 p-6 rounded-xl glass-card text-center premium-shadow"
        >
          <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
            Todo queda registrado en tu portal: mensajes, preguntas y respuestas.
            Con el tiempo se convierte en una historia viva de tu proceso personal.
          </p>
        </motion.div>
      </div>

      <div className="section-divider max-w-2xl mx-auto mt-32" />
    </section>
  );
};

export default AccompanimentSection;
