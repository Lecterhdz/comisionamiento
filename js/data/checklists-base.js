// ============================================
// CHECKLISTS BASE - Gestión de checklists del sistema
// ============================================

// Datos base de checklists (predefinidos por el sistema)
export const checklistsBase = {
    // ============================================
    // SISTEMAS ELÉCTRICOS
    // ============================================
    'tablero-media-tension': {
        id: 'tablero-media-tension',
        nombre: 'Tablero de Media Tensión',
        disciplina: 'electrical',
        categoria: 'tableros',
        isSystem: true,  // No se puede eliminar
        items: [
            { id: 'MT-001', item: 'Verificación de fijación y nivelación del tablero', norm: 'NOM-001-SEDE-2012', critical: true },
            { id: 'MT-002', item: 'Verificación de espacio de trabajo (frente, laterales, posterior)', norm: 'NOM-001-SEDE-2012', critical: true },
            { id: 'MT-003', item: 'Identificación de circuitos en puerta y en interiores', norm: 'NOM-001-SEDE-2012', critical: false },
            { id: 'MT-004', item: 'Prueba de continuidad y aislamiento (megger)', norm: 'IEEE 43', critical: true },
            { id: 'MT-005', item: 'Verificación de protecciones termomagnéticas', norm: 'NOM-001-SEDE-2012', critical: true }
        ]
    },
    'tablero-baja-tension': {
        id: 'tablero-baja-tension',
        nombre: 'Tablero de Baja Tensión',
        disciplina: 'electrical',
        categoria: 'tableros',
        isSystem: true,
        items: [
            { id: 'BT-001', item: 'Verificación de fijación y nivelación', norm: 'NOM-001-SEDE-2012', critical: true },
            { id: 'BT-002', item: 'Verificación de protecciones termomagnéticas', norm: 'NOM-001-SEDE-2012', critical: true },
            { id: 'BT-003', item: 'Prueba de funcionamiento de contactores', norm: 'IEC 60947', critical: true },
            { id: 'BT-004', item: 'Verificación de cableado y conexiones', norm: 'NOM-001-SEDE-2012', critical: true },
            { id: 'BT-005', item: 'Identificación de circuitos', norm: 'NOM-001-SEDE-2012', critical: false }
        ]
    },
    'motor-electrico': {
        id: 'motor-electrico',
        nombre: 'Motor Eléctrico',
        disciplina: 'electrical',
        categoria: 'motores',
        isSystem: true,
        items: [
            { id: 'MTR-001', item: 'Verificación de alineación motor-carga', norm: 'NEMA MG-1', critical: true },
            { id: 'MTR-002', item: 'Medición de resistencia de aislamiento', norm: 'IEEE 43', critical: true },
            { id: 'MTR-003', item: 'Verificación de dirección de giro', norm: 'NEMA MG-1', critical: true },
            { id: 'MTR-004', item: 'Medición de corriente en vacío', norm: 'NEMA MG-1', critical: true },
            { id: 'MTR-005', item: 'Verificación de temperatura de rodamientos', norm: 'NEMA MG-1', critical: false }
        ]
    },
    'vfd-variador': {
        id: 'vfd-variador',
        nombre: 'Variador de Frecuencia (VFD)',
        disciplina: 'electrical',
        categoria: 'variadores',
        isSystem: true,
        items: [
            { id: 'VFD-001', item: 'Verificación de parámetros de configuración', norm: 'Fabricante', critical: true },
            { id: 'VFD-002', item: 'Prueba de arranque y paro local/remoto', norm: 'Fabricante', critical: true },
            { id: 'VFD-003', item: 'Verificación de señales de control', norm: 'Fabricante', critical: true },
            { id: 'VFD-004', item: 'Prueba de sobrecarga', norm: 'Fabricante', critical: true },
            { id: 'VFD-005', item: 'Verificación de comunicación', norm: 'Fabricante', critical: false }
        ]
    },
    
    // ============================================
    // SISTEMAS DE INSTRUMENTACIÓN
    // ============================================
    'transmisor-presion': {
        id: 'transmisor-presion',
        nombre: 'Transmisor de Presión',
        disciplina: 'instrumentation',
        categoria: 'transmisores',
        isSystem: true,
        items: [
            { id: 'TP-001', item: 'Verificación de rango y configuración', norm: 'API 551', critical: true },
            { id: 'TP-002', item: 'Prueba de calibración', norm: 'API 551', critical: true },
            { id: 'TP-003', item: 'Verificación de conexión a manifold', norm: 'API 551', critical: true },
            { id: 'TP-004', item: 'Verificación de líneas de impulso', norm: 'API 551', critical: true },
            { id: 'TP-005', item: 'Prueba de comunicación HART', norm: 'Fabricante', critical: false }
        ]
    },
    'transmisor-temperatura': {
        id: 'transmisor-temperatura',
        nombre: 'Transmisor de Temperatura',
        disciplina: 'instrumentation',
        categoria: 'transmisores',
        isSystem: true,
        items: [
            { id: 'TT-001', item: 'Verificación de tipo de sensor (RTD/TC)', norm: 'IEC 60751', critical: true },
            { id: 'TT-002', item: 'Prueba de calibración', norm: 'IEC 60751', critical: true },
            { id: 'TT-003', item: 'Verificación de termopozo', norm: 'ASME PTC 19.3', critical: false },
            { id: 'TT-004', item: 'Verificación de profundidad de inserción', norm: 'ASME PTC 19.3', critical: true },
            { id: 'TT-005', item: 'Prueba de comunicación', norm: 'Fabricante', critical: false }
        ]
    },
    'valvula-control': {
        id: 'valvula-control',
        nombre: 'Válvula de Control',
        disciplina: 'instrumentation',
        categoria: 'valvulas',
        isSystem: true,
        items: [
            { id: 'VC-001', item: 'Verificación de posición y sentido actuación (FO/FC)', norm: 'ISA-75', critical: true },
            { id: 'VC-002', item: 'Prueba de calibración de posicionador', norm: 'ISA-75', critical: true },
            { id: 'VC-003', item: 'Verificación de suministro de aire', norm: 'ISA-75', critical: true },
            { id: 'VC-004', item: 'Prueba de respuesta escalón', norm: 'ISA-75', critical: true },
            { id: 'VC-005', item: 'Verificación de fugas', norm: 'ISA-75', critical: true }
        ]
    },
    'plc-dcs': {
        id: 'plc-dcs',
        nombre: 'PLC/DCS',
        disciplina: 'instrumentation',
        categoria: 'control',
        isSystem: true,
        items: [
            { id: 'PLC-001', item: 'Verificación de módulos I/O', norm: 'IEC 61131', critical: true },
            { id: 'PLC-002', item: 'Prueba de fuerza de señales (forcing)', norm: 'IEC 61131', critical: true },
            { id: 'PLC-003', item: 'Verificación de alarmas en HMI/SCADA', norm: 'IEC 61131', critical: true },
            { id: 'PLC-004', item: 'Prueba de respaldo/restauración', norm: 'IEC 61131', critical: true },
            { id: 'PLC-005', item: 'Verificación de sincronización de tiempo', norm: 'IEC 61131', critical: false }
        ]
    }
};

// Almacenamiento de sistemas personalizados (creados por admin)
let customSystems = {};

// Cargar sistemas personalizados guardados
export function loadCustomSystems() {
    const saved = localStorage.getItem('custom_checklists');
    if (saved) {
        customSystems = JSON.parse(saved);
    }
}

// Guardar sistemas personalizados
export function saveCustomSystems() {
    localStorage.setItem('custom_checklists', JSON.stringify(customSystems));
}

// Obtener todos los sistemas (base + personalizados)
export function getAllSystems() {
    return { ...checklistsBase, ...customSystems };
}

// Obtener sistema por ID
export function getSystemById(id) {
    return { ...checklistsBase, ...customSystems }[id] || null;
}

// Obtener sistemas por disciplina
export function getSystemsByDiscipline(discipline) {
    const all = getAllSystems();
    return Object.values(all).filter(s => s.disciplina === discipline);
}

// Crear nuevo sistema personalizado
export function createCustomSystem(systemData) {
    const newId = `custom-${Date.now()}`;
    const newSystem = {
        id: newId,
        ...systemData,
        isCustom: true,
        createdAt: new Date().toISOString()
    };
    customSystems[newId] = newSystem;
    saveCustomSystems();
    return newSystem;
}

// Actualizar sistema personalizado
export function updateCustomSystem(systemId, updates) {
    if (customSystems[systemId]) {
        customSystems[systemId] = { ...customSystems[systemId], ...updates, updatedAt: new Date().toISOString() };
        saveCustomSystems();
        return customSystems[systemId];
    }
    return null;
}

// Eliminar sistema personalizado
export function deleteCustomSystem(systemId) {
    if (customSystems[systemId]) {
        delete customSystems[systemId];
        saveCustomSystems();
        return true;
    }
    return false;
}

// Obtener checklists disponibles para selección (formateado para proyecto)
export function getAvailableChecklists() {
    const all = getAllSystems();
    return Object.values(all).map(system => ({
        id: system.id,
        nombre: system.nombre,
        disciplina: system.disciplina,
        categoria: system.categoria,
        totalItems: system.items.length,
        isCustom: system.isCustom || false
    }));
}

// Obtener categorías únicas
export function getUniqueCategories() {
    const all = getAllSystems();
    const categories = new Set();
    Object.values(all).forEach(s => {
        if (s.categoria) categories.add(s.categoria);
    });
    return Array.from(categories);
}

export default {
    checklistsBase,
    loadCustomSystems,
    saveCustomSystems,
    getAllSystems,
    getSystemById,
    getSystemsByDiscipline,
    createCustomSystem,
    updateCustomSystem,
    deleteCustomSystem,
    getAvailableChecklists,
    getUniqueCategories
};
