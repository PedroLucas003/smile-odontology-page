import React, { useState, useCallback } from "react";
import api from "../lib/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaFilePdf } from "react-icons/fa";

// Importando componentes shadcn/ui
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Terminal, CheckCircle } from "lucide-react";

const NON_DIGIT_REGEX = /\D/g;
const CPF_LENGTH = 11;

// Define um tipo para os dados do prontuário
type Procedimento = {
  isPrincipal?: boolean;
  dataProcedimento?: string;
  dataNovoProcedimento?: string;
  procedimento?: string;
  denteFace?: string;
  valor?: string | number;
  modalidadePagamento?: string;
  profissional?: string;
};

type ProntuarioData = {
  dadosPessoais?: {
    nomeCompleto?: string;
    cpf?: string;
    telefone?: string;
    endereco?: string;
    dataNascimento?: string;
  };
  saude?: {
    detalhesDoencas?: string;
    quaisRemedios?: string;
    quaisMedicamentos?: string;
    quaisAnestesias?: string;
    historicoCirurgia?: string;
    respiracao?: string;
    peso?: number | string;
    habitos?: {
      frequenciaFumo?: string;
      frequenciaAlcool?: string;
    };
  };
  exames?: {
    exameSangue?: string;
    coagulacao?: string;
    cicatrizacao?: string;
    sangramentoPosProcedimento?: string;
  };
  odontologico?: {
    historicoOdontologico?: string;
  };
  procedimentos?: Procedimento[];
};

const Prontuario: React.FC = () => {
  const [cpf, setCpf] = useState("");
  const [error, setError] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatarCPF = useCallback((value: string): string => {
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
    setCpf(formatarCPF(value));
  };

  const formatarValor = (valor: string | number | undefined | null): string => {
    if (valor === undefined || valor === null) return "-";
    const num =
      typeof valor === "string"
        ? parseFloat(valor.replace(/[^\d,]/g, "").replace(",", "."))
        : valor;
    return isNaN(num)
      ? String(valor)
      : num.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
  };

  const val = (
    field: string | number | undefined | null,
    suffix = ""
  ): string => {
    if (field === undefined || field === null || String(field).trim() === "") {
      return "-";
    }
    return String(field) + suffix;
  };

  const gerarPDF = (dados: ProntuarioData) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Clínica Sorria Odonto", 105, 15, { align: "center" });
    doc.setFontSize(10);
    doc.text("CNPJ: 37.115.451/0001-84", 105, 22, { align: "center" });
    doc.setFontSize(14);
    doc.text("Prontuário do Paciente", 105, 30, { align: "center" });

    const secoes = {
      "Dados Pessoais": [
        ["Nome Completo", val(dados.dadosPessoais?.nomeCompleto)],
        ["CPF", val(dados.dadosPessoais?.cpf)],
        ["Telefone", val(dados.dadosPessoais?.telefone)],
        ["Endereço", val(dados.dadosPessoais?.endereco)],
        ["Data de Nascimento", val(dados.dadosPessoais?.dataNascimento)],
      ],
      "Histórico de Saúde": [
        ["Detalhes de Doenças", val(dados.saude?.detalhesDoencas)],
        ["Medicamentos em Uso", val(dados.saude?.quaisRemedios)],
        ["Alergia a Medicamentos", val(dados.saude?.quaisMedicamentos)],
        ["Alergia a Anestesias", val(dados.saude?.quaisAnestesias)],
        ["Histórico Cirúrgico", val(dados.saude?.historicoCirurgia)],
        ["Respiração", val(dados.saude?.respiracao)],
        ["Peso (kg)", val(dados.saude?.peso, " kg")],
      ],
      Hábitos: [
        ["Frequência de Fumo", val(dados.saude?.habitos?.frequenciaFumo)],
        ["Frequência de Álcool", val(dados.saude?.habitos?.frequenciaAlcool)],
      ],
      Exames: [
        ["Exame de Sangue", val(dados.exames?.exameSangue)],
        ["Coagulação", val(dados.exames?.coagulacao)],
        ["Cicatrização", val(dados.exames?.cicatrizacao)],
        [
          "Sangramento Pós-Procedimento",
          val(dados.exames?.sangramentoPosProcedimento),
        ],
      ],
      "Histórico Odontológico": [
        [
          "Histórico Odontológico",
          val(dados.odontologico?.historicoOdontologico),
        ],
      ],
    };

    let y = 40;

    for (const [titulo, campos] of Object.entries(secoes)) {
      const hasData = campos.some((campo) => campo[1] !== "-");
      if (hasData) {
        doc.setFontSize(12);
        doc.text(titulo, 14, y);
        autoTable(doc, {
          startY: y + 5,
          head: [["Campo", "Valor"]],
          body: campos.filter((campo) => campo[1] !== "-"),
          theme: "grid",
          headStyles: { fillColor: [41, 128, 185] },
          styles: { fontSize: 10 },
          margin: { left: 14, right: 14 },
        });
        y = (doc as any).lastAutoTable.finalY + 10;
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
      }
    }

    if (y > 200) {
      doc.addPage();
      y = 20;
    } else {
      y += 10;
    }

    doc.setFontSize(14);
    doc.text("Histórico de Procedimentos", 105, y, { align: "center" });
    y += 10;

    if (dados.procedimentos && dados.procedimentos.length > 0) {
      dados.procedimentos.forEach((proc, index) => {
        const procedimentoData = [
          [
            "Tipo",
            proc.isPrincipal
              ? "Procedimento Principal"
              : `Procedimento #${index + 1}`,
          ],
          ["Data", val(proc.dataProcedimento || proc.dataNovoProcedimento)],
          ["Procedimento", val(proc.procedimento)],
          ["Dente/Face", val(proc.denteFace)],
          ["Valor", formatarValor(proc.valor)],
          ["Modalidade", val(proc.modalidadePagamento)],
          ["Profissional", val(proc.profissional)],
        ];
        autoTable(doc, {
          startY: y,
          head: [["Campo", "Valor"]],
          body: procedimentoData,
          theme: "grid",
          headStyles: { fillColor: [41, 128, 185] },
          styles: { fontSize: 10 },
          margin: { left: 14, right: 14 },
        });
        y = (doc as any).lastAutoTable.finalY + 10;
        if (y > 250 && index < dados.procedimentos.length - 1) {
          doc.addPage();
          y = 20;
        }
      });
    } else {
      doc.text("Nenhum procedimento registrado", 14, y);
    }

    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    window.open(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedCpf = cpf.replace(NON_DIGIT_REGEX, "");

    if (cleanedCpf.length !== CPF_LENGTH) {
      setError("CPF inválido. Deve conter 11 dígitos.");
      setEnviado(false);
      return;
    }

    setIsSubmitting(true);
    setError("");
    setEnviado(false);

    try {
      const response = await api.post("/prontuario", {
        cpf: cleanedCpf,
      });
      gerarPDF(response.data.data);
      setEnviado(true);
    } catch (err: any) {
      const defaultError =
        err.response?.data?.message ||
        "Erro ao buscar prontuário. Verifique o CPF e tente novamente.";
      setError(defaultError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center p-4"
      style={{ backgroundImage: "url('/backgroundlogin.jpeg')" }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <Card className="w-full max-w-md z-10 shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Acessar Prontuário</CardTitle>
          <CardDescription>
            Digite seu CPF para baixar seu prontuário em PDF.
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
                  value={cpf}
                  onChange={handleCpfChange}
                  maxLength={14}
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

              {/* ===== CÓDIGO CORRIGIDO ABAIXO ===== */}
              {enviado && !error && (
                <Alert
                  variant="default"
                  className="border-green-500 text-green-700"
                >
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <AlertTitle>Sucesso!</AlertTitle>
                  <AlertDescription>
                    Seu prontuário está sendo gerado em uma nova aba.
                  </AlertDescription>
                </Alert>
              )}
              {/* ===== FIM DA CORREÇÃO ===== */}

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Buscando..."
                ) : (
                  <>
                    <FaFilePdf className="mr-2 h-4 w-4" />
                    Baixar Prontuário
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Prontuario;