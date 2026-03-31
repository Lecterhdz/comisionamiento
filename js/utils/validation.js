// ============================================
// VALIDATION UTILITIES
// Validaciones profesionales para formularios
// ============================================

// Validadores individuales
export const validators = {
    // Campo requerido
    required: (value) => {
        if (value === undefined || value === null) return 'Este campo es requerido';
        if (typeof value === 'string' && value.trim() === '') return 'Este campo es requerido';
        if (Array.isArray(value) && value.length === 0) return 'Este campo es requerido';
        return null;
    },
    
    // Mínima longitud
    minLength: (min) => (value) => {
        if (!value) return null;
        const length = typeof value === 'string' ? value.length : String(value).length;
        if (length < min) return `Mínimo ${min} caracteres`;
        return null;
    },
    
    // Máxima longitud
    maxLength: (max) => (value) => {
        if (!value) return null;
        const length = typeof value === 'string' ? value.length : String(value).length;
        if (length > max) return `Máximo ${max} caracteres`;
        return null;
    },
    
    // Rango de longitud
    length: (min, max) => (value) => {
        if (!value) return null;
        const length = typeof value === 'string' ? value.length : String(value).length;
        if (length < min) return `Mínimo ${min} caracteres`;
        if (length > max) return `Máximo ${max} caracteres`;
        return null;
    },
    
    // Email
    email: (value) => {
        if (!value) return null;
        const regex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
        if (!regex.test(value)) return 'Email inválido';
        return null;
    },
    
    // Número
    number: (value) => {
        if (!value && value !== 0) return null;
        if (isNaN(Number(value))) return 'Debe ser un número válido';
        return null;
    },
    
    // Entero
    integer: (value) => {
        if (!value && value !== 0) return null;
        const num = Number(value);
        if (isNaN(num)) return 'Debe ser un número entero';
        if (!Number.isInteger(num)) return 'Debe ser un número entero';
        return null;
    },
    
    // Rango numérico
    range: (min, max) => (value) => {
        if (!value && value !== 0) return null;
        const num = Number(value);
        if (isNaN(num)) return 'Debe ser un número';
        if (num < min) return `Mínimo ${min}`;
        if (num > max) return `Máximo ${max}`;
        return null;
    },
    
    // Mínimo numérico
    min: (min) => (value) => {
        if (!value && value !== 0) return null;
        const num = Number(value);
        if (isNaN(num)) return 'Debe ser un número';
        if (num < min) return `Mínimo ${min}`;
        return null;
    },
    
    // Máximo numérico
    max: (max) => (value) => {
        if (!value && value !== 0) return null;
        const num = Number(value);
        if (isNaN(num)) return 'Debe ser un número';
        if (num > max) return `Máximo ${max}`;
        return null;
    },
    
    // URL
    url: (value) => {
        if (!value) return null;
        try {
            new URL(value);
            return null;
        } catch {
            return 'URL inválida';
        }
    },
    
    // Teléfono (10 dígitos)
    phone: (value) => {
        if (!value) return null;
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.length !== 10) return 'Teléfono debe tener 10 dígitos';
        return null;
    },
    
    // RFC (México)
    rfc: (value) => {
        if (!value) return null;
        const rfcRegex = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/;
        if (!rfcRegex.test(value.toUpperCase())) return 'RFC inválido';
        return null;
    },
    
    // CURP (México)
    curp: (value) => {
        if (!value) return null;
        const curpRegex = /^[A-Z]{4}\d{6}[HM][A-Z]{5}[0-9A-Z]{2}$/;
        if (!curpRegex.test(value.toUpperCase())) return 'CURP inválida';
        return null;
    },
    
    // Código postal (México)
    postalCode: (value) => {
        if (!value) return null;
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.length !== 5) return 'Código postal debe tener 5 dígitos';
        return null;
    },
    
    // Fecha
    date: (value) => {
        if (!value) return null;
        const d = new Date(value);
        if (isNaN(d.getTime())) return 'Fecha inválida';
        return null;
    },
    
    // Fecha futura
    futureDate: (value) => {
        if (!value) return null;
        const d = new Date(value);
        if (isNaN(d.getTime())) return 'Fecha inválida';
        if (d <= new Date()) return 'La fecha debe ser futura';
        return null;
    },
    
    // Fecha pasada
    pastDate: (value) => {
        if (!value) return null;
        const d = new Date(value);
        if (isNaN(d.getTime())) return 'Fecha inválida';
        if (d >= new Date()) return 'La fecha debe ser pasada';
        return null;
    },
    
    // Contraseña fuerte
    strongPassword: (value) => {
        if (!value) return null;
        const hasMinLength = value.length >= 8;
        const hasUpperCase = /[A-Z]/.test(value);
        const hasLowerCase = /[a-z]/.test(value);
        const hasNumbers = /\d/.test(value);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
        
        if (!hasMinLength) return 'Mínimo 8 caracteres';
        if (!hasUpperCase) return 'Al menos una mayúscula';
        if (!hasLowerCase) return 'Al menos una minúscula';
        if (!hasNumbers) return 'Al menos un número';
        if (!hasSpecialChar) return 'Al menos un carácter especial';
        return null;
    },
    
    // Confirmar contraseña
    confirmPassword: (password) => (value) => {
        if (value !== password) return 'Las contraseñas no coinciden';
        return null;
    }
};

// Validar objeto completo con reglas
export function validate(obj, rules) {
    const errors = {};
    
    for (const [field, fieldRules] of Object.entries(rules)) {
        const value = obj[field];
        
        for (const rule of fieldRules) {
            let error;
            
            if (typeof rule === 'function') {
                error = rule(value);
            } else if (typeof rule === 'string') {
                // Regla predefinida
                if (validators[rule]) {
                    error = validators[rule](value);
                }
            }
            
            if (error) {
                errors[field] = error;
                break;
            }
        }
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

// Validar campo individual
export function validateField(value, rules) {
    for (const rule of rules) {
        let error;
        
        if (typeof rule === 'function') {
            error = rule(value);
        } else if (typeof rule === 'string' && validators[rule]) {
            error = validators[rule](value);
        }
        
        if (error) {
            return { isValid: false, error };
        }
    }
    
    return { isValid: true, error: null };
}

// Sanitizar entrada
export function sanitize(value, type = 'string') {
    if (value === undefined || value === null) return '';
    
    switch (type) {
        case 'string':
            return String(value).trim().replace(/[<>]/g, '');
        case 'number':
            const num = Number(value);
            return isNaN(num) ? 0 : num;
        case 'email':
            return String(value).trim().toLowerCase();
        case 'phone':
            return String(value).replace(/\D/g, '');
        case 'boolean':
            return Boolean(value);
        default:
            return value;
    }
}

export default {
    validators,
    validate,
    validateField,
    sanitize
};
