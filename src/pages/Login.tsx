import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext"; // Dependência (você pedirá depois)
import api from "@/lib/api"; // Dependência (você pedirá depois)

// Importando componentes shadcn/ui
import { Button } from "@/components/ui/button"; // Caminho relativo
import { Input } from "@/components/ui/input"; // Caminho relativo
import { Label } from "@/components/ui/label"; // Caminho relativo
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // Caminho relativo
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Caminho relativo
import { Terminal } from "lucide-react"; // Ícone para o alerta

const NON_DIGIT_REGEX = /\D/g;
const CPF_LENGTH = 11;

const Login: React.FC = () => {
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  // O 'useAuth' só funcionará quando você adicionar o AuthContext
  const { login, isAuthenticated } = useAuth(); 

  // Redireciona se o usuário já estiver logado
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin"); // Mude para sua rota de admin/dashboard
    }
  }, [isAuthenticated, navigate]);

  const formatCPF = useCallback((value: string): string => {
    const cleaned = value.replace(NON_DIGIT_REGEX, "");
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`;
    if (cleaned.length <= 9)
      return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`;
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(
      6,
      9
    )}-${cleaned.slice(9, 11)}`;
  }, []);

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(NON_DIGIT_REGEX, "");
    setCpf(formatCPF(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedCpf = cpf.replace(NON_DIGIT_REGEX, "");

    if (cleanedCpf.length !== CPF_LENGTH) {
      setError("CPF inválido. Deve conter 11 dígitos.");
      return;
    }
    if (!password) {
      setError("Senha obrigatória.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // O backend decide se este é o CPF admin e se a senha confere
      const response = await api.post("/login", {
        cpf: cleanedCpf, // Envia o CPF limpo
        password: password,
      });

      // O AuthContext (login) cuida de salvar o token e redirecionar
      login(response.data.token);

    } catch (err: any) {
      setIsSubmitting(false);
      const defaultError =
        err.response?.data?.message ||
        "Erro ao fazer login. Verifique suas credenciais.";
      setError(defaultError);
      console.error("Erro no login:", err);
    }
  };

  return (
    // Container principal com a imagem de fundo e o blur
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center p-4"
      // Adicione a imagem de fundo que você usava
      style={{ backgroundImage: "url('/backgroundlogin.jpeg')" }}
    >
      {/* Overlay para o efeito de blur e escurecimento */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Card de Login (z-10 para ficar acima do overlay) */}
      <Card className="w-full max-w-md z-10 shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Login do Administrador</CardTitle>
          <CardDescription>
            Acesse o painel com seu CPF e senha.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  placeholder="000.000.000-00"
                  value={cpf} // Controlado pelo estado
                  onChange={handleCpfChange}
                  maxLength={14}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <Terminal className="h-4 w-4" />
                  <AlertTitle>Erro</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Carregando..." : "Entrar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;

