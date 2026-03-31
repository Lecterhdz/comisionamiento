// Formateadores de datos
export const formatters = {
    // Fecha
    date: (date, format = 'short') => {
        if (!date) return '';
        const d = new Date(date);
        
        const formats = {
            short: d.toLocaleDateString('es-MX'),
            long: d.toLocaleDateString('es-MX', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            }),
            datetime: d.toLocaleString('es-MX'),
            time: d.toLocaleTimeString('es-MX')
        };
        
        return formats[format] || formats.short;
    },
    
    // Porcentaje
    percent: (value, decimals = 0) => {
        return `${Number(value).toFixed(decimals)}%`;
    },
    
    // Número con separadores de miles
    number: (value, decimals = 0) => {
        return Number(value).toLocaleString('es-MX', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    },
    
    // Prioridad a texto
    priority: (priority) => {
        const labels = {
            high: 'Alta',
            medium: 'Media',
            low: 'Baja'
        };
        return labels[priority] || priority;
    },
    
    // Estado a texto
    status: (status) => {
        const labels = {
            pending: 'Pendiente',
            'in-progress': 'En Proceso',
            resolved: 'Resuelto'
        };
        return labels[status] || status;
    },
    
    // Truncar texto
    truncate: (text, maxLength = 100) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    },
    
    // Capitalizar
    capitalize: (text) => {
        if (!text) return '';
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    }
};
