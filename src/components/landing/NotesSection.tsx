import { motion } from "framer-motion";

const NotesSection = () => {
  const posts = [
    { title: "Sobre la mirada simbólica", excerpt: "No buscamos predecir: buscamos comprender. Una reflexión sobre cómo la lectura simbólica nos devuelve al centro.", date: "Próximamente" },
    { title: "El tiempo circular", excerpt: "La revolución solar no es repetición, es una espiral. Cada año volvemos al mismo punto, pero con mayor profundidad.", date: "Próximamente" },
    { title: "Numerología y decisión", excerpt: "Los números no deciden por nosotros. Pero sí revelan la estructura desde la que tomamos decisiones.", date: "Próximamente" },
  ];

  return (
    <section id="notes" className="relative py-32 px-6">
      <div className="absolute inset-0 section-glow pointer-events-none" />
      
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-sm tracking-[0.3em] uppercase text-primary mb-4">Notas y reflexiones</p>
          <h2 className="font-serif text-4xl md:text-6xl font-light">
            Escrito desde <span className="text-gradient-gold italic">la mirada</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <motion.article
              key={post.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="p-6 rounded-xl glass-card hover:border-primary/20 transition-all duration-300 group cursor-pointer premium-shadow"
            >
              <span className="text-xs text-muted-foreground tracking-wide">{post.date}</span>
              <h3 className="font-serif text-xl font-medium mt-3 mb-3 group-hover:text-primary transition-colors duration-300">
                {post.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{post.excerpt}</p>
              <div className="mt-4 h-px w-0 group-hover:w-full bg-primary/30 transition-all duration-500" />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NotesSection;
