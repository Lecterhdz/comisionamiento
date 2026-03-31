// ============================================
// NOTIFICATION SERVICE
// Sistema de notificaciones tipo toast
// ============================================

import { CONFIG } from '../core/config.js';
import { eventBus, EVENTS } from '../core/event-bus.js';
import { createLogger } from '../core/logger.js';

const log = createLogger('Notifications');

class NotificationService {
    constructor() {
        this.container = null;
        this.defaultDuration = CONFIG.TIMEOUTS.NOTIFICATION;
        this.toasts = new Map();
        this.maxToasts = 5;
        this.init();
    }
    
    init() {
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'toast-container';
            this.container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 12px;
                max-width: 380px;
                pointer-events: none;
            `;
            document.body.appendChild(this.container);
            log.debug('Toast container creado');
        }
    }
    
    show(message, type = 'info', duration = null) {
        const id = Date.now() + Math.random();
        const durationMs = duration || this.defaultDuration;
        
        // Limpiar toasts si hay muchos
        if (this.toasts.size >= this.maxToasts) {
            const oldestId = this.toasts.keys().next().value;
            this.hide(oldestId);
        }
        
        const toast = document.createElement('div');
        const colors = this._getColors(type);
        
        toast.id = `toast-${id}`;
        toast.className = `toast toast-${type}`;
        toast.style.cssText = `
            background: linear-gradient(135deg, ${colors.bg}, ${colors.bgDark});
            color: white;
            padding: 14px 18px;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 8px 20px rgba(0,0,0,0.2);
            transform: translateX(100%);
            transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            max-width: 100%;
            word-break: break-word;
            display: flex;
            align-items: center;
            gap: 12px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
            pointer-events: auto;
            cursor: pointer;
        `;
        
        const icon = this._getIcon(type);
        toast.innerHTML = `
            <span style="font-size: 18px;">${icon}</span>
            <span style="flex: 1;">${message}</span>
            <button style="
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                font-size: 16px;
                opacity: 0.7;
                padding: 0 4px;
            " aria-label="Cerrar">✕</button>
        `;
        
        this.container.appendChild(toast);
        this.toasts.set(id, toast);
        
        // Animación de entrada
        requestAnimationFrame(() => {
            toast.style.transform = 'translateX(0)';
        });
        
        // Auto-eliminar
        const timeoutId = setTimeout(() => {
            this.hide(id);
        }, durationMs);
        
        // Evento de cierre manual
        const closeBtn = toast.querySelector('button');
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.hide(id);
            clearTimeout(timeoutId);
        });
        
        // Clic en el toast
        toast.addEventListener('click', () => {
            this.hide(id);
            clearTimeout(timeoutId);
        });
        
        log.debug(`Notificación mostrada: ${type}`, { message, id });
        
        return id;
    }
    
    hide(id) {
        const toast = this.toasts.get(id);
        if (!toast) return;
        
        toast.style.transform = 'translateX(100%)';
        toast.classList.add('hiding');
        
        setTimeout(() => {
            if (toast.parentNode) toast.remove();
            this.toasts.delete(id);
            log.debug(`Notificación eliminada: ${id}`);
        }, 300);
    }
    
    success(message, duration) {
        return this.show(message, 'success', duration);
    }
    
    error(message, duration) {
        return this.show(message, 'error', duration);
    }
    
    warning(message, duration) {
        return this.show(message, 'warning', duration);
    }
    
    info(message, duration) {
        return this.show(message, 'info', duration);
    }
    
    // Notificación de carga persistente
    loading(message = 'Cargando...') {
        const id = Date.now() + Math.random();
        const colors = { bg: '#3b82f6', bgDark: '#2563eb' };
        
        const toast = document.createElement('div');
        toast.id = `toast-${id}`;
        toast.className = 'toast toast-loading';
        toast.style.cssText = `
            background: linear-gradient(135deg, ${colors.bg}, ${colors.bgDark});
            color: white;
            padding: 14px 18px;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 8px 20px rgba(0,0,0,0.2);
            transform: translateX(100%);
            transition: transform 0.3s ease;
            display: flex;
            align-items: center;
            gap: 12px;
            pointer-events: auto;
        `;
        
        toast.innerHTML = `
            <div class="spinner-sm" style="
                width: 18px;
                height: 18px;
                border: 2px solid rgba(255,255,255,0.3);
                border-top-color: white;
                border-radius: 50%;
                animation: spin 0.6s linear infinite;
            "></div>
            <span>${message}</span>
        `;
        
        this.container.appendChild(toast);
        this.toasts.set(id, toast);
        
        requestAnimationFrame(() => {
            toast.style.transform = 'translateX(0)';
        });
        
        return id;
    }
    
    hideLoading(id) {
        this.hide(id);
    }
    
    _getColors(type) {
        const colors = {
            success: { bg: '#10b981', bgDark: '#059669' },
            error: { bg: '#ef4444', bgDark: '#dc2626' },
            warning: { bg: '#f59e0b', bgDark: '#d97706' },
            info: { bg: '#3b82f6', bgDark: '#2563eb' }
        };
        return colors[type] || colors.info;
    }
    
    _getIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || '📢';
    }
    
    clear() {
        this.toasts.forEach((_, id) => this.hide(id));
    }
}

// Singleton
export const notifications = new NotificationService();

// Conectar con event bus
eventBus.on(EVENTS.NOTIFICATION_SHOW, (data) => {
    notifications.show(data.message, data.type, data.duration);
});

export default notifications;
