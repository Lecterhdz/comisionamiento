// Validaciones profesionales
export const validators = {
    // No vacío
    required: (value) => {
        if (!value && value !== 0) return 'Este campo es requerido';
        if (typeof value === 'string' && value.trim() === '') return 'Este campo es requerido';
        return null;
    },
    
    // Mínima longitud
    minLength: (min) => (value) => {
        if (!value) return null;
        if (value.length < min) return `Mínimo ${min} caracteres`;
        return null;
    },
    
    // Máxima longitud
    maxLength: (max) => (value) => {
        if (!value) return null;
        if (value.length > max) return `Máximo ${max} caracteres`;
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
    
    // Rango
    range: (min, max) => (value) => {
        if (!value && value !== 0) return null;
        const num = Number(value);
        if (isNaN(num)) return 'Debe ser un número';
        if (num < min) return `Mínimo ${min}`;
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
    }
};

// Validar objeto completo
export function validate(obj, rules) {
    const errors = {};
    
    for (const [field, fieldRules] of Object.entries(rules)) {
        const value = obj[field];
        for (const rule of fieldRules) {
            const error = rule(value);
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
