// src/pages/AdminPage.tsx

import React, { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import { UserTable } from "@/components/UserTable";
import { UserForm } from "@/components/UserForm"; 
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userFormSchema } from "@/lib/validators";
import { z } from "zod";
import { formatCPF, formatFone, formatDateForDisplay } from "@/lib/formatters";
import { toast } from "sonner"; // <--- Importação adicionada

type UserFormData = z.infer<typeof userFormSchema>;

const AdminPage = () => {
    const [usuarios, setUsuarios] = useState<any[]>([]);
    const [editandoId, setEditandoId] = useState<string | null>(null);
    const [modoVisualizacao, setModoVisualizacao] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    // Removido o estado 'error' geral, pois os toasts cuidarão disso
    // const [error, setError] = useState(""); 
    const [isLoading, setIsLoading] = useState(true);

    const form = useForm<UserFormData>({
        resolver: zodResolver(userFormSchema),
        defaultValues: { /* ... valores padrão ... */ },
    });

    const fetchUsuarios = useCallback(async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await api.get("/api/users", { headers: { Authorization: `Bearer ${token}` } });
            const usuariosOrdenados = response.data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setUsuarios(usuariosOrdenados);
        } catch (err) {
            console.error("Erro ao buscar usuários:", err);
            // Substitui setError por toast.error
            toast.error("Falha ao carregar pacientes. Verifique a consola."); 
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchUsuarios(); }, [fetchUsuarios]);

    async function onSubmit(values: UserFormData) {
        const method = editandoId ? 'put' : 'post';
        const url = editandoId ? `/api/users/${editandoId}` : '/api/register/user';
        
        try {
            const token = localStorage.getItem("token");
            const dataToSend = { /* ... (lógica de transformação dos dados) ... */ };
            
            await api[method](url, dataToSend, { headers: { Authorization: `Bearer ${token}` } });

            // Substitui alert por toast.success
            toast.success(`Paciente ${editandoId ? 'atualizado' : 'cadastrado'} com sucesso!`);
            handleVoltar();
            await fetchUsuarios();

        } catch(err: any) {
            console.error("Erro ao salvar:", err);
            const errorMessage = err.response?.data?.message || "Ocorreu um erro ao salvar.";
            // Substitui setError por toast.error
            toast.error(errorMessage); 

            // Mantém a lógica para erros de campo específicos
            if (err.response?.data?.errors) {
                 Object.entries(err.response.data.errors).forEach(([fieldName, message]) => {
                    form.setError(fieldName as keyof UserFormData, { type: 'manual', message: message as string });
                });
            }
        }
    }

    const handleEdit = (usuario: any) => { 
        setEditandoId(usuario._id);
        setModoVisualizacao(true);
        form.reset({ /* ... (preenchimento dos dados) ... */ }); 
        form.clearErrors(); // Limpa erros de validação anteriores
    };
    
    const handleDelete = async (id: string) => {
        if (window.confirm("Tem certeza que deseja excluir este paciente?")) { // confirm ainda é útil aqui
            try {
                const token = localStorage.getItem("token");
                await api.delete(`/api/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
                // Substitui alert por toast.success
                toast.success("Paciente excluído com sucesso!"); 
                fetchUsuarios();
            } catch (err: any) {
                console.error("Erro ao excluir paciente:", err);
                // Substitui setError por toast.error
                toast.error(err.response?.data?.message || "Erro ao excluir paciente.");
            }
        }
    };
    
    const handleVoltar = () => {
        setEditandoId(null);
        setModoVisualizacao(false);
        form.reset();
        form.clearErrors(); // Limpa erros ao voltar
    };

    // --- LÓGICA PARA PROCEDIMENTOS COM TOASTS ---
    const handleAddProcedure = async (procedureFormData: FormData) => {
        if (!editandoId) return;
        try {
            const token = localStorage.getItem("token");
            const response = await api.put(`/api/users/${editandoId}/procedimento`, procedureFormData, { headers: { Authorization: `Bearer ${token}` } });
            const currentProcedures = form.getValues('historicoProcedimentos') || [];
            form.setValue('historicoProcedimentos', [...currentProcedures, response.data.procedimento]);
            toast.success("Procedimento adicionado com sucesso!"); // Toast de sucesso
        } catch (err: any) {
            console.error("Erro ao adicionar procedimento:", err);
            toast.error(err.response?.data?.message || "Falha ao adicionar procedimento."); // Toast de erro
        }
    };

    const handleUpdateProcedure = async (procedureId: string, procedureFormData: FormData) => {
        if (!editandoId) return;
        try {
            const token = localStorage.getItem("token");
            const response = await api.put(`/api/users/${editandoId}/procedimento/${procedureId}`, procedureFormData, { headers: { Authorization: `Bearer ${token}` } });
            const currentProcedures = form.getValues('historicoProcedimentos') || [];
            form.setValue('historicoProcedimentos', currentProcedures.map(p => p._id === procedureId ? response.data.procedimento : p));
            toast.success("Procedimento atualizado com sucesso!"); // Toast de sucesso
        } catch (err: any) {
            console.error("Erro ao atualizar procedimento:", err);
            toast.error(err.response?.data?.message || "Falha ao atualizar procedimento."); // Toast de erro
        }
    };

    const handleDeleteProcedure = async (procedureId: string) => {
        if (!editandoId || !window.confirm("Tem certeza que deseja excluir este procedimento?")) return; // confirm ainda útil
        try {
            const token = localStorage.getItem("token");
            await api.delete(`/api/users/${editandoId}/procedimento/${procedureId}`, { headers: { Authorization: `Bearer ${token}` } });
            const currentProcedures = form.getValues('historicoProcedimentos') || [];
            form.setValue('historicoProcedimentos', currentProcedures.filter(p => p._id !== procedureId));
            toast.success("Procedimento excluído com sucesso!"); // Toast de sucesso
        } catch (err: any) {
            console.error("Erro ao excluir procedimento:", err);
            toast.error(err.response?.data?.message || "Falha ao excluir procedimento."); // Toast de erro
        }
    };
    
    const filteredUsuarios = usuarios.filter(usuario => { /* ... */ });

    return (
        <div className="container mx-auto p-4 md:p-8">
            {/* Removemos a exibição do 'error' geral daqui */}
            {modoVisualizacao ? (
                <div>
                    <Button onClick={handleVoltar} variant="outline" className="mb-4">
                        &larr; Voltar para a Lista
                    </Button>
                    <UserForm
                        form={form} 
                        handleSubmit={form.handleSubmit(onSubmit)}
                        isEditing={!!editandoId}
                        onAddProcedure={handleAddProcedure}
                        onUpdateProcedure={handleUpdateProcedure}
                        onDeleteProcedure={handleDeleteProcedure}
                    />
                </div>
            ) : (
                <div>
                    <h1 className="text-3xl font-bold mb-4">Gerenciamento de Pacientes</h1>
                    <div className="flex justify-between items-center mb-4">
                        {/* ... (Barra de busca e botão Adicionar) ... */}
                    </div>
                    <UserTable
                        usuarios={filteredUsuarios}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        isLoading={isLoading}
                    />
                </div>
            )}
        </div>
    );
};

export default AdminPage;