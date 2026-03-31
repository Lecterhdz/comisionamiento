// ============================================
// LOGGER PROFESIONAL
// Sistema de logging con niveles y persistencia
// ============================================

// Niveles de log
export const LOG_LEVELS = {
    DEBUG: { value: 0, name: 'DEBUG', color: '#6b7280', icon: '🐛' },
    INFO: { value: 1, name: 'INFO', color: '#3b82f6', icon: 'ℹ️' },
    WARN: { value: 2, name: 'WARN', color: '#f59e0b', icon: '⚠️' },
    ERROR: { value: 3, name: 'ERROR', color: '#ef4444', icon: '❌' },
    FATAL: { value: 4, name: 'FATAL', color: '#7f1a1a', icon: '💀' },
    NONE: { value: 99, name: 'NONE', color: '#000000', icon: '🔇' }
};

// Nivel actual (cambiar en producción)
let currentLevel = LOG_LEVELS.DEBUG;

// Almacenamiento de logs (opcional)
let logStorage = [];
const MAX_STORAGE_LOGS = 1000;

class Logger {
    constructor(context = 'App') {
        this.context = context;
        this.enabled = true;
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
    
    fatal(message, ...args) {
        this._log(LOG_LEVELS.FATAL, message, args);
    }
    
    _log(level, message, args) {
        if (!this.enabled) return;
        if (level.value < currentLevel.value) return;
        
        const timestamp = new Date().toISOString();
        const prefix = `${level.icon} [${timestamp}] [${level.name}] [${this.context}]`;
        
        // Console output
        if (args.length > 0) {
            console.log(`%c${prefix} ${message}`, `color: ${level.color}`, ...args);
        } else {
            console.log(`%c${prefix} ${message}`, `color: ${level.color}`);
        }
        
        // Store log
        this._storeLog({ level, message, args, timestamp, context: this.context });
    }
    
    _storeLog(logEntry) {
        logStorage.push({
            ...logEntry,
            level: logEntry.level.name,
            timestamp: logEntry.timestamp
        });
        
        // Mantener límite
        while (logStorage.length > MAX_STORAGE_LOGS) {
            logStorage.shift();
        }
    }
    
    // Obtener logs almacenados
    getLogs(level = null) {
        if (!level) return [...logStorage];
        return logStorage.filter(log => log.level === level);
    }
    
    // Limpiar logs
    clearLogs() {
        logStorage = [];
        this.info('Logs limpiados');
    }
    
    // Exportar logs
    exportLogs() {
        return JSON.stringify(logStorage, null, 2);
    }
    
    // Deshabilitar logger
    disable() {
        this.enabled = false;
    }
    
    // Habilitar logger
    enable() {
        this.enabled = true;
    }
    
    // Iniciar medición de tiempo
    time(label) {
        console.time(`${this.context}:${label}`);
    }
    
    // Finalizar medición de tiempo
    timeEnd(label) {
        console.timeEnd(`${this.context}:${label}`);
    }
    
    // Group logs
    group(label, collapsed = false) {
        if (collapsed) {
            console.groupCollapsed(`${this.context}:${label}`);
        } else {
            console.group(`${this.context}:${label}`);
        }
    }
    
    groupEnd() {
        console.groupEnd();
    }
}

// Factory para crear loggers con contexto
export function createLogger(context) {
    return new Logger(context);
}

// Configurar nivel de log
export function setLogLevel(level) {
    if (typeof level === 'string') {
        const upperLevel = level.toUpperCase();
        if (LOG_LEVELS[upperLevel]) {
            currentLevel = LOG_LEVELS[upperLevel];
            console.log(`🔧 Log level set to: ${currentLevel.name}`);
        }
    } else if (level && level.value !== undefined) {
        currentLevel = level;
    }
}

// Obtener nivel actual
export function getLogLevel() {
    return currentLevel;
}

// Logger global
export const logger = new Logger('Global');

// Detectar entorno
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    setLogLevel('DEBUG');
    logger.info('🌍 Modo desarrollo: logs habilitados');
} else {
    setLogLevel('INFO');
    logger.info('🚀 Modo producción: logs limitados');
}

export default logger;
