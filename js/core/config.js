// ============================================
// CONFIGURACIÓN CENTRAL
// Constantes y configuración global de la aplicación
// ============================================

export const CONFIG = {
    // App info
    APP_NAME: 'Comisionamiento PWA',
    APP_VERSION: '2.0.0',
    APP_DESCRIPTION: 'Checklist de pre-comisionamiento y comisionamiento para instalaciones eléctricas industriales, instrumentación y control',
    
    // Rutas
    BASE_PATH: '/comisionamiento/',
    
    // Storage
    DB_NAME: 'ComisionamientoDB',
    DB_VERSION: 3,
    
    // Checklists
    CHECKLISTS: {
        ELECTRICAL: 'electrical',
        INSTRUMENTATION: 'instrumentation'
    },
    
    CHECKLIST_LABELS: {
        electrical: '⚡ Eléctrico',
        instrumentation: '📟 Instrumentación'
    },
    
    // Prioridades
    PRIORITIES: {
        HIGH: { value: 'high', label: 'Alta', color: '#ef4444', icon: '🔴', order: 1 },
        MEDIUM: { value: 'medium', label: 'Media', color: '#f59e0b', icon: '🟡', order: 2 },
        LOW: { value: 'low', label: 'Baja', color: '#10b981', icon: '🟢', order: 3 }
    },
    
    // Estados
    STATUS: {
        PENDING: { value: 'pending', label: 'Pendiente', color: '#ef4444', icon: '⏳', order: 1 },
        IN_PROGRESS: { value: 'in-progress', label: 'En Proceso', color: '#f59e0b', icon: '🔄', order: 2 },
        RESOLVED: { value: 'resolved', label: 'Resuelto', color: '#10b981', icon: '✅', order: 3 }
    },
    
    // Mensajes
    MESSAGES: {
        // Success
        SAVED: '✅ Guardado correctamente',
        DELETED: '🗑️ Eliminado correctamente',
        UPDATED: '📝 Actualizado correctamente',
        EXPORTED: '📄 Exportado correctamente',
        SYNCED: '🔄 Sincronizado correctamente',
        
        // Errors
        ERROR: '❌ Ocurrió un error',
        ERROR_SAVE: '❌ Error al guardar',
        ERROR_DELETE: '❌ Error al eliminar',
        ERROR_LOAD: '❌ Error al cargar datos',
        ERROR_EXPORT: '❌ Error al exportar',
        NO_INTERNET: '🌐 Sin conexión a internet. Los datos se guardarán localmente.',
        
        // Info
        LOADING: '⏳ Cargando...',
        NO_DATA: '📭 No hay datos disponibles',
        CONFIRM_DELETE: '⚠️ ¿Estás seguro de eliminar este elemento? Esta acción no se puede deshacer.',
        CONFIRM_DELETE_MULTIPLE: '⚠️ ¿Estás seguro de eliminar los elementos seleccionados?',
        
        // Checklist
        ITEM_COMPLETED: '✓ Item completado',
        ITEM_UNCOMPLETED: '◯ Item marcado como pendiente',
        ALL_COMPLETED: '🎉 ¡Felicidades! Has completado todos los items',
        
        // Punchlist
        OBSERVATION_ADDED: '➕ Observación agregada',
        OBSERVATION_UPDATED: '✏️ Observación actualizada',
        OBSERVATION_DELETED: '🗑️ Observación eliminada'
    },
    
    // Breakpoints
    BREAKPOINTS: {
        MOBILE: 768,
        TABLET: 1024,
        DESKTOP: 1280,
        WIDE: 1440
    },
    
    // Timeouts (ms)
    TIMEOUTS: {
        NOTIFICATION: 3000,
        DEBOUNCE: 300,
        THROTTLE: 100,
        SYNC: 5000
    },
    
    // Export formats
    EXPORT_FORMATS: {
        PDF: 'pdf',
        EXCEL: 'excel',
        CSV: 'csv',
        JSON: 'json'
    },
    
    // Theme
    THEMES: {
        LIGHT: 'light',
        DARK: 'dark'
    }
};

// Helper: Obtener ruta absoluta
export function getPath(relativePath) {
    const cleanPath = relativePath.replace(/^\//, '');
    return `${CONFIG.BASE_PATH}${cleanPath}`;
}

// Helper: Obtener prioridad por valor
export function getPriority(value) {
    return CONFIG.PRIORITIES[value?.toUpperCase()] || CONFIG.PRIORITIES.MEDIUM;
}

// Helper: Obtener estado por valor
export function getStatus(value) {
    return CONFIG.STATUS[value?.toUpperCase()] || CONFIG.STATUS.PENDING;
}

// Helper: Obtener label de checklist
export function getChecklistLabel(category) {
    return CONFIG.CHECKLIST_LABELS[category] || category;
}

// Helper: Verificar si es móvil
export function isMobile() {
    return window.innerWidth <= CONFIG.BREAKPOINTS.MOBILE;
}

// Helper: Verificar si es tablet
export function isTablet() {
    return window.innerWidth > CONFIG.BREAKPOINTS.MOBILE && 
           window.innerWidth <= CONFIG.BREAKPOINTS.TABLET;
}

// Helper: Verificar si es desktop
export function isDesktop() {
    return window.innerWidth > CONFIG.BREAKPOINTS.TABLET;
}

export default CONFIG;
