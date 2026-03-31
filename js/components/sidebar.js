// ============================================
// SIDEBAR MANAGER
// Manejo del sidebar colapsable en desktop y móvil
// ============================================

import { eventBus, EVENTS } from '../core/event-bus.js';
import { createLogger } from '../core/logger.js';
import { CONFIG, isDesktop } from '../core/config.js';

const log = createLogger('Sidebar');

class SidebarManager {
    constructor() {
        this.sidebar = null;
        this.hamburger = null;
        this.closeBtn = null;
        this.toggleBtn = null;
        this.overlay = null;
        this.isOpen = false;
        this.isCollapsed = false;
        this.isMobile = false;
    }
    
    init() {
        this.sidebar = document.getElementById('sidebar');
        this.hamburger = document.getElementById('hamburger');
        this.closeBtn = document.getElementById('sidebarClose');
        this.toggleBtn = document.getElementById('sidebarToggle');
        this.overlay = document.getElementById('sidebarOverlay');
        
        if (!this.sidebar) {
            log.warn('Sidebar no encontrado');
            return;
        }
        
        // Cargar estado guardado del colapso (solo desktop)
        const savedCollapsed = localStorage.getItem('sidebarCollapsed');
        if (savedCollapsed === 'true' && isDesktop()) {
            this.isCollapsed = true;
            this.sidebar.classList.add('collapsed');
        }
        
        this.checkMobile();
        this.bindEvents();
        this.setupResizeListener();
        
        log.info('Sidebar inicializado', { 
            isMobile: this.isMobile, 
            isCollapsed: this.isCollapsed 
        });
    }
    
    checkMobile() {
        this.isMobile = window.innerWidth <= CONFIG.BREAKPOINTS.TABLET;
        
        // En desktop, asegurar que el sidebar no está en modo "open" (que es para móvil)
        if (!this.isMobile && this.sidebar.classList.contains('open')) {
            this.sidebar.classList.remove('open');
            if (this.overlay) this.overlay.classList.remove('active');
        }
        
        // En móvil, si está colapsado, remover la clase (no aplica en móvil)
        if (this.isMobile && this.sidebar.classList.contains('collapsed')) {
            this.sidebar.classList.remove('collapsed');
            this.isCollapsed = false;
        }
    }
    
    open() {
        if (!this.sidebar) return;
        
        this.sidebar.classList.add('open');
        if (this.overlay) this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.isOpen = true;
        
        log.debug('Sidebar abierto');
        eventBus.emit(EVENTS.SIDEBAR_OPENED);
    }
    
    close() {
        if (!this.sidebar) return;
        
        this.sidebar.classList.remove('open');
        if (this.overlay) this.overlay.classList.remove('active');
        document.body.style.overflow = '';
        this.isOpen = false;
        
        log.debug('Sidebar cerrado');
        eventBus.emit(EVENTS.SIDEBAR_CLOSED);
    }
    
    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }
    
    // Colapsar/expandir sidebar (solo desktop)
    toggleCollapse() {
        if (this.isMobile) return;
        
        this.isCollapsed = !this.isCollapsed;
        
        if (this.isCollapsed) {
            this.sidebar.classList.add('collapsed');
            localStorage.setItem('sidebarCollapsed', 'true');
        } else {
            this.sidebar.classList.remove('collapsed');
            localStorage.setItem('sidebarCollapsed', 'false');
        }
        
        // Emitir evento para que otros componentes se adapten
        eventBus.emit('sidebar:collapsed-changed', { collapsed: this.isCollapsed });
        
        log.debug(`Sidebar ${this.isCollapsed ? 'colapsado' : 'expandido'}`);
    }
    
    bindEvents() {
        // Hamburguesa (móvil)
        if (this.hamburger) {
            this.hamburger.addEventListener('click', () => this.open());
        }
        
        // Botón de cierre (móvil)
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.close());
        }
        
        // Botón de colapso (desktop)
        if (this.toggleBtn) {
            this.toggleBtn.addEventListener('click', () => this.toggleCollapse());
        }
        
        // Overlay (móvil)
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
                
                // Si cambia a desktop y el menú estaba abierto (modo móvil), cerrarlo
                if (wasMobile && !this.isMobile && this.isOpen) {
                    this.close();
                }
                
                // Si cambia a móvil y estaba colapsado en desktop, restaurar
                if (!wasMobile && this.isMobile && this.isCollapsed) {
                    this.sidebar.classList.remove('collapsed');
                    this.isCollapsed = false;
                    localStorage.setItem('sidebarCollapsed', 'false');
                }
            }, 150);
        });
    }
    
    // Métodos públicos
    getState() {
        return {
            isOpen: this.isOpen,
            isCollapsed: this.isCollapsed,
            isMobile: this.isMobile
        };
    }
    
    destroy() {
        this.close();
        log.info('Sidebar destruido');
    }
}

// Singleton
export const sidebarManager = new SidebarManager();

// Función de inicialización (compatibilidad)
export function initSidebar() {
    sidebarManager.init();
}

export default sidebarManager;
