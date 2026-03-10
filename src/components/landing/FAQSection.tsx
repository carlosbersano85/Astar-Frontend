import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "¿El mensaje mensual es automático o generado por IA?",
    a: "Las interpretaciones de los documentos y el mensaje mensual se generan mediante un sistema de inteligencia artificial entrenado con el método de interpretación desarrollado por Carlos Bersano. Este sistema analiza los ciclos y procesos activos en espacio personal para ofrecer una guía clara sobre el momento que estás viviendo.",
  },
  {
    q: "¿Qué tipo de preguntas puedo hacer?",
    a: "Puedes preguntar sobre cualquier situación personal: trabajo, relaciones, decisiones importantes o procesos que estés atravesando. La idea es ayudarte a observar tu momento con mayor claridad.",
  },
  {
    q: "¿Qué datos de nacimiento debo aportar?",
    a: "Cualquier cosa que tenga sentido para ti: decisiones laborales, relaciones, momentos, patrones emocionales, desafíos personales. El único requisito es que te importe. La respuesta será reflexiva, fundamentada y personal.",
  },
  {
    q: "¿Puedo cancelar en cualquier momento?",
    a: "Para calcular tu mapa personal necesitamos:",
    a2: "⦁ fecha de nacimiento",
    a3: "⦁ hora de nacimiento",
    a4: "⦁ ciudad de nacimiento",
    a5: "Si no conoces la hora exacta, algunas funciones del portal igualmente podrán utilizarse."
  },
  {
    q: "¿Mis consultas son privadas?",
    a: "Sí. Tus documentos y análisis permanecen guardados dentro de tu espacio personal para que puedas consultarlos cuando lo necesites.",
  },
  {
    q: "¿El portal se actualiza con el tiempo?",
    a: "Sí. Esto es muy interesante. A medida que avanzas en tu proceso se irán agregando nuevos análisis, mensajes y funciones dentro de tu espacio personal.",
  },
  {
    q: "Puedo hacer más de una pregunta al mes?",
    a: "Sí. Tu plan incluye una pregunta mensual, pero podrás realizar consultas adicionales cuando lo necesites.",
  },
  {
    q: "¿Qué ocurre cuando me suscribo?",
    a: "Al suscribirte se crea tu espacio personal dentro de la plataforma, donde podrás acceder a tus documentos, análisis y consultas, todo organizado como parte de tu proceso personal.",
  },
  {
    q: "¿Necesito saber astrología para usar Astar?",
    a: "No. El portal está pensado para cualquier persona que quiera comprender mejor su proceso personal, sin necesidad de conocimientos previos.",
  },
];

const FAQSection = () => {
  return (
    <section className="relative py-32 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-sm tracking-[0.3em] uppercase text-primary mb-4">Preguntas Frecuentes</p>
          <h2 className="font-serif text-4xl md:text-6xl font-light">
            Preguntas <span className="text-gradient-gold italic">habituales</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mt-5 mx-auto text-lg">
            IMPORTANTE ¿La pregunta mensual es respondida por una persona real?
            Sí. Cada suscripción incluye 1 pregunta personal al mes, y esa consulta es respondida directamente por Carlos Bersano.
            La respuesta es 100% humana, basada en la interpretación de tus documentos y en el momento personal que estás atravesando.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="rounded-xl glass-card px-6 data-[state=open]:border-primary/20 transition-colors premium-shadow"
              >
                <AccordionTrigger className="text-left font-serif text-lg font-medium py-5 hover:no-underline hover:text-primary transition-colors">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">
                  {faq.a}
                  {faq.a2 && <><br />{faq.a2}</>}
                  {faq.a3 && <><br />{faq.a3}</>}
                  {faq.a4 && <><br />{faq.a4}</>}
                  {faq.a5 && <><br /><br />{faq.a5}</>}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
