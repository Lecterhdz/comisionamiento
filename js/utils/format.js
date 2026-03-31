// ============================================
// FORMAT UTILITIES
// Funciones de formato para datos
// ============================================

import { CONFIG } from '../core/config.js';

export const formatters = {
    // Fecha
    date: (date, format = 'short') => {
        if (!date) return '';
        
        let d;
        try {
            d = new Date(date);
            if (isNaN(d.getTime())) return '';
        } catch {
            return '';
        }
        
        const formats = {
            short: d.toLocaleDateString('es-MX', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            }),
            medium: d.toLocaleDateString('es-MX', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }),
            long: d.toLocaleDateString('es-MX', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            datetime: d.toLocaleString('es-MX', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            }),
            time: d.toLocaleTimeString('es-MX', {
                hour: '2-digit',
                minute: '2-digit'
            }),
            timeSeconds: d.toLocaleTimeString('es-MX', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            }),
            iso: d.toISOString(),
            timestamp: d.getTime()
        };
        
        return formats[format] || formats.short;
    },
    
    // Porcentaje
    percent: (value, decimals = 0) => {
        const num = Number(value);
        if (isNaN(num)) return '0%';
        return `${num.toFixed(decimals)}%`;
    },
    
    // Número con separadores de miles
    number: (value, decimals = 0, compact = false) => {
        const num = Number(value);
        if (isNaN(num)) return '0';
        
        if (compact && Math.abs(num) >= 1000000) {
            return `${(num / 1000000).toFixed(1)}M`;
        }
        if (compact && Math.abs(num) >= 1000) {
            return `${(num / 1000).toFixed(0)}k`;
        }
        
        return num.toLocaleString('es-MX', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    },
    
    // Moneda
    currency: (value, currency = 'MXN', decimals = 2) => {
        const num = Number(value);
        if (isNaN(num)) return '$0.00';
        
        return num.toLocaleString('es-MX', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    },
    
    // Prioridad a texto
    priority: (priority) => {
        const priorityConfig = CONFIG.PRIORITIES[priority?.toUpperCase()];
        if (priorityConfig) {
            return `${priorityConfig.icon} ${priorityConfig.label}`;
        }
        return priority || '-';
    },
    
    // Prioridad solo texto
    priorityText: (priority) => {
        const priorityConfig = CONFIG.PRIORITIES[priority?.toUpperCase()];
        return priorityConfig?.label || priority || '-';
    },
    
    // Estado a texto
    status: (status) => {
        const statusConfig = CONFIG.STATUS[status?.toUpperCase()];
        if (statusConfig) {
            return `${statusConfig.icon} ${statusConfig.label}`;
        }
        return status || '-';
    },
    
    // Estado solo texto
    statusText: (status) => {
        const statusConfig = CONFIG.STATUS[status?.toUpperCase()];
        return statusConfig?.label || status || '-';
    },
    
    // Truncar texto
    truncate: (text, maxLength = 100, suffix = '...') => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength - suffix.length) + suffix;
    },
    
    // Capitalizar
    capitalize: (text) => {
        if (!text) return '';
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    },
    
    // Capitalizar cada palabra
    capitalizeWords: (text) => {
        if (!text) return '';
        return text.split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
    },
    
    // Slugify
    slugify: (text) => {
        if (!text) return '';
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    },
    
    // Tiempo relativo (hace X tiempo)
    relativeTime: (date) => {
        if (!date) return '';
        
        const d = new Date(date);
        if (isNaN(d.getTime())) return '';
        
        const now = new Date();
        const diff = now - d;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const weeks = Math.floor(days / 7);
        const months = Math.floor(days / 30);
        const years = Math.floor(days / 365);
        
        if (years > 0) return `hace ${years} año${years !== 1 ? 's' : ''}`;
        if (months > 0) return `hace ${months} mes${months !== 1 ? 'es' : ''}`;
        if (weeks > 0) return `hace ${weeks} semana${weeks !== 1 ? 's' : ''}`;
        if (days > 0) return `hace ${days} día${days !== 1 ? 's' : ''}`;
        if (hours > 0) return `hace ${hours} hora${hours !== 1 ? 's' : ''}`;
        if (minutes > 0) return `hace ${minutes} minuto${minutes !== 1 ? 's' : ''}`;
        if (seconds > 10) return `hace ${seconds} segundos`;
        return 'hace unos momentos';
    },
    
    // Bytes a formato legible
    bytes: (bytes, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
    },
    
    // Teléfono
    phone: (phone) => {
        if (!phone) return '';
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length === 10) {
            return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
        }
        return phone;
    },
    
    // RFC
    rfc: (rfc) => {
        if (!rfc) return '';
        return rfc.toUpperCase();
    },
    
    // JSON pretty
    json: (obj, spaces = 2) => {
        try {
            return JSON.stringify(obj, null, spaces);
        } catch {
            return String(obj);
        }
    }
};

export default formatters;
