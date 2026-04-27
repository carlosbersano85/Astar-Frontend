import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const PRIVACY_POLICY_CONTENT = `
POLÍTICA DE PRIVACIDAD
Astar · Astrología, Numerología y Tarot
Última actualización: abril de 2026

1. IDENTIFICACIÓN DEL RESPONSABLE
El presente sitio web astarportal.com (en adelante, "el Portal") es operado por Astar, con domicilio electrónico en consultas@astarportal.com, en adelante denominado "el Titular".

El Titular actúa en carácter de responsable del tratamiento de los datos personales recopilados a través del Portal, en cumplimiento de la Ley N° 25.326 de Protección de los Datos Personales de la República Argentina y sus normas reglamentarias.

2. DATOS QUE SE RECOPILAN
Al registrarse y utilizar el Portal, el usuario puede proporcionar los siguientes datos personales:
• Nombre y apellido
• Dirección de correo electrónico
• Fecha, hora y lugar de nacimiento
• País y ciudad de residencia
• Información de pago procesada a través de plataformas externas (PayPal y MercadoPago)
• Historial de consultas y comunicaciones con el Titular
• Datos de navegación, dirección IP y cookies

El Titular no almacena datos de tarjetas de crédito ni información financiera sensible. Los pagos son procesados exclusivamente por PayPal y MercadoPago, plataformas que cuentan con sus propias políticas de privacidad y seguridad.

3. FINALIDAD DEL TRATAMIENTO
Los datos recopilados son utilizados exclusivamente para los siguientes fines:
• Brindar los servicios contratados (carta natal, numerología, consultas personalizadas, acceso al portal).
• Personalizar la experiencia del usuario dentro del Portal.
• Enviar comunicaciones relacionadas con el servicio (respuestas a consultas, orientación mensual, novedades del portal).
• Procesar pagos y gestionar suscripciones.
• Mejorar el funcionamiento del Portal mediante análisis estadístico anónimo.
• Cumplir con obligaciones legales aplicables.

Los datos personales no serán vendidos, cedidos ni transferidos a terceros con fines comerciales.

4. USO DE COOKIES Y HERRAMIENTAS DE ANALÍTICA
El Portal utiliza cookies propias y de terceros con las siguientes finalidades:
• Cookies técnicas: necesarias para el funcionamiento del Portal.
• Cookies analíticas: para medir el tráfico y comportamiento de los usuarios (Google Analytics u herramientas similares).
• Cookies de seguimiento: vinculadas a plataformas de publicidad o redes sociales (Meta Pixel u otras).

El usuario puede configurar su navegador para rechazar o eliminar cookies, aunque esto puede afectar el funcionamiento del Portal.

5. CONSERVACIÓN DE LOS DATOS
Los datos personales serán conservados durante el tiempo que el usuario mantenga su cuenta activa en el Portal, y por el plazo adicional que resulte necesario para cumplir con obligaciones legales o resolver eventuales disputas.

Una vez cancelada la cuenta, los datos serán eliminados o anonimizados en un plazo máximo de 90 días hábiles, salvo que la ley exija su conservación por un período mayor.

6. DERECHOS DEL USUARIO
En virtud de la Ley N° 25.326, el usuario titular de los datos tiene derecho a:
• Acceder a sus datos personales almacenados en el Portal.
• Rectificar datos inexactos o incompletos.
• Suprimir sus datos cuando ya no sean necesarios para los fines para los que fueron recopilados.
• Oponerse al tratamiento de sus datos en determinadas circunstancias.

Para ejercer cualquiera de estos derechos, el usuario deberá enviar una solicitud escrita a consultas@astarportal.com, indicando su nombre completo, el derecho que desea ejercer y la documentación que acredite su identidad.

La Dirección Nacional de Protección de Datos Personales (organismo de control en Argentina) tiene la atribución de atender las denuncias y reclamos que interpongan quienes resulten afectados en sus derechos por incumplimiento de la normativa vigente.

7. SEGURIDAD
Astar adopta medidas técnicas y organizativas razonables para proteger los datos personales contra accesos no autorizados, pérdida, alteración o divulgación. Sin embargo, ningún sistema de transmisión de datos por internet es completamente seguro, por lo que no se puede garantizar una seguridad absoluta.

8. MODIFICACIONES
El Titular se reserva el derecho de modificar la presente Política de Privacidad en cualquier momento. Los cambios serán notificados mediante publicación en el Portal con indicación de la fecha de actualización. El uso continuado del Portal tras la publicación de los cambios implicará la aceptación de los mismos.

9. CONTACTO
Para consultas relacionadas con esta política, el usuario puede comunicarse a:
consultas@astarportal.com
`;

const TERMS_AND_CONDITIONS_CONTENT = `
TÉRMINOS Y CONDICIONES DE USO
Astar · Astrología, Numerología y Tarot
Última actualización: abril de 2026

El acceso y uso del Portal astarportal.com implica la aceptación plena y sin reservas de los presentes Términos y Condiciones por parte del usuario. Si el usuario no está de acuerdo con alguna de las disposiciones aquí establecidas, deberá abstenerse de utilizar el Portal.

2. DESCRIPCIÓN DEL SERVICIO
Astar es un portal de autoconocimiento que ofrece herramientas basadas en astrología, numerología y tarot psicológico. Los servicios disponibles incluyen:
• Carta natal y análisis astrológico personalizado.
• Informes de numerología.
• Revolución solar e interpretación del momento actual.
• Sinastría y análisis de vínculos.
• Acceso al chatbot entrenado y personalizado por Astar.
• Respuestas personalizadas mensuales por parte del equipo de Astar (plan Luminary).
• Servicios extras bajo demanda (sesiones en vivo, consultas puntuales, informes especiales).

3. NATURALEZA DEL SERVICIO
Los servicios ofrecidos por Astar tienen carácter orientativo y de autoconocimiento. No constituyen diagnóstico médico, psicológico, jurídico, financiero ni de ninguna otra naturaleza profesional regulada. Astar no garantiza resultados específicos ni se responsabiliza por las decisiones que el usuario tome en base a la información recibida.

La astrología, numerología y el tarot son herramientas de reflexión simbólica. Su interpretación es subjetiva y no debe ser considerada como predicción infalible del futuro.

4. REGISTRO Y CUENTA DE USUARIO
Para acceder a los servicios del Portal, el usuario deberá crear una cuenta proporcionando información veraz, completa y actualizada. El usuario es responsable de mantener la confidencialidad de sus credenciales de acceso y de todas las actividades realizadas desde su cuenta.

Astar se reserva el derecho de suspender o cancelar cuentas que:
• Proporcionen información falsa o engañosa.
• Realicen un uso indebido o fraudulento del Portal.
• Incumplan los presentes Términos y Condiciones.

5. PLANES Y PAGOS
Plan Essentials (gratuito): Acceso sin costo a funcionalidades básicas del Portal. No requiere tarjeta de crédito ni información de pago.

Plan Luminary ($29 USD/mes o precio anual equivalente): Acceso completo a todas las funcionalidades del Portal, incluyendo la respuesta mensual personalizada.

Los pagos son procesados a través de PayPal y MercadoPago. Astar no almacena datos de medios de pago. El usuario acepta las condiciones de uso de dichas plataformas al momento de efectivizar su pago.

Los precios pueden ser modificados por Astar con previo aviso de al menos 30 días corridos mediante notificación al correo electrónico registrado del usuario.

6. CANCELACIÓN Y REEMBOLSOS
El usuario puede cancelar su suscripción al plan Luminary en cualquier momento desde su panel de usuario, sin penalidades ni costos adicionales. La cancelación tendrá efecto al finalizar el período de facturación en curso.

No se realizarán reembolsos por períodos ya facturados y abonados, salvo que Astar haya incumplido de manera manifiesta con la prestación del servicio contratado.

7. PROPIEDAD INTELECTUAL
Todos los contenidos del Portal — incluyendo textos, diseños, imágenes, metodologías, interpretaciones astrológicas y numerológicas, el chatbot y los informes personalizados — son propiedad exclusiva de Astar y están protegidos por las leyes de propiedad intelectual vigentes en la República Argentina.

Queda expresamente prohibida la reproducción, distribución, modificación o uso comercial de cualquier contenido del Portal sin autorización expresa y escrita de Astar.

8. LIMITACIÓN DE RESPONSABILIDAD
Astar no será responsable por:
• Daños directos o indirectos derivados del uso o imposibilidad de uso del Portal.
• Interrupciones del servicio por causas de fuerza mayor, mantenimiento o fallas técnicas ajenas al control de Astar.
• Decisiones tomadas por el usuario en base a los contenidos o interpretaciones recibidas.
• Pérdida de datos por causas no imputables a Astar.

9. CONDUCTA DEL USUARIO
El usuario se compromete a utilizar el Portal de manera responsable y respetuosa. Queda prohibido:
• Utilizar el Portal con fines ilegales o contrarios a la moral y las buenas costumbres.
• Intentar acceder de manera no autorizada a sistemas o datos del Portal.
• Reproducir o distribuir contenidos del Portal sin autorización.
• Suplantar la identidad de otras personas.

10. MODIFICACIONES DEL SERVICIO
Astar se reserva el derecho de modificar, suspender o discontinuar total o parcialmente el Portal en cualquier momento, con o sin previo aviso, sin que ello genere derecho a indemnización alguna a favor del usuario, salvo lo establecido en materia de reembolsos en la cláusula 6.

11. LEY APLICABLE Y JURISDICCIÓN
Los presentes Términos y Condiciones se rigen por las leyes de la República Argentina. Para cualquier controversia derivada del uso del Portal, las partes se someten a la jurisdicción de los Tribunales Ordinarios de la Ciudad de Córdoba, Argentina, con renuncia expresa a cualquier otro fuero que pudiera corresponder.

12. CONTACTO
Para consultas, reclamos o notificaciones relacionadas con estos Términos y Condiciones:
consultas@astarportal.com
`;

interface LegalDocumentsModalProps {
  children: React.ReactNode;
  type: "privacy" | "terms";
}

export function LegalDocumentsModal({ children, type }: LegalDocumentsModalProps) {
  const [open, setOpen] = useState(false);
  const content = type === "privacy" ? PRIVACY_POLICY_CONTENT : TERMS_AND_CONDITIONS_CONTENT;
  const title = type === "privacy" ? "Política de Privacidad" : "Términos y Condiciones de Uso";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl bg-[#18101b] p-8 border border-[#2a2033] shadow-xl"
        style={{ boxShadow: '0 8px 32px 0 rgba(0,0,0,0.45)' }}
      >
        <DialogHeader>
          <DialogTitle
            className="text-2xl font-bold mb-1 text-[#ffe082] tracking-tight font-serif"
            style={{ color: '#ffe082' }}
          >
            {title}
          </DialogTitle>
          <DialogDescription className="text-base text-[#e0d6f7] font-medium mb-2">
            Astar · Astrología, Numerología y Tarot
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <div className="text-base text-white whitespace-pre-wrap font-sans leading-relaxed">
            {content}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function PrivacyPolicyModal({ children }: { children: React.ReactNode }) {
  return <LegalDocumentsModal type="privacy">{children}</LegalDocumentsModal>;
}

export function TermsModal({ children }: { children: React.ReactNode }) {
  return <LegalDocumentsModal type="terms">{children}</LegalDocumentsModal>;
}