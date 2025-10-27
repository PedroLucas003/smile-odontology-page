import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar"; // Corrigido para @/
import Footer from "@/components/Footer"; // Corrigido para @/
import { Toaster } from "@/components/ui/toaster"; // Corrigido para @/

/*
 * O <Outlet /> é um componente especial do react-router-dom.
 * Ele funciona como um espaço reservado.
 * O React Router irá renderizar a página da rota atual (ex: <Index />, <Login />, <Prontuario />)
 * exatamente no lugar onde o <Outlet /> está.
 */

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet /> {/* As suas páginas (Login, Prontuario, etc.) aparecem aqui */}
      </main>
      <Footer />
      <Toaster /> {/* Adiciona o componente de Toasts globalmente */}
    </div>
  );
};

export default Layout;

