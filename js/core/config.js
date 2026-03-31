// Configuración central de la aplicación
export const CONFIG = {
    // App
    APP_NAME: 'Comisionamiento PWA',
    APP_VERSION: '1.0.0',
    
    // Rutas base
    BASE_PATH: '/comisionamiento/',
    
    // Storage
    DB_NAME: 'ComisionamientoDB',
    DB_VERSION: 2,
    
    // Checklists
    CHECKLISTS: {
        ELECTRICAL: 'electrical',
        INSTRUMENTATION: 'instrumentation'
    },
    
    // Prioridades
    PRIORITIES: {
        HIGH: { value: 'high', label: 'Alta', color: '#ef4444', icon: '🔴' },
        MEDIUM: { value: 'medium', label: 'Media', color: '#f59e0b', icon: '🟡' },
        LOW: { value: 'low', label: 'Baja', color: '#10b981', icon: '🟢' }
    },
    
    // Estados
    STATUS: {
        PENDING: { value: 'pending', label: 'Pendiente', color: '#ef4444' },
        IN_PROGRESS: { value: 'in-progress', label: 'En Proceso', color: '#f59e0b' },
        RESOLVED: { value: 'resolved', label: 'Resuelto', color: '#10b981' }
    },
    
    // Mensajes
    MESSAGES: {
        SAVED: 'Guardado correctamente',
        DELETED: 'Eliminado correctamente',
        ERROR: 'Ocurrió un error',
        CONFIRM_DELETE: '¿Estás seguro de eliminar este elemento?',
        NO_INTERNET: 'Sin conexión a internet. Los datos se guardarán localmente.'
    },
    
    // Breakpoints (para responsive)
    BREAKPOINTS: {
        MOBILE: 768,
        TABLET: 1024,
        DESKTOP: 1280
    }
};

// Función para obtener ruta absoluta
export function getPath(relativePath) {
    return `${CONFIG.BASE_PATH}${relativePath.replace(/^\//, '')}`;
}

// Función para obtener prioridad por valor
export function getPriority(value) {
    return CONFIG.PRIORITIES[value.toUpperCase()] || CONFIG.PRIORITIES.MEDIUM;
}

// Función para obtener estado por valor
export function getStatus(value) {
    return CONFIG.STATUS[value.toUpperCase()] || CONFIG.STATUS.PENDING;
}
