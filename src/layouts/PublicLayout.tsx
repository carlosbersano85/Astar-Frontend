import { Outlet } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import FloatingOrbs from "@/components/landing/FloatingOrbs";
import GoldDustParticles from "@/components/landing/GoldDustParticles";

const PublicLayout = () => {
  return (
    <main className="bg-gradient-dark min-h-screen relative">
      <div className="fixed inset-0 bg-noise pointer-events-none z-0" />
      <FloatingOrbs />
      <GoldDustParticles />
      <div className="relative z-10">
        <Navbar />
        <div className="pt-20">
          <Outlet />
        </div>
        <Footer />
      </div>
    </main>
  );
};

export default PublicLayout;
