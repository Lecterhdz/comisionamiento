// Datos de checklist para instalaciones eléctricas industriales
export const electricalChecklistItems = [
    { id: 'elec-001', section: 'Tableros Eléctricos', item: 'Verificación de fijación y nivelación del tablero', norm: 'NOM-001-SEDE-2012', critical: true, completed: false, notes: '' },
    { id: 'elec-002', section: 'Tableros Eléctricos', item: 'Verificación de espacio de trabajo (frente, laterales, posterior)', norm: 'NOM-001-SEDE-2012', critical: true, completed: false, notes: '' },
    { id: 'elec-003', section: 'Tableros Eléctricos', item: 'Identificación de circuitos en puerta y en interiores', norm: 'NOM-001-SEDE-2012', critical: false, completed: false, notes: '' },
    { id: 'elec-004', section: 'Protecciones', item: 'Verificación de calibración de interruptores termomagnéticos', norm: 'NOM-001-SEDE-2012', critical: true, completed: false, notes: '' },
    { id: 'elec-005', section: 'Protecciones', item: 'Prueba de funcionamiento de relevadores de protección', norm: 'IEC 60255', critical: true, completed: false, notes: '' },
    { id: 'elec-006', section: 'Cableado', item: 'Verificación de calibre de conductores según diseño', norm: 'NOM-001-SEDE-2012', critical: true, completed: false, notes: '' },
    { id: 'elec-007', section: 'Cableado', item: 'Prueba de continuidad y aislamiento (megger)', norm: 'IEEE 43', critical: true, completed: false, notes: '' },
    { id: 'elec-008', section: 'Puesta a Tierra', item: 'Medición de resistencia de puesta a tierra', norm: 'IEEE 81', critical: true, completed: false, notes: '' }
];

export const instrumentationChecklistItems = [
    { id: 'inst-001', section: 'Transmisores de Presión', item: 'Verificación de rango y configuración del transmisor', norm: 'API 551', critical: true, completed: false, notes: '' },
    { id: 'inst-002', section: 'Transmisores de Presión', item: 'Prueba de calibración con multímetro y calibrador', norm: 'API 551', critical: true, completed: false, notes: '' },
    { id: 'inst-003', section: 'Transmisores de Temperatura', item: 'Verificación de tipo de sensor (RTD, TC) y configuración', norm: 'IEC 60751', critical: true, completed: false, notes: '' },
    { id: 'inst-004', section: 'Válvulas de Control', item: 'Verificación de posición y sentido de actuación (FO/FC)', norm: 'ISA-75', critical: true, completed: false, notes: '' },
    { id: 'inst-005', section: 'PLC/DCS', item: 'Verificación de módulos de entrada/salida (I/O check)', norm: 'IEC 61131', critical: true, completed: false, notes: '' }
];
