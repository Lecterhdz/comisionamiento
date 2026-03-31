// Datos de checklist por SISTEMA/EQUIPO
export const checklistPorSistema = {
    // Sistemas Eléctricos
    'tablero-media-tension': {
        nombre: 'Tablero de Media Tensión',
        tipo: 'electrical',
        items: [
            { id: 'MT-001', item: 'Verificación de fijación y nivelación del tablero', norm: 'NOM-001-SEDE-2012', critical: true },
            { id: 'MT-002', item: 'Verificación de espacio de trabajo (frente, laterales, posterior)', norm: 'NOM-001-SEDE-2012', critical: true },
            { id: 'MT-003', item: 'Identificación de circuitos en puerta y en interiores', norm: 'NOM-001-SEDE-2012', critical: false },
            { id: 'MT-004', item: 'Prueba de continuidad y aislamiento (megger)', norm: 'IEEE 43', critical: true }
        ]
    },
    'tablero-baja-tension': {
        nombre: 'Tablero de Baja Tensión',
        tipo: 'electrical',
        items: [
            { id: 'BT-001', item: 'Verificación de fijación y nivelación', norm: 'NOM-001-SEDE-2012', critical: true },
            { id: 'BT-002', item: 'Verificación de protecciones termomagnéticas', norm: 'NOM-001-SEDE-2012', critical: true },
            { id: 'BT-003', item: 'Prueba de funcionamiento de contactores', norm: 'IEC 60947', critical: true }
        ]
    },
    'motor-electrico': {
        nombre: 'Motor Eléctrico',
        tipo: 'electrical',
        items: [
            { id: 'MTR-001', item: 'Verificación de alineación motor-carga', norm: 'NEMA MG-1', critical: true },
            { id: 'MTR-002', item: 'Medición de resistencia de aislamiento', norm: 'IEEE 43', critical: true },
            { id: 'MTR-003', item: 'Verificación de dirección de giro', norm: 'NEMA MG-1', critical: true }
        ]
    },
    'vfd-variador': {
        nombre: 'Variador de Frecuencia (VFD)',
        tipo: 'electrical',
        items: [
            { id: 'VFD-001', item: 'Verificación de parámetros de configuración', norm: 'Fabricante', critical: true },
            { id: 'VFD-002', item: 'Prueba de arranque y paro local/remoto', norm: 'Fabricante', critical: true },
            { id: 'VFD-003', item: 'Verificación de señales de control', norm: 'Fabricante', critical: true }
        ]
    },
    
    // Sistemas de Instrumentación
    'transmisor-presion': {
        nombre: 'Transmisor de Presión',
        tipo: 'instrumentation',
        items: [
            { id: 'TP-001', item: 'Verificación de rango y configuración', norm: 'API 551', critical: true },
            { id: 'TP-002', item: 'Prueba de calibración', norm: 'API 551', critical: true },
            { id: 'TP-003', item: 'Verificación de conexión a manifold', norm: 'API 551', critical: true }
        ]
    },
    'transmisor-temperatura': {
        nombre: 'Transmisor de Temperatura',
        tipo: 'instrumentation',
        items: [
            { id: 'TT-001', item: 'Verificación de tipo de sensor (RTD/TC)', norm: 'IEC 60751', critical: true },
            { id: 'TT-002', item: 'Prueba de calibración', norm: 'IEC 60751', critical: true },
            { id: 'TT-003', item: 'Verificación de termopozo', norm: 'ASME PTC 19.3', critical: false }
        ]
    },
    'valvula-control': {
        nombre: 'Válvula de Control',
        tipo: 'instrumentation',
        items: [
            { id: 'VC-001', item: 'Verificación de posición y sentido actuación (FO/FC)', norm: 'ISA-75', critical: true },
            { id: 'VC-002', item: 'Prueba de calibración de posicionador', norm: 'ISA-75', critical: true },
            { id: 'VC-003', item: 'Verificación de suministro de aire', norm: 'ISA-75', critical: true }
        ]
    },
    'plc-dcs': {
        nombre: 'PLC/DCS',
        tipo: 'instrumentation',
        items: [
            { id: 'PLC-001', item: 'Verificación de módulos I/O', norm: 'IEC 61131', critical: true },
            { id: 'PLC-002', item: 'Prueba de fuerza de señales (forcing)', norm: 'IEC 61131', critical: true },
            { id: 'PLC-003', item: 'Verificación de alarmas en HMI/SCADA', norm: 'IEC 61131', critical: true }
        ]
    }
};

// Etapas del proyecto
export const etapasProyecto = [
    { id: 'pre-comisionamiento', nombre: 'Pre-comisionamiento', orden: 1 },
    { id: 'comisionamiento-frio', nombre: 'Comisionamiento en Frío', orden: 2 },
    { id: 'comisionamiento-caliente', nombre: 'Comisionamiento en Caliente', orden: 3 },
    { id: 'pruebas-funcionales', nombre: 'Pruebas Funcionales', orden: 4 },
    { id: 'aceptacion', nombre: 'Aceptación y Entrega', orden: 5 }
];

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
