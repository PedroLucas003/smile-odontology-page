// src/lib/api.ts

import axios from "axios";

// 1. Determina a URL base DO DOMÍNIO (sem /api ainda)
const baseDomain = import.meta.env.MODE === 'development'
  ? import.meta.env.VITE_API_URL_DEV || "http://localhost:4000" // Fallback para desenvolvimento
  : import.meta.env.VITE_API_URL; // URL de produção definida no .env

// 2. Adiciona o prefixo /api à URL base do domínio
const baseURL = `${baseDomain}/api`; 

// Verifica se a URL de produção foi definida para evitar erros
if (import.meta.env.MODE !== 'development' && !baseDomain) {
  console.error(
    "ERRO CRÍTICO: A variável de ambiente VITE_API_URL não está definida no seu arquivo .env ou no ambiente de build!"
  );
} else {
    console.log(`[API] Conectando à baseURL: ${baseURL}`); // Log para confirmar a URL completa
}

const api = axios.create({
  baseURL: baseURL, // Ex: https://backendsorriaodonto.onrender.com/api
});

// Interceptor para adicionar token automaticamente (SEU CÓDIGO ORIGINAL - MANTIDO)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (import.meta.env.MODE === 'development') {
        // console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.data || '');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para tratamento de erros e renovação de token (SEU CÓDIGO ORIGINAL - AJUSTADO)
api.interceptors.response.use(
  (response) => response, // Respostas de sucesso passam direto
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; 
      console.warn("[API Interceptor] Token expirado/inválido. Tentando renovar...");
      
      try {
        // A URL de refresh token já está correta, pois baseURL inclui /api
        const refreshTokenURL = `/refresh-token`; // Relativo à baseURL (/api/refresh-token)

        console.log(`[API Interceptor] Solicitando novo token em: ${refreshTokenURL}`);
        
        // Usa o axios normal para evitar loop, mas com a URL completa correta
        const refreshResponse = await axios.post(
          `${baseURL}${refreshTokenURL}`, // Constrói a URL completa: https://.../api/refresh-token
          {}, 
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem("token")}` 
            }
          }
        );
        
        const newToken = refreshResponse.data.token;
        console.log("[API Interceptor] Token renovado com sucesso.");
        
        localStorage.setItem("token", newToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        
        console.log("[API Interceptor] Repetindo requisição original com novo token.");
        return api(originalRequest); // Repete a requisição com a instância 'api' configurada

      } catch (refreshError: any) {
        console.error("[API Interceptor] Falha ao renovar token:", refreshError.response?.data || refreshError.message);
        localStorage.removeItem("token");
        console.warn("[API Interceptor] Redirecionando para login...");
        // Redireciona de forma segura no React (idealmente seria com useNavigate, mas isto funciona)
        if (window.location.pathname !== '/login') {
            window.location.href = "/login?session_expired=1"; 
        }
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;