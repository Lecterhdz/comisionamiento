import { eventBus, EVENTS } from './event-bus.js';
import { createLogger } from './logger.js';

const logger = createLogger('Theme');

// Clase para manejar el tema
class ThemeManager {
    constructor() {
        this.currentTheme = null;
        this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    }
    
    init() {
        // Detectar tema guardado o preferencia del sistema
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = this.mediaQuery.matches;
        
        this.currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
        this.applyTheme(this.currentTheme);
        
        // Escuchar cambios del sistema
        this.mediaQuery.addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
        
        logger.info(`Tema inicializado: ${this.currentTheme}`);
    }
    
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        
        // Actualizar botones visualmente
        this.updateToggleButtons(theme);
        
        // Emitir evento
        eventBus.emit(EVENTS.THEME_CHANGED, { theme });
    }
    
    setTheme(theme) {
        this.applyTheme(theme);
        localStorage.setItem('theme', theme);
        logger.info(`Tema cambiado a: ${theme}`);
    }
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
        return newTheme;
    }
    
    updateToggleButtons(theme) {
        const themeToggle = document.getElementById('themeToggle');
        const themeToggleMobile = document.getElementById('themeToggleMobile');
        
        if (themeToggleMobile) {
            themeToggleMobile.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
        
        if (themeToggle) {
            const themeText = themeToggle.querySelector('.theme-text');
            if (themeText) {
                themeText.textContent = theme === 'dark' ? 'Modo claro' : 'Modo oscuro';
            }
        }
    }
    
    getCurrentTheme() {
        return this.currentTheme;
    }
    
    isDark() {
        return this.currentTheme === 'dark';
    }
}

// Singleton
export const themeManager = new ThemeManager();

// Función de inicialización (compatibilidad con código existente)
export function initTheme() {
    themeManager.init();
    
    // Configurar botones de toggle
    const themeToggle = document.getElementById('themeToggle');
    const themeToggleMobile = document.getElementById('themeToggleMobile');
    
    const toggleFn = () => themeManager.toggleTheme();
    
    if (themeToggle) themeToggle.addEventListener('click', toggleFn);
    if (themeToggleMobile) themeToggleMobile.addEventListener('click', toggleFn);
    
    logger.debug('Theme listeners configurados');
}

// Exportar para compatibilidad
export default themeManager;
