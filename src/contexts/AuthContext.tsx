import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";

// Define a interface para o que o contexto vai providenciar
interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

// Criar o Contexto
// Usamos '!' para dizer ao TypeScript que vamos providenciar o valor
const AuthContext = createContext<AuthContextType>(null!);

// Criar o Hook 'useAuth'
// É isto que a sua página de Login importa
export const useAuth = () => {
  return useContext(AuthContext);
};

// Criar o Provedor
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Para checar o token inicial
  const navigate = useNavigate();

  // Efeito para verificar o token no localStorage quando o app carrega
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      // Aqui você poderia adicionar uma lógica para validar o token com o backend
      // Mas por agora, se o token existe, consideramos logado.
      setIsAuthenticated(true);
    }
    setIsLoading(false); // Terminou a verificação
  }, []);

  const login = (token: string) => {
    // 1. Salva o token no localStorage
    localStorage.setItem("authToken", token);
    // 2. Atualiza o estado
    setIsAuthenticated(true);
    // 3. Redireciona para a página de admin/dashboard após o login
    // !! IMPORTANTE: Mude "/admin" se sua rota de admin for outra !!
    navigate("/admin");
  };

  const logout = () => {
    // 1. Remove o token
    localStorage.removeItem("authToken");
    // 2. Atualiza o estado
    setIsAuthenticated(false);
    // 3. Redireciona para a página de login
    navigate("/login");
  };

  // Não renderiza os componentes filhos até saber se está logado ou não
  // Isso evita um "piscar" da tela (ex: ver a página de login por 1s)
  if (isLoading) {
    return null; // Ou uma tela de loading global
  }

  const value = {
    isAuthenticated,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

