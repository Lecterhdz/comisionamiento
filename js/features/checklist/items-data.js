// ============================================
// CHECKLIST ITEMS DATA
// Datos de checklist por sistema/equipo
// Mantiene compatibilidad con versiones anteriores
// ============================================

// ============================================
// DATOS LEGACY (para compatibilidad con páginas existentes)
// ============================================

// Checklist Eléctrico (legacy)
export const electricalChecklistItems = [
    { id: 'elec-001', section: 'Tableros Eléctricos', item: 'Verificación de fijación y nivelación del tablero', norm: 'NOM-001-SEDE-2012', critical: true },
    { id: 'elec-002', section: 'Tableros Eléctricos', item: 'Verificación de espacio de trabajo (frente, laterales, posterior)', norm: 'NOM-001-SEDE-2012', critical: true },
    { id: 'elec-003', section: 'Tableros Eléctricos', item: 'Identificación de circuitos en puerta y en interiores', norm: 'NOM-001-SEDE-2012', critical: false },
    { id: 'elec-004', section: 'Protecciones', item: 'Verificación de calibración de interruptores termomagnéticos', norm: 'NOM-001-SEDE-2012', critical: true },
    { id: 'elec-005', section: 'Protecciones', item: 'Prueba de funcionamiento de relevadores de protección', norm: 'IEC 60255', critical: true },
    { id: 'elec-006', section: 'Protecciones', item: 'Verificación de ajustes de protección de sobrecarga y cortocircuito', norm: 'NOM-001-SEDE-2012', critical: true },
    { id: 'elec-007', section: 'Cableado', item: 'Verificación de calibre de conductores según diseño', norm: 'NOM-001-SEDE-2012', critical: true },
    { id: 'elec-008', section: 'Cableado', item: 'Prueba de continuidad y aislamiento (megger)', norm: 'IEEE 43', critical: true },
    { id: 'elec-009', section: 'Cableado', item: 'Verificación de identificación de conductores (fase, neutro, tierra)', norm: 'NOM-001-SEDE-2012', critical: false },
    { id: 'elec-010', section: 'Puesta a Tierra', item: 'Medición de resistencia de puesta a tierra', norm: 'IEEE 81', critical: true },
    { id: 'elec-011', section: 'Puesta a Tierra', item: 'Verificación de continuidad de conductor de tierra', norm: 'NOM-001-SEDE-2012', critical: true },
    { id: 'elec-012', section: 'Motores', item: 'Verificación de alineación entre motor y carga', norm: 'NOM-001-SEDE-2012', critical: true },
    { id: 'elec-013', section: 'Motores', item: 'Medición de resistencia de aislamiento de devanados', norm: 'IEEE 43', critical: true },
    { id: 'elec-014', section: 'Motores', item: 'Verificación de dirección de giro', norm: 'NOM-001-SEDE-2012', critical: true },
    { id: 'elec-015', section: 'Arrancadores y VFDs', item: 'Verificación de parámetros de configuración del VFD', norm: 'Fabricante', critical: true },
    { id: 'elec-016', section: 'Arrancadores y VFDs', item: 'Prueba de arranque y paro local/remoto', norm: 'Fabricante', critical: true }
];

// Checklist Instrumentación (legacy)
export const instrumentationChecklistItems = [
    { id: 'inst-001', section: 'Transmisores de Presión', item: 'Verificación de rango y configuración del transmisor', norm: 'API 551', critical: true },
    { id: 'inst-002', section: 'Transmisores de Presión', item: 'Prueba de calibración con multímetro y calibrador', norm: 'API 551', critical: true },
    { id: 'inst-003', section: 'Transmisores de Presión', item: 'Verificación de conexión a manifold y líneas de impulso', norm: 'API 551', critical: true },
    { id: 'inst-004', section: 'Transmisores de Temperatura', item: 'Verificación de tipo de sensor (RTD, TC) y configuración', norm: 'IEC 60751', critical: true },
    { id: 'inst-005', section: 'Transmisores de Temperatura', item: 'Prueba de calibración con simulador de temperatura', norm: 'IEC 60751', critical: true },
    { id: 'inst-006', section: 'Transmisores de Temperatura', item: 'Verificación de termopozo y profundidad de inserción', norm: 'ASME PTC 19.3', critical: false },
    { id: 'inst-007', section: 'Medidores de Flujo', item: 'Verificación de orientación y dirección de flujo', norm: 'ISO 5167', critical: true },
    { id: 'inst-008', section: 'Medidores de Flujo', item: 'Configuración de parámetros en transmisor (rango, unidad, corte)', norm: 'Fabricante', critical: true },
    { id: 'inst-009', section: 'Válvulas de Control', item: 'Verificación de posición y sentido de actuación (FO/FC)', norm: 'ISA-75', critical: true },
    { id: 'inst-010', section: 'Válvulas de Control', item: 'Prueba de calibración de posicionador (0%, 25%, 50%, 75%, 100%)', norm: 'ISA-75', critical: true },
    { id: 'inst-011', section: 'Válvulas de Control', item: 'Verificación de suministro de aire y filtros reguladores', norm: 'ISA-75', critical: true },
    { id: 'inst-012', section: 'PLC/DCS', item: 'Verificación de módulos de entrada/salida (I/O check)', norm: 'IEC 61131', critical: true },
    { id: 'inst-013', section: 'PLC/DCS', item: 'Prueba de fuerza de señales (forcing) y simulación', norm: 'IEC 61131', critical: true },
    { id: 'inst-014', section: 'PLC/DCS', item: 'Verificación de alarmas y eventos en HMI/SCADA', norm: 'IEC 61131', critical: true },
    { id: 'inst-015', section: 'Instrumentos Analíticos', item: 'Verificación de calibración con estándares', norm: 'Fabricante', critical: true },
    { id: 'inst-016', section: 'Instrumentos Analíticos', item: 'Prueba de respuesta y tiempo de estabilización', norm: 'Fabricante', critical: false },
    { id: 'inst-017', section: 'Cableado Instrumentación', item: 'Prueba de continuidad y aislamiento de señales', norm: 'ISA-50', critical: true },
    { id: 'inst-018', section: 'Cableado Instrumentación', item: 'Verificación de identificadores de cables y terminales', norm: 'ISA-50', critical: false }
];

// ============================================
// DATOS POR SISTEMA/EQUIPO (nueva estructura)
// ============================================

export const checklistPorSistema = {
    // Sistemas Eléctricos
    'tablero-media-tension': {
        nombre: 'Tablero de Media Tensión',
        tipo: 'electrical',
        items: [
            { id: 'MT-001', item: 'Verificación de fijación y nivelación del tablero', norm: 'NOM-001-SEDE-2012', critical: true },
            { id: 'MT-002', item: 'Verificación de espacio de trabajo (frente, laterales, posterior)', norm: 'NOM-001-SEDE-2012', critical: true },
            { id: 'MT-003', item: 'Identificación de circuitos en puerta y en interiores', norm: 'NOM-001-SEDE-2012', critical: false },
            { id: 'MT-004', item: 'Prueba de continuidad y aislamiento (megger)', norm: 'IEEE 43', critical: true },
            { id: 'MT-005', item: 'Verificación de protecciones termomagnéticas', norm: 'NOM-001-SEDE-2012', critical: true }
        ]
    },
    'tablero-baja-tension': {
        nombre: 'Tablero de Baja Tensión',
        tipo: 'electrical',
        items: [
            { id: 'BT-001', item: 'Verificación de fijación y nivelación', norm: 'NOM-001-SEDE-2012', critical: true },
            { id: 'BT-002', item: 'Verificación de protecciones termomagnéticas', norm: 'NOM-001-SEDE-2012', critical: true },
            { id: 'BT-003', item: 'Prueba de funcionamiento de contactores', norm: 'IEC 60947', critical: true },
            { id: 'BT-004', item: 'Verificación de cableado y conexiones', norm: 'NOM-001-SEDE-2012', critical: true },
            { id: 'BT-005', item: 'Identificación de circuitos', norm: 'NOM-001-SEDE-2012', critical: false }
        ]
    },
    'motor-electrico': {
        nombre: 'Motor Eléctrico',
        tipo: 'electrical',
        items: [
            { id: 'MTR-001', item: 'Verificación de alineación motor-carga', norm: 'NEMA MG-1', critical: true },
            { id: 'MTR-002', item: 'Medición de resistencia de aislamiento', norm: 'IEEE 43', critical: true },
            { id: 'MTR-003', item: 'Verificación de dirección de giro', norm: 'NEMA MG-1', critical: true },
            { id: 'MTR-004', item: 'Medición de corriente en vacío', norm: 'NEMA MG-1', critical: true },
            { id: 'MTR-005', item: 'Verificación de temperatura de rodamientos', norm: 'NEMA MG-1', critical: false }
        ]
    },
    'vfd-variador': {
        nombre: 'Variador de Frecuencia (VFD)',
        tipo: 'electrical',
        items: [
            { id: 'VFD-001', item: 'Verificación de parámetros de configuración', norm: 'Fabricante', critical: true },
            { id: 'VFD-002', item: 'Prueba de arranque y paro local/remoto', norm: 'Fabricante', critical: true },
            { id: 'VFD-003', item: 'Verificación de señales de control', norm: 'Fabricante', critical: true },
            { id: 'VFD-004', item: 'Prueba de sobrecarga', norm: 'Fabricante', critical: true },
            { id: 'VFD-005', item: 'Verificación de comunicación', norm: 'Fabricante', critical: false }
        ]
    },
    
    // Sistemas de Instrumentación
    'transmisor-presion': {
        nombre: 'Transmisor de Presión',
        tipo: 'instrumentation',
        items: [
            { id: 'TP-001', item: 'Verificación de rango y configuración', norm: 'API 551', critical: true },
            { id: 'TP-002', item: 'Prueba de calibración', norm: 'API 551', critical: true },
            { id: 'TP-003', item: 'Verificación de conexión a manifold', norm: 'API 551', critical: true },
            { id: 'TP-004', item: 'Verificación de líneas de impulso', norm: 'API 551', critical: true },
            { id: 'TP-005', item: 'Prueba de comunicación HART', norm: 'Fabricante', critical: false }
        ]
    },
    'transmisor-temperatura': {
        nombre: 'Transmisor de Temperatura',
        tipo: 'instrumentation',
        items: [
            { id: 'TT-001', item: 'Verificación de tipo de sensor (RTD/TC)', norm: 'IEC 60751', critical: true },
            { id: 'TT-002', item: 'Prueba de calibración', norm: 'IEC 60751', critical: true },
            { id: 'TT-003', item: 'Verificación de termopozo', norm: 'ASME PTC 19.3', critical: false },
            { id: 'TT-004', item: 'Verificación de profundidad de inserción', norm: 'ASME PTC 19.3', critical: true },
            { id: 'TT-005', item: 'Prueba de comunicación', norm: 'Fabricante', critical: false }
        ]
    },
    'valvula-control': {
        nombre: 'Válvula de Control',
        tipo: 'instrumentation',
        items: [
            { id: 'VC-001', item: 'Verificación de posición y sentido actuación (FO/FC)', norm: 'ISA-75', critical: true },
            { id: 'VC-002', item: 'Prueba de calibración de posicionador', norm: 'ISA-75', critical: true },
            { id: 'VC-003', item: 'Verificación de suministro de aire', norm: 'ISA-75', critical: true },
            { id: 'VC-004', item: 'Prueba de respuesta escalón', norm: 'ISA-75', critical: true },
            { id: 'VC-005', item: 'Verificación de fugas', norm: 'ISA-75', critical: true }
        ]
    },
    'plc-dcs': {
        nombre: 'PLC/DCS',
        tipo: 'instrumentation',
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

// Obtener items por sistema
export function getChecklistItemsBySystem(systemId) {
    return checklistPorSistema[systemId] || null;
}

// Obtener todos los sistemas disponibles
export function getAvailableSystems() {
    return Object.entries(checklistPorSistema).map(([id, data]) => ({
        id,
        nombre: data.nombre,
        tipo: data.tipo
    }));
}

// Obtener sistemas por tipo
export function getSystemsByType(type) {
    return Object.entries(checklistPorSistema)
        .filter(([_, data]) => data.tipo === type)
        .map(([id, data]) => ({
            id,
            nombre: data.nombre,
            tipo: data.tipo
        }));
}

// Obtener nombre de sistema por ID
export function getSystemName(systemId) {
    const system = checklistPorSistema[systemId];
    return system?.nombre || systemId;
}

// ============================================
// ETAPAS DEL PROYECTO
// ============================================

export const etapasProyecto = [
    { id: 'pre-comisionamiento', nombre: 'Pre-comisionamiento', orden: 1 },
    { id: 'comisionamiento-frio', nombre: 'Comisionamiento en Frío', orden: 2 },
    { id: 'comisionamiento-caliente', nombre: 'Comisionamiento en Caliente', orden: 3 },
    { id: 'pruebas-funcionales', nombre: 'Pruebas Funcionales', orden: 4 },
    { id: 'aceptacion', nombre: 'Aceptación y Entrega', orden: 5 }
];

// Obtener etapa por ID
export function getEtapaById(etapaId) {
    return etapasProyecto.find(e => e.id === etapaId) || null;
}

// Exportar todo para compatibilidad
export default {
    electricalChecklistItems,
    instrumentationChecklistItems,
    checklistPorSistema,
    getChecklistItemsBySystem,
    getAvailableSystems,
    getSystemsByType,
    getSystemName,
    etapasProyecto,
    getEtapaById
};
