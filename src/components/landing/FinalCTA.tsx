import { motion } from "framer-motion";
import Starfield from "./Starfield";

const FinalCTA = () => {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      <Starfield />
      <div className="absolute inset-0 bg-gradient-radial-gold pointer-events-none opacity-40" />

      <div className="relative max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-sm tracking-[0.3em] uppercase text-primary mb-6">Comienza tu camino</p>
          <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl font-light leading-[1.1] mb-8">
            Tu proceso&nbsp;
            <span className="text-gradient-gold italic">no se detiene</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-12 leading-relaxed">
            Las decisiones que tomas, los momentos que atraviesas y los ciclos que se repiten forman parte de una historia que está en constante movimiento.
            Este espacio existe para ayudarte a observar y comprender ese proceso.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="#subscription"
              className="px-10 py-4 rounded-full shimmer-gold text-primary-foreground font-medium tracking-wide hover:opacity-90 transition-opacity glow-gold text-lg"
            >
              Acceder a mi espacio personal
            </a>
            <a
              href="#portal"
              className="px-10 py-4 rounded-full border border-border text-foreground hover:border-primary/50 hover:bg-primary/5 transition-all tracking-wide"
            >
              Ver cómo funciona. VIDEO.
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="mt-20 h-px w-48 mx-auto line-gold"
        />
      </div>
    </section>
  );
};

export default FinalCTA;
