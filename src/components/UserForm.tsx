// src/components/UserForm.tsx

import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from 'react-hook-form';
import { ProcedureHistory } from './ProcedureHistory'; 
import { formatCPF, formatFone, formatDateInput } from '@/lib/formatters';

interface UserFormProps {
  form: UseFormReturn<any>;
  handleSubmit: (e: React.FormEvent) => void;
  isEditing: boolean;
  onAddProcedure: (formData: FormData) => void; 
  // --- CORREÇÃO AQUI ---
  onUpdateProcedure: (id: string, formData: FormData) => void; // Espera ID e FormData
  onDeleteProcedure: (id: string) => void;
}

export const UserForm: React.FC<UserFormProps> = ({ 
    form, 
    handleSubmit, 
    isEditing,
    onAddProcedure,
    onUpdateProcedure,
    onDeleteProcedure 
}) => {
  return (
    <Form {...form}> 
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Card: Dados Pessoais */}
        <Card>
          <CardHeader>
            <CardTitle>Dados Pessoais</CardTitle>
            <CardDescription>Informações básicas do paciente.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField control={form.control} name="nomeCompleto" render={({ field }) => ( <FormItem><FormLabel>Nome Completo</FormLabel><FormControl><Input placeholder="Nome completo do paciente" {...field} /></FormControl><FormMessage /></FormItem> )} />
            <FormField control={form.control} name="cpf" render={({ field }) => ( <FormItem><FormLabel>CPF</FormLabel><FormControl><Input placeholder="000.000.000-00" {...field} onChange={(e) => field.onChange(formatCPF(e.target.value))} maxLength={14}/></FormControl><FormMessage /></FormItem> )} />
            <FormField control={form.control} name="telefone" render={({ field }) => ( <FormItem><FormLabel>Telefone</FormLabel><FormControl><Input placeholder="(00) 00000-0000" {...field} onChange={(e) => field.onChange(formatFone(e.target.value))} maxLength={15}/></FormControl><FormMessage /></FormItem> )} />
            <FormField control={form.control} name="dataNascimento" render={({ field }) => ( <FormItem><FormLabel>Data de Nascimento</FormLabel><FormControl><Input placeholder="DD/MM/AAAA" {...field} onChange={(e) => field.onChange(formatDateInput(e.target.value))} maxLength={10}/></FormControl><FormMessage /></FormItem> )} />
            <FormField control={form.control} name="endereco" render={({ field }) => ( <FormItem className="md:col-span-2"><FormLabel>Endereço</FormLabel><FormControl><Textarea placeholder="Endereço completo..." {...field} /></FormControl><FormMessage /></FormItem> )} />
            {isEditing && (
              <>
                <FormField control={form.control} name="password" render={({ field }) => ( <FormItem> <FormLabel>Nova Senha (opcional)</FormLabel> <FormControl> <Input type="password" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
                <FormField control={form.control} name="confirmPassword" render={({ field }) => ( <FormItem> <FormLabel>Confirmar Nova Senha</FormLabel> <FormControl> <Input type="password" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
              </>
            )}
          </CardContent>
        </Card>

        {/* Card: Anamnese e Histórico de Saúde */}
        <Card>
            <CardHeader><CardTitle>Anamnese e Histórico de Saúde</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="detalhesDoencas" render={({ field }) => (<FormItem><FormLabel>Possui alguma doença? Qual?</FormLabel><FormControl><Textarea placeholder="Descreva..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="quaisRemedios" render={({ field }) => (<FormItem><FormLabel>Toma algum remédio? Qual?</FormLabel><FormControl><Textarea placeholder="Descreva..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="quaisMedicamentos" render={({ field }) => (<FormItem><FormLabel>Alergia a medicamentos? Qual?</FormLabel><FormControl><Textarea placeholder="Descreva..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="quaisAnestesias" render={({ field }) => (<FormItem><FormLabel>Alergia a anestesias? Qual?</FormLabel><FormControl><Textarea placeholder="Descreva..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="historicoCirurgia" render={({ field }) => (<FormItem><FormLabel>Já fez alguma cirurgia? Qual?</FormLabel><FormControl><Textarea placeholder="Descreva..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="historicoOdontologico" render={({ field }) => (<FormItem><FormLabel>Histórico odontológico relevante</FormLabel><FormControl><Textarea placeholder="Descreva..." {...field} /></FormControl><FormMessage /></FormItem>)} />
            </CardContent>
        </Card>

        {/* Card: Hábitos e Outras Informações */}
        <Card>
            <CardHeader><CardTitle>Hábitos e Outras Informações</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 <FormField control={form.control} name="frequenciaFumo" render={({ field }) => ( <FormItem><FormLabel>Frequência de fumo</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger></FormControl><SelectContent><SelectItem value="Nunca">Nunca</SelectItem><SelectItem value="Ocasionalmente">Ocasionalmente</SelectItem><SelectItem value="Frequentemente">Frequentemente</SelectItem><SelectItem value="Diariamente">Diariamente</SelectItem></SelectContent></Select><FormMessage /></FormItem> )} />
                 <FormField control={form.control} name="frequenciaAlcool" render={({ field }) => ( <FormItem><FormLabel>Frequência de álcool</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger></FormControl><SelectContent><SelectItem value="Nunca">Nunca</SelectItem><SelectItem value="Ocasionalmente">Ocasionalmente</SelectItem><SelectItem value="Frequentemente">Frequentemente</SelectItem><SelectItem value="Diariamente">Diariamente</SelectItem></SelectContent></Select><FormMessage /></FormItem> )} />
                 <FormField control={form.control} name="respiracao" render={({ field }) => (<FormItem><FormLabel>Respiração</FormLabel><FormControl><Input placeholder="Normal, pela boca..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name="peso" render={({ field }) => (<FormItem><FormLabel>Peso (kg)</FormLabel><FormControl><Input type="number" step="0.1" placeholder="Ex: 70.5" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </CardContent>
        </Card>

        {isEditing && (
            <ProcedureHistory 
                procedures={form.watch('historicoProcedimentos') || []}
                onAdd={onAddProcedure}
                onUpdate={onUpdateProcedure}
                onDelete={onDeleteProcedure}
            />
        )}
        
        <div className="flex justify-end">
            <Button type="submit" disabled={form.formState.isSubmitting}> 
                {form.formState.isSubmitting ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Cadastrar Paciente')}
            </Button>
        </div>
      </form>
    </Form>
  );
};