import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "@/App";
import "@/index.css";
import { AuthProvider } from "@/contexts/AuthContext";

const container = document.getElementById("root");

if (container) {
  const root = createRoot(container);

  root.render(
    <React.StrictMode>
      <BrowserRouter>  {/* <--- Mova para cá */}
        <AuthProvider> {/* <--- Envolva o AuthProvider */}
          <App />
        </AuthProvider>
      </BrowserRouter> {/* <--- E feche aqui */}
    </React.StrictMode>
  );
} else {
  console.error("Elemento 'root' não encontrado. Verifique seu index.html.");
}