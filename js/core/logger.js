// Niveles de log
const LOG_LEVELS = {
    DEBUG: { value: 0, name: 'DEBUG', color: '#808080' },
    INFO: { value: 1, name: 'INFO', color: '#3b82f6' },
    WARN: { value: 2, name: 'WARN', color: '#f59e0b' },
    ERROR: { value: 3, name: 'ERROR', color: '#ef4444' }
};

// Nivel actual (cambiar a INFO en producción)
let currentLevel = LOG_LEVELS.DEBUG;

class Logger {
    constructor(context = 'App') {
        this.context = context;
    }
    
    setContext(context) {
        this.context = context;
        return this;
    }
    
    debug(message, ...args) {
        this._log(LOG_LEVELS.DEBUG, message, args);
    }
    
    info(message, ...args) {
        this._log(LOG_LEVELS.INFO, message, args);
    }
    
    warn(message, ...args) {
        this._log(LOG_LEVELS.WARN, message, args);
    }
    
    error(message, ...args) {
        this._log(LOG_LEVELS.ERROR, message, args);
    }
    
    _log(level, message, args) {
        if (level.value < currentLevel.value) return;
        
        const timestamp = new Date().toISOString();
        const prefix = `[${timestamp}] [${level.name}] [${this.context}]`;
        
        if (args.length > 0) {
            console.log(`%c${prefix} ${message}`, `color: ${level.color}`, ...args);
        } else {
            console.log(`%c${prefix} ${message}`, `color: ${level.color}`);
        }
    }
    
    // Guardar logs en IndexedDB (opcional)
    async saveToStorage(log) {
        // Implementar si se desea persistencia
    }
}

// Factory para crear loggers con contexto
export function createLogger(context) {
    return new Logger(context);
}

// Configurar nivel de log
export function setLogLevel(level) {
    if (LOG_LEVELS[level.toUpperCase()]) {
        currentLevel = LOG_LEVELS[level.toUpperCase()];
    }
}

// Logger global
export const logger = new Logger('Global');
