// Event Bus para comunicación desacoplada entre componentes
class EventBus {
    constructor() {
        this.events = {};
    }
    
    // Suscribirse a un evento
    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
        
        // Retornar función para cancelar suscripción
        return () => this.off(event, callback);
    }
    
    // Cancelar suscripción
    off(event, callback) {
        if (!this.events[event]) return;
        this.events[event] = this.events[event].filter(cb => cb !== callback);
    }
    
    // Emitir evento
    emit(event, data) {
        if (!this.events[event]) return;
        this.events[event].forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error(`Error en evento ${event}:`, error);
            }
        });
    }
    
    // Emitir evento asíncrono
    async emitAsync(event, data) {
        if (!this.events[event]) return;
        const promises = this.events[event].map(callback => {
            try {
                return Promise.resolve(callback(data));
            } catch (error) {
                console.error(`Error en evento ${event}:`, error);
                return Promise.reject(error);
            }
        });
        return Promise.all(promises);
    }
    
    // Limpiar todos los eventos
    clear() {
        this.events = {};
    }
}

// Singleton
export const eventBus = new EventBus();

// Eventos predefinidos
export const EVENTS = {
    // Checklist
    CHECKLIST_ITEM_CHANGED: 'checklist:item-changed',
    CHECKLIST_COMPLETED: 'checklist:completed',
    
    // Punchlist
    PUNCHLIST_ADDED: 'punchlist:added',
    PUNCHLIST_UPDATED: 'punchlist:updated',
    PUNCHLIST_DELETED: 'punchlist:deleted',
    
    // Theme
    THEME_CHANGED: 'theme:changed',
    
    // Storage
    STORAGE_READY: 'storage:ready',
    STORAGE_ERROR: 'storage:error',
    
    // Notifications
    NOTIFICATION_SHOW: 'notification:show'
};
