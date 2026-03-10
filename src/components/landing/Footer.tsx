import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTheme } from "next-themes";

const Footer = () => {
  const { resolvedTheme } = useTheme();
  const logoSrc = resolvedTheme === "light" ? "/3SIN%20FONDO/logo%20solo%20final.png" : "/3SIN%20FONDO/logoblanco.png";
  return (
    <footer className="border-t border-border/50 pt-20 pb-10 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-block mb-3">
              <img src={logoSrc} alt="Astar" className="h-10 w-auto" />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Lectura simbólica y acompañamiento humano real. Tu carta natal, numerología y revolución solar — siempre accesibles.
            </p>
          </div>
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-foreground mb-4 font-medium">Plataforma</p>
            <ul className="space-y-2.5">
              <li><Link to="/portal-preview" className="text-sm text-muted-foreground hover:text-primary transition-colors">Tu Portal</Link></li>
              <li><Link to="/subscribe" className="text-sm text-muted-foreground hover:text-primary transition-colors">Suscripción</Link></li>
              <li><Link to="/how-it-works" className="text-sm text-muted-foreground hover:text-primary transition-colors">Cómo Funciona</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-foreground mb-4 font-medium">Recursos</p>
            <ul className="space-y-2.5">
              <li><Link to="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
              <li><Link to="/manifesto" className="text-sm text-muted-foreground hover:text-primary transition-colors">Manifiesto</Link></li>
              <li><Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">Sobre Nosotros</Link></li>
              <li><a href="/5MANUAL%20DE%20MARCA/manual%20grafico1.pdf" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">Manual de marca (PDF)</a></li>
            </ul>
          </div>
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-foreground mb-4 font-medium">Conectar</p>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Instagram</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Twitter / X</a></li>
              <li><a href="mailto:hola@astar.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">Email</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border/30 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Astar. Todos los derechos reservados.</p>
          <p className="text-xs text-muted-foreground">Pagos seguros con Stripe & Mercado Pago</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
