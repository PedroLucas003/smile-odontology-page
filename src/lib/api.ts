// src/lib/api.ts

import axios from "axios";

// Determina a URL base com base no ambiente (Vite usa import.meta.env)
const baseURL = import.meta.env.MODE === 'development'
  ? import.meta.env.VITE_API_URL_DEV || "http://localhost:4000" // Fallback para desenvolvimento
  : import.meta.env.VITE_API_URL; // URL de produção definida no .env

// Verifica se a URL de produção foi definida para evitar erros
if (import.meta.env.MODE !== 'development' && !baseURL) {
  console.error(
    "ERRO CRÍTICO: A variável de ambiente VITE_API_URL não está definida no seu arquivo .env ou no ambiente de build!"
  );
  // Poderia até lançar um erro aqui para parar a aplicação se preferir
  // throw new Error("VITE_API_URL não definida para produção.");
} else {
    console.log(`[API] Conectando à baseURL: ${baseURL}`); // Log para confirmar a URL
}

const api = axios.create({
  baseURL: baseURL, 
});

// Interceptor para adicionar token automaticamente (SEU CÓDIGO ORIGINAL - MANTIDO)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Log das requisições em desenvolvimento (opcional)
    if (import.meta.env.MODE === 'development') {
        console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.data || '');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para tratamento de erros e renovação de token (SEU CÓDIGO ORIGINAL - AJUSTADO PARA baseURL)
api.interceptors.response.use(
  (response) => response, // Respostas de sucesso passam direto
  async (error) => {
    const originalRequest = error.config;
    
    // Verifica se o erro é 401 (Não autorizado) e não é uma tentativa de refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Marca a requisição para não tentar renovar infinitamente
      console.warn("[API Interceptor] Token expirado ou inválido. Tentando renovar...");
      
      try {
        // A URL de refresh token é relativa à baseURL
        const refreshTokenURL = `/api/refresh-token`; // Ajustado para ser relativo

        console.log(`[API Interceptor] Solicitando novo token em: ${refreshTokenURL}`);
        
        // Tenta renovar o token usando o token antigo
        // O Axios normal é usado aqui para evitar loop infinito de interceptors
        const refreshResponse = await axios.post(
          `${baseURL}${refreshTokenURL}`, // Constrói a URL completa
          {}, // Corpo vazio, se aplicável
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem("token")}` // Envia o token antigo
            }
          }
        );
        
        const newToken = refreshResponse.data.token;
        console.log("[API Interceptor] Token renovado com sucesso.");
        
        // Atualiza o token no localStorage
        localStorage.setItem("token", newToken);
        
        // Atualiza os headers padrão do axios E o header da requisição original
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        
        // Repete a requisição original com o novo token
        console.log("[API Interceptor] Repetindo requisição original com novo token.");
        return api(originalRequest);

      } catch (refreshError: any) {
        console.error("[API Interceptor] Falha ao renovar token:", refreshError.response?.data || refreshError.message);
        // Se não conseguir renovar, remove o token antigo e redireciona para login
        localStorage.removeItem("token");
        
        // Redireciona para login - Idealmente, use useNavigate do react-router-dom se estiver num componente/hook
        // window.location.href é uma solução mais direta mas causa reload completo
        console.warn("[API Interceptor] Redirecionando para login...");
        window.location.href = "/login?session_expired=1"; 
        
        return Promise.reject(refreshError); // Rejeita o erro de refresh
      }
    }
    
    // Para todos os outros erros (não 401 ou já tentou refresh), apenas rejeita
    return Promise.reject(error);
  }
);

export default api;