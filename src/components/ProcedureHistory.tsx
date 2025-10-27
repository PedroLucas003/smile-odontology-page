// src/components/ProcedureHistory.tsx

import React, { useState } from 'react';
import api from '@/lib/api'; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatDateForDisplay, formatValueForDisplay, formatDateInput } from '@/lib/formatters';
import { PlusCircle, Edit, Trash2, Paperclip } from 'lucide-react';

interface Procedure {
    _id: string;
    dataProcedimento: string;
    procedimento: string;
    denteFace: string;
    valor: number;
    modalidadePagamento: string;
    profissional: string;
    arquivos?: string[];
}

interface ProcedureHistoryProps {
    procedures: Procedure[];
    onAdd: (formData: FormData) => void;
    // --- CORREÇÃO AQUI ---
    onUpdate: (procedureId: string, formData: FormData) => void; // Espera ID e FormData
    onDelete: (procedureId: string) => void;
}

const ProcedureForm = ({ procedure, onSave, closeModal }: { procedure?: Procedure | null, onSave: Function, closeModal: Function }) => {
    
    const [formData, setFormData] = useState({
        procedimento: procedure?.procedimento || '',
        denteFace: procedure?.denteFace || '',
        valor: procedure?.valor || 0,
        modalidadePagamento: procedure?.modalidadePagamento || '',
        profissional: procedure?.profissional || '',
        dataProcedimento: procedure ? formatDateForDisplay(procedure.dataProcedimento) : '',
    });
    const [arquivosParaUpload, setArquivosParaUpload] = useState<FileList | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setArquivosParaUpload(e.target.files);
    };

    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/\D/g, '');
        const numericValue = rawValue ? parseFloat(rawValue) / 100 : 0;
        setFormData(prev => ({ ...prev, valor: numericValue }));
    };

    const handleSave = () => {
        const data = new FormData();
        data.append('procedimento', formData.procedimento);
        data.append('denteFace', formData.denteFace);
        data.append('valor', formData.valor.toString());
        data.append('modalidadePagamento', formData.modalidadePagamento);
        data.append('profissional', formData.profissional);
        
        if (formData.dataProcedimento && formData.dataProcedimento.length === 10) {
            const [day, month, year] = formData.dataProcedimento.split('/');
            const isoDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day)).toISOString();
            data.append('dataProcedimento', isoDate);
        }
        
        if (arquivosParaUpload) {
            Array.from(arquivosParaUpload).forEach(file => {
                data.append('arquivos', file);
            });
        }
        
        if (procedure?._id) {
             onSave(procedure._id, data); // Passa ID e FormData
        } else {
             onSave(data); // Passa só FormData para adicionar
        }
        closeModal();
    };

    return (
        <>
            <DialogHeader><DialogTitle>{procedure ? 'Editar' : 'Adicionar'} Procedimento</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="procedimento" className="text-right">Procedimento</Label>
                    <Input id="procedimento" value={formData.procedimento} onChange={(e) => setFormData(p => ({...p, procedimento: e.target.value}))} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="denteFace" className="text-right">Dente/Face</Label>
                    <Input id="denteFace" value={formData.denteFace} onChange={(e) => setFormData(p => ({...p, denteFace: e.target.value}))} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="dataProcedimento" className="text-right">Data</Label>
                    <Input id="dataProcedimento" value={formData.dataProcedimento} onChange={(e) => setFormData(p => ({...p, dataProcedimento: formatDateInput(e.target.value)}))} placeholder="DD/MM/AAAA" maxLength={10} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="valor" className="text-right">Valor</Label>
                    <Input id="valor" value={formatValueForDisplay(formData.valor)} onChange={handleValueChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Pagamento</Label>
                    <Select onValueChange={(value) => setFormData(p => ({...p, modalidadePagamento: value}))} value={formData.modalidadePagamento}>
                        <SelectTrigger className="col-span-3"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                            <SelectItem value="Cartão de Crédito">Cartão de Crédito</SelectItem>
                            <SelectItem value="Cartão de Débito">Cartão de Débito</SelectItem>
                            <SelectItem value="PIX">PIX</SelectItem>
                            <SelectItem value="Convênio">Convênio</SelectItem>
                            <SelectItem value="Boleto">Boleto</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="profissional" className="text-right">Profissional</Label>
                    <Input id="profissional" value={formData.profissional} onChange={(e) => setFormData(p => ({...p, profissional: e.target.value}))} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="arquivos" className="text-right">Anexos</Label>
                    <Input id="arquivos" type="file" multiple onChange={handleFileChange} className="col-span-3" />
                </div>
                {procedure?.arquivos && procedure.arquivos.length > 0 && (
                    <div className="col-span-4 pl-16 text-sm">
                        <p className="font-medium text-right">Arquivos existentes:</p>
                        <div className="flex flex-col items-end gap-1 mt-1">
                            {procedure.arquivos.map(file => (
                                <a key={file} href={`${api.defaults.baseURL}/uploads/${file}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{file}</a>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => closeModal()}>Cancelar</Button>
                <Button onClick={handleSave}>Salvar</Button>
            </DialogFooter>
        </>
    );
}

export const ProcedureHistory: React.FC<ProcedureHistoryProps> = ({ procedures, onAdd, onUpdate, onDelete }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProcedure, setEditingProcedure] = useState<Procedure | null>(null);

    const openModalToAdd = () => { setEditingProcedure(null); setIsDialogOpen(true); };
    const openModalToEdit = (procedure: Procedure) => { setEditingProcedure(procedure); setIsDialogOpen(true); };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Histórico de Procedimentos</CardTitle>
                    <CardDescription>Visualize, adicione ou edite os procedimentos do paciente.</CardDescription>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                         <Button onClick={openModalToAdd}><PlusCircle className="mr-2 h-4 w-4"/> Adicionar</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <ProcedureForm 
                            procedure={editingProcedure}
                            // Passa a função correta para salvar (onUpdate espera ID e FormData)
                            onSave={editingProcedure ? onUpdate : onAdd} 
                            closeModal={() => setIsDialogOpen(false)} 
                        />
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                {procedures && procedures.length > 0 ? (
                    <div className="space-y-4">
                        {procedures.map(proc => (
                            <div key={proc._id} className="flex items-start justify-between p-3 border rounded-lg">
                                <div className="text-sm space-y-1">
                                    <p className="font-semibold">{proc.procedimento}</p>
                                    <p className="text-muted-foreground">
                                        {formatDateForDisplay(proc.dataProcedimento)} - {formatValueForDisplay(proc.valor)}
                                    </p>
                                    {proc.arquivos && proc.arquivos.length > 0 && (
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Paperclip className="h-3 w-3" />
                                            <span>{proc.arquivos.length} anexo(s)</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="icon" onClick={() => openModalToEdit(proc)}><Edit className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => onDelete(proc._id)}><Trash2 className="h-4 w-4" /></Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-center text-muted-foreground py-4">Nenhum procedimento cadastrado.</p>
                )}
            </CardContent>
        </Card>
    );
};