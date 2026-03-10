import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        {/* Use a font stack that guarantees numerals display (custom fonts may lack digits) */}
        <h1
          className="mb-4 text-7xl font-bold tracking-tight text-foreground sm:text-8xl"
          style={{ fontFamily: '"Space Mono", "Inter", monospace, system-ui, sans-serif' }}
        >
          404
        </h1>
        <p className="mb-4 text-xl text-muted-foreground">¡Ups! Página no encontrada</p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          Volver al inicio
        </a>
      </div>
    </div>
  );
};

export default NotFound;
