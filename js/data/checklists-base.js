// ============================================
// CHECKLISTS BASE - Definidos por el administrador
// ============================================

export const checklistsBase = {
    // ============================================
    // SISTEMAS ELÉCTRICOS
    // ============================================
    'tablero-media-tension': {
        id: 'tablero-media-tension',
        nombre: 'Tablero de Media Tensión',
        disciplina: 'electrical',
        categoria: 'tableros',
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
        items: [
            { id: 'PLC-001', item: 'Verificación de módulos I/O', norm: 'IEC 61131', critical: true },
            { id: 'PLC-002', item: 'Prueba de fuerza de señales (forcing)', norm: 'IEC 61131', critical: true },
            { id: 'PLC-003', item: 'Verificación de alarmas en HMI/SCADA', norm: 'IEC 61131', critical: true },
            { id: 'PLC-004', item: 'Prueba de respaldo/restauración', norm: 'IEC 61131', critical: true },
            { id: 'PLC-005', item: 'Verificación de sincronización de tiempo', norm: 'IEC 61131', critical: false }
        ]
    }
};

// ============================================
// FUNCIONES AUXILIARES
// ============================================

// Obtener todos los sistemas disponibles
export function getAllSystems() {
    return Object.values(checklistsBase);
}

// Obtener sistemas por disciplina
export function getSystemsByDiscipline(discipline) {
    return Object.values(checklistsBase).filter(s => s.disciplina === discipline);
}

// Obtener un sistema por ID
export function getSystemById(id) {
    return checklistsBase[id] || null;
}

// Crear un nuevo checklist personalizado (para administrador)
export function createCustomSystem(systemData) {
    const newId = `custom-${Date.now()}`;
    checklistsBase[newId] = {
        id: newId,
        ...systemData,
        isCustom: true,
        createdAt: new Date().toISOString()
    };
    return checklistsBase[newId];
}

// Actualizar un checklist existente
export function updateSystem(systemId, updates) {
    if (checklistsBase[systemId]) {
        checklistsBase[systemId] = { ...checklistsBase[systemId], ...updates, updatedAt: new Date().toISOString() };
        return checklistsBase[systemId];
    }
    return null;
}

// Eliminar un checklist (solo si es personalizado)
export function deleteSystem(systemId) {
    if (checklistsBase[systemId]?.isCustom) {
        delete checklistsBase[systemId];
        return true;
    }
    return false;
}

export default checklistsBase;
