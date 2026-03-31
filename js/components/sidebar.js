import { eventBus, EVENTS } from '../core/event-bus.js';
import { createLogger } from '../core/logger.js';

const logger = createLogger('Sidebar');

class SidebarManager {
    constructor() {
        this.sidebar = null;
        this.hamburger = null;
        this.closeBtn = null;
        this.overlay = null;
        this.isOpen = false;
        this.isMobile = false;
    }
    
    init() {
        this.sidebar = document.getElementById('sidebar');
        this.hamburger = document.getElementById('hamburger');
        this.closeBtn = document.getElementById('sidebarClose');
        this.overlay = document.getElementById('sidebarOverlay');
        
        if (!this.sidebar) {
            logger.warn('Sidebar no encontrado');
            return;
        }
        
        this.checkMobile();
        this.bindEvents();
        this.setupResizeListener();
        
        logger.info('Sidebar inicializado');
    }
    
    checkMobile() {
        this.isMobile = window.innerWidth <= 1024;
        
        // En desktop, asegurar que el sidebar está visible
        if (!this.isMobile && this.sidebar.classList.contains('open')) {
            this.sidebar.classList.remove('open');
            if (this.overlay) this.overlay.classList.remove('active');
        }
    }
    
    open() {
        if (!this.sidebar) return;
        
        this.sidebar.classList.add('open');
        if (this.overlay) this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.isOpen = true;
        
        logger.debug('Sidebar abierto');
        eventBus.emit(EVENTS.NOTIFICATION_SHOW, { type: 'info', message: 'Menú abierto' });
    }
    
    close() {
        if (!this.sidebar) return;
        
        this.sidebar.classList.remove('open');
        if (this.overlay) this.overlay.classList.remove('active');
        document.body.style.overflow = '';
        this.isOpen = false;
        
        logger.debug('Sidebar cerrado');
    }
    
    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }
    
    bindEvents() {
        if (this.hamburger) {
            this.hamburger.addEventListener('click', () => this.open());
        }
        
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.close());
        }
        
        if (this.overlay) {
            this.overlay.addEventListener('click', () => this.close());
        }
        
        // Cerrar con tecla Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }
    
    setupResizeListener() {
        let resizeTimeout;
        
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const wasMobile = this.isMobile;
                this.checkMobile();
                
                // Si cambia a desktop y el menú estaba abierto, cerrarlo
                if (wasMobile && !this.isMobile && this.isOpen) {
                    this.close();
                }
            }, 150);
        });
    }
    
    // Método para cerrar programáticamente
    destroy() {
        this.close();
        logger.info('Sidebar destruido');
    }
}

// Singleton
export const sidebarManager = new SidebarManager();

// Función de inicialización (compatibilidad)
export function initSidebar() {
    sidebarManager.init();
}

export default sidebarManager;
