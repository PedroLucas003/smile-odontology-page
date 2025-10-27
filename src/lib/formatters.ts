// src/lib/formatters.ts

export function formatDateInput(value: string): string {
    let cleanedValue = value.replace(/\D/g, '');
  
    if (cleanedValue.length > 2) {
      const day = parseInt(cleanedValue.substring(0, 2), 10);
      if (day > 31) cleanedValue = '31' + cleanedValue.substring(2);
    }
  
    if (cleanedValue.length > 4) {
      const month = parseInt(cleanedValue.substring(2, 4), 10);
      if (month > 12) cleanedValue = cleanedValue.substring(0, 2) + '12' + cleanedValue.substring(4);
    }
  
    if (cleanedValue.length > 2) cleanedValue = cleanedValue.substring(0, 2) + '/' + cleanedValue.substring(2);
    if (cleanedValue.length > 5) cleanedValue = cleanedValue.substring(0, 5) + '/' + cleanedValue.substring(5, 9);
  
    return cleanedValue;
}
  
export function formatDateForDisplay(dateString: string | null | undefined): string {
    if (!dateString) return 'Data não informada';
    try {
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) return dateString;
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Data inválida';
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const year = date.getUTCFullYear();
        return `${day}/${month}/${year}`;
    } catch (e) {
        return 'Data inválida';
    }
}
  
export function convertValueToFloat(valor: string | number | null | undefined): number {
    if (!valor) return 0;
    if (typeof valor === 'number') return valor;
    return parseFloat(valor.toString().replace(/[^\d,]/g, '').replace(',', '.'));
}
  
export function formatValueForDisplay(valor: string | number | null | undefined): string {
    if (valor === null || valor === undefined || valor === '') return 'Valor não informado';
    const numericValue = convertValueToFloat(valor);
    return isNaN(numericValue) ? 'Valor inválido' :
      numericValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export const formatCPF = (value: string): string => {
    const cleanedValue = value.replace(/\D/g, "");
    if (cleanedValue.length <= 3) return cleanedValue;
    if (cleanedValue.length <= 6) return `${cleanedValue.slice(0, 3)}.${cleanedValue.slice(3)}`;
    if (cleanedValue.length <= 9) return `${cleanedValue.slice(0, 3)}.${cleanedValue.slice(3, 6)}.${cleanedValue.slice(6)}`;
    return `${cleanedValue.slice(0, 3)}.${cleanedValue.slice(3, 6)}.${cleanedValue.slice(6, 9)}-${cleanedValue.slice(9, 11)}`;
};
  
export const formatFone = (value: string): string => {
    const cleanedValue = value.replace(/\D/g, "");
    if (cleanedValue.length <= 2) return cleanedValue;
    if (cleanedValue.length <= 7) return `(${cleanedValue.slice(0, 2)}) ${cleanedValue.slice(2)}`;
    return `(${cleanedValue.slice(0, 2)}) ${cleanedValue.slice(2, 7)}-${cleanedValue.slice(7, 11)}`;
};