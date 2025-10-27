// src/lib/validators.ts

import { z } from 'zod';

const dateSchema = z.string()
    .min(10, "Formato inválido (DD/MM/AAAA)") // Garante que a string tenha o tamanho certo
    .refine((date) => {
        if (!/^\d{2}\/\d{2}\/\d{4}$/.test(date)) return false;
        const [day, month, year] = date.split('/').map(Number);
        // Verifica se a data é realmente válida (ex: 31/02 não passa)
        const d = new Date(year, month - 1, day);
        return !isNaN(d.getTime()) && d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day;
    }, "Data inválida")
    // Adiciona validação para data de nascimento ser no passado
    .refine((date) => {
        const [day, month, year] = date.split('/').map(Number);
        return new Date(year, month - 1, day) < new Date();
     }, "Data de nascimento deve ser no passado");


export const userFormSchema = z.object({
  // Dados Pessoais (Obrigatórios)
  nomeCompleto: z.string().min(3, { message: "Nome: Mínimo 3 caracteres." }),
  cpf: z.string().refine((cpf) => cpf.replace(/\D/g, '').length === 11, { message: "CPF: Deve conter 11 dígitos." }),
  telefone: z.string().refine((tel) => tel.replace(/\D/g, '').length >= 10, { message: "Telefone: Mínimo 10 dígitos." }),
  dataNascimento: dateSchema,
  endereco: z.string().min(5, { message: "Endereço: Mínimo 5 caracteres." }),
  
  // Anamnese (Obrigatórios)
  detalhesDoencas: z.string().min(1, { message: "Campo obrigatório." }),
  quaisRemedios: z.string().min(1, { message: "Campo obrigatório." }),
  quaisMedicamentos: z.string().min(1, { message: "Campo obrigatório." }),
  quaisAnestesias: z.string().min(1, { message: "Campo obrigatório." }),
  historicoCirurgia: z.string().min(1, { message: "Campo obrigatório." }),
  historicoOdontologico: z.string().min(1, { message: "Campo obrigatório." }),
  
  // Hábitos e Outros (Obrigatórios, exceto se marcados como .optional())
  frequenciaFumo: z.string(), // Geralmente tem um valor padrão, então não precisa de min(1)
  frequenciaAlcool: z.string(), // Idem
  respiracao: z.string().min(1, { message: "Campo obrigatório." }),
  peso: z.string().min(1, { message: "Peso obrigatório." }).refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, { message: "Peso inválido."}),

  // Exames e Sangramento (Opcionais - ADICIONADO .optional())
  exameSangue: z.string().optional(),
  coagulacao: z.string().optional(),
  cicatrizacao: z.string().optional(),
  sangramentoPosProcedimento: z.string().optional(),

  // Senhas (Opcionais e com validação de confirmação)
  password: z.string().min(6, { message: "Senha: Mínimo 6 caracteres." }).optional().or(z.literal('')), // Permite vazio ou min 6
  confirmPassword: z.string().optional().or(z.literal('')),

  // Procedimentos (gerenciado separadamente, mas precisa existir no tipo)
  historicoProcedimentos: z.array(z.any()).optional(),
})
// Refinamento para validar a confirmação de senha APENAS se a senha for preenchida
.refine((data) => {
    if (data.password && data.password.length >= 6) {
        return data.password === data.confirmPassword;
    }
    return true; // Se a senha não for preenchida (ou for < 6), não valida a confirmação
}, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"], // Indica qual campo mostrará o erro
});

// Tipo inferido para uso nos componentes
export type UserFormData = z.infer<typeof userFormSchema>;