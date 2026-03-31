// ============================================
// EVENT BUS
// Sistema de comunicación desacoplada entre módulos
// ============================================

import { createLogger } from './logger.js';

const log = createLogger('EventBus');

class EventBusClass {
    constructor() {
        this.events = new Map();
        this.maxListeners = 10;
    }
    
    // Suscribirse a un evento
    on(event, callback, priority = 0) {
        if (!this.events.has(event)) {
            this.events.set(event, []);
        }
        
        const listeners = this.events.get(event);
        const listener = { callback, priority };
        
        listeners.push(listener);
        listeners.sort((a, b) => b.priority - a.priority);
        
        log.debug(`Evento registrado: ${event}`, { priority, totalListeners: listeners.length });
        
        // Retornar función para cancelar suscripción
        return () => this.off(event, callback);
    }
    
    // Suscripción única
    once(event, callback, priority = 0) {
        const wrapper = (...args) => {
            this.off(event, wrapper);
            callback(...args);
        };
        return this.on(event, wrapper, priority);
    }
    
    // Cancelar suscripción
    off(event, callback) {
        if (!this.events.has(event)) return false;
        
        const listeners = this.events.get(event);
        const initialLength = listeners.length;
        const filtered = listeners.filter(l => l.callback !== callback);
        
        if (filtered.length === 0) {
            this.events.delete(event);
        } else {
            this.events.set(event, filtered);
        }
        
        log.debug(`Evento cancelado: ${event}`, { removed: initialLength - filtered.length });
        return initialLength !== filtered.length;
    }
    
    // Emitir evento
    emit(event, data = {}) {
        if (!this.events.has(event)) {
            log.debug(`Evento emitido sin listeners: ${event}`);
            return false;
        }
        
        const listeners = this.events.get(event);
        const timestamp = Date.now();
        
        log.debug(`Evento emitido: ${event}`, { 
            listeners: listeners.length, 
            data,
            timestamp 
        });
        
        listeners.forEach(listener => {
            try {
                listener.callback({ ...data, event, timestamp });
            } catch (error) {
                log.error(`Error en evento ${event}:`, error);
                this.emit(EVENTS.ERROR, { 
                    source: event, 
                    error: error.message 
                });
            }
        });
        
        return true;
    }
    
    // Emitir evento asíncrono
    async emitAsync(event, data = {}) {
        if (!this.events.has(event)) return [];
        
        const listeners = this.events.get(event);
        const timestamp = Date.now();
        const results = [];
        
        log.debug(`Evento asíncrono: ${event}`, { listeners: listeners.length });
        
        for (const listener of listeners) {
            try {
                const result = await Promise.resolve(listener.callback({ ...data, event, timestamp }));
                results.push(result);
            } catch (error) {
                log.error(`Error en evento asíncrono ${event}:`, error);
                results.push({ error: error.message });
                this.emit(EVENTS.ERROR, { source: event, error: error.message });
            }
        }
        
        return results;
    }
    
    // Limpiar todos los eventos
    clear() {
        this.events.clear();
        log.info('EventBus limpiado');
    }
    
    // Obtener lista de eventos
    getEvents() {
        const events = {};
        for (const [event, listeners] of this.events) {
            events[event] = listeners.length;
        }
        return events;
    }
    
    // Verificar si hay suscriptores
    has(event) {
        return this.events.has(event) && this.events.get(event).length > 0;
    }
}

// Singleton
export const eventBus = new EventBusClass();

// ============================================
// EVENTOS PREDEFINIDOS
// ============================================

export const EVENTS = {
    // App lifecycle
    APP_READY: 'app:ready',
    APP_BEFORE_UNLOAD: 'app:before-unload',
    
    // Storage
    STORAGE_READY: 'storage:ready',
    STORAGE_ERROR: 'storage:error',
    STORAGE_CLEARED: 'storage:cleared',
    
    // Checklist
    CHECKLIST_LOADED: 'checklist:loaded',
    CHECKLIST_ITEM_CHANGED: 'checklist:item-changed',
    CHECKLIST_COMPLETED: 'checklist:completed',
    CHECKLIST_PROGRESS: 'checklist:progress',
    
    // Punchlist
    PUNCHLIST_LOADED: 'punchlist:loaded',
    PUNCHLIST_ADDED: 'punchlist:added',
    PUNCHLIST_UPDATED: 'punchlist:updated',
    PUNCHLIST_DELETED: 'punchlist:deleted',
    
    // Theme
    THEME_CHANGED: 'theme:changed',
    THEME_TOGGLED: 'theme:toggled',
    
    // UI
    SIDEBAR_OPENED: 'ui:sidebar-opened',
    SIDEBAR_CLOSED: 'ui:sidebar-closed',
    MODAL_OPENED: 'ui:modal-opened',
    MODAL_CLOSED: 'ui:modal-closed',
    
    // Notifications
    NOTIFICATION_SHOW: 'notification:show',
    NOTIFICATION_HIDE: 'notification:hide',
    
    // Sync
    SYNC_START: 'sync:start',
    SYNC_SUCCESS: 'sync:success',
    SYNC_ERROR: 'sync:error',
    
    // Export
    EXPORT_START: 'export:start',
    EXPORT_SUCCESS: 'export:success',
    EXPORT_ERROR: 'export:error',
    
    // Errors
    ERROR: 'error:occurred',
    WARNING: 'warning:occurred'
};

export default eventBus;
