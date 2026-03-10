import { motion } from "framer-motion";

const Manifesto = () => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="font-serif text-5xl md:text-6xl text-gradient-gold font-semibold mb-4 text-center">Manifiesto</h1>
          <div className="h-px w-24 mx-auto bg-primary/40 mb-12" />

          <div className="space-y-8 text-muted-foreground leading-relaxed text-lg">
            <p>
              Astar nace de una convicción profunda: que los símbolos del cielo no predicen el futuro, 
              sino que iluminan el presente. Cada carta natal es un mapa del alma, un lenguaje que habla 
              de tus ciclos, tus dones y tus desafíos más íntimos.
            </p>
            <p>
              No creemos en la astrología como entretenimiento ni como dogma. La entendemos como una 
              herramienta de autoconocimiento que, cuando se lee con profundidad y responsabilidad, 
              puede transformar la manera en que te relacionas contigo mismo y con el mundo.
            </p>

            <h2 className="font-serif text-3xl text-foreground pt-6">Nuestra Perspectiva</h2>
            <p>
              La lectura simbólica no es magia. Es un arte que combina conocimiento ancestral con 
              sensibilidad humana. Cada planeta en tu carta habla de una parte de ti. Cada casa, 
              de un área de tu vida. Cada tránsito, de un momento de evolución.
            </p>
            <p>
              En Astar, no te decimos qué hacer. Te mostramos las energías que te rodean y te 
              acompañamos mientras tú decides cómo navegarlas.
            </p>

            <h2 className="font-serif text-3xl text-foreground pt-6">Interpretación Simbólica</h2>
            <p>
              La interpretación simbólica es el corazón de nuestro trabajo. No se trata de predicciones 
              literales, sino de comprender los arquetipos que operan en tu vida. Saturno no es "mala 
              suerte" — es el maestro que te pide estructura. Venus no es solo "amor" — es tu relación 
              con el placer, la belleza y los valores.
            </p>
            <p>
              Cada mes, tu lectura mensual refleja los tránsitos actuales y cómo interactúan con tu 
              carta natal única. Es un mensaje personal, no genérico.
            </p>

            <h2 className="font-serif text-3xl text-foreground pt-6">Un Mensaje Personal</h2>
            <p>
              Astar no es una aplicación más de horóscopo. Es un espacio de intimidad y reflexión. 
              Aquí tu carta se lee con ojos humanos, con tiempo, con cuidado. Porque creemos que 
              mereces más que algoritmos: mereces presencia.
            </p>
            <p className="text-primary font-serif text-xl italic pt-4">
              "Los astros no obligan. Inclinan. Y comprender esa inclinación es el primer paso 
              hacia la libertad."
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Manifesto;
