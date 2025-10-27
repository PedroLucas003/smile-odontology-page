// src/App.tsx

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom"; 

// Importe as páginas
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Prontuario from "./pages/Prontuario";
import AdminPage from "./pages/AdminPage"; // <-- 1. Importe a página AdminPage

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/prontuario" element={<Prontuario />} />

        {/* --- 2. ADICIONE ESTA LINHA PARA A ROTA ADMIN --- */}
        <Route path="/admin" element={<AdminPage />} /> 

        {/* Rota catch-all "*" deve ser a última */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </QueryClientProvider> 
);

export default App;