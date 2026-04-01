// ============================================
// PROYECTOS - Gestión de proyectos y proveedores
// ============================================

import { getSystemById } from './checklists-base.js';

let proyectos = [];
let proveedores = []; // Lista de proveedores registrados con sus IDs y Licencias
let currentProjectId = null;

// ============================================
// GESTIÓN DE PROVEEDORES (con ID y Licencia)
// ============================================

// Cargar proveedores guardados
export function loadProveedores() {
    const saved = localStorage.getItem('proveedores');
    if (saved) {
        proveedores = JSON.parse(saved);
    }
}

// Guardar proveedores
export function saveProveedores() {
    localStorage.setItem('proveedores', JSON.stringify(proveedores));
}

// Registrar un nuevo proveedor (el cliente lo hace)
export function registrarProveedor(proveedorData) {
    // Generar ID y Licencia únicos
    const id = `CTR-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const licencia = `COM-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    
    const nuevoProveedor = {
        id: id,
        licencia: licencia,
        ...proveedorData,
        activo: true,
        fechaRegistro: new Date().toISOString()
    };
    
    proveedores.push(nuevoProveedor);
    saveProveedores();
    
    return nuevoProveedor;
}

// Validar ID y Licencia de un proveedor
export function validarProveedor(id, licencia) {
    const proveedor = proveedores.find(p => p.id === id && p.licencia === licencia);
    if (proveedor && proveedor.activo) {
        return { valido: true, proveedor };
    }
    return { valido: false, error: 'ID o Licencia inválidos' };
}

// Obtener proveedor por ID
export function getProveedorById(id) {
    return proveedores.find(p => p.id === id);
}

// Desactivar proveedor
export function desactivarProveedor(id) {
    const proveedor = proveedores.find(p => p.id === id);
    if (proveedor) {
        proveedor.activo = false;
        saveProveedores();
        return true;
    }
    return false;
}

// Obtener todos los proveedores
export function getAllProveedores() {
    return [...proveedores];
}

// ============================================
// VALIDAR ARCHIVO DE PROVEEDOR (ÚNICA DEFINICIÓN)
// ============================================

export function validarArchivoProveedor(archivoData) {
    // Verificar estructura básica
    if (!archivoData.validacion || !archivoData.proveedor) {
        return { valido: false, error: 'Archivo no válido: falta información de validación' };
    }
    
    const { proveedorId, licencia } = archivoData.validacion;
    
    // Validar contra la base de datos de proveedores
    const resultado = validarProveedor(proveedorId, licencia);
    
    if (!resultado.valido) {
        return { valido: false, error: 'ID o Licencia inválidos. Contacte al contratista general.' };
    }
    
    // Verificar que el proveedor coincide con los datos
    if (resultado.proveedor.nombre !== archivoData.proveedor.nombre) {
        return { valido: false, error: 'Los datos del proveedor no coinciden con los registrados' };
    }
    
    return { 
        valido: true, 
        proveedor: resultado.proveedor,
        proyecto: archivoData.proyecto || null,
        checklists: archivoData.checklists || []
    };
}

// ============================================
// GESTIÓN DE PROYECTOS
// ============================================

// Cargar proyectos guardados
export function loadProyectos() {
    const saved = localStorage.getItem('proyectos');
    if (saved) {
        proyectos = JSON.parse(saved);
    } else {
        // Proyecto de ejemplo
        proyectos = [{
            id: 'proj-001',
            name: 'Planta Industrial Norte',
            clientName: 'Industrias XYZ',
            projectCode: 'PIN-2024',
            location: 'Querétaro, QRO',
            createdAt: new Date().toISOString(),
            checklistsAsignados: [
                { 
                    systemId: 'tablero-media-tension', 
                    cantidad: 2, 
                    identificadores: ['MT-01', 'MT-02'], 
                    proveedorAsignado: null,
                    estado: 'pendiente'
                },
                { 
                    systemId: 'tablero-baja-tension', 
                    cantidad: 3, 
                    identificadores: ['BT-01', 'BT-02', 'BT-03'], 
                    proveedorAsignado: null,
                    estado: 'pendiente'
                }
            ]
        }];
    }
    
    const savedCurrent = localStorage.getItem('currentProjectId');
    if (savedCurrent) {
        currentProjectId = savedCurrent;
    } else if (proyectos.length > 0) {
        currentProjectId = proyectos[0].id;
    }
    
    loadProveedores();
}

export function saveProyectos() {
    localStorage.setItem('proyectos', JSON.stringify(proyectos));
    localStorage.setItem('currentProjectId', currentProjectId);
}

// Obtener todos los proyectos
export function getAllProyectos() {
    return [...proyectos];
}

// Obtener proyecto actual
export function getCurrentProject() {
    return proyectos.find(p => p.id === currentProjectId);
}

// Crear nuevo proyecto
export function createProyecto(proyectoData) {
    const newProyecto = {
        id: `proj-${Date.now()}`,
        ...proyectoData,
        createdAt: new Date().toISOString(),
        checklistsAsignados: proyectoData.checklistsAsignados || []
    };
    proyectos.push(newProyecto);
    saveProyectos();
    return newProyecto;
}

// Asignar checklist a proyecto con proveedor específico
export function asignarChecklistAProyecto(proyectoId, systemId, cantidad, identificadores = [], proveedorId = null) {
    const proyecto = proyectos.find(p => p.id === proyectoId);
    if (proyecto) {
        proyecto.checklistsAsignados.push({
            systemId,
            cantidad,
            identificadores,
            proveedorAsignado: proveedorId,
            estado: 'pendiente'
        });
        saveProyectos();
        return proyecto;
    }
    return null;
}

// ============================================
// GENERAR ARCHIVO PARA PROVEEDOR CON VALIDACIÓN
// ============================================

export function generarArchivoParaProveedor(proyectoId, proveedorId, proveedorData) {
    const proyecto = proyectos.find(p => p.id === proyectoId);
    if (!proyecto) return null;
    
    // Verificar que el proveedor existe y está activo
    const proveedor = getProveedorById(proveedorId);
    if (!proveedor || !proveedor.activo) {
        return { error: 'Proveedor no válido o inactivo' };
    }
    
    // Filtrar checklists asignados a este proveedor
    const checklistsProveedor = proyecto.checklistsAsignados.filter(c => c.proveedorAsignado === proveedorId);
    
    if (checklistsProveedor.length === 0) {
        return { error: 'No hay checklists asignados a este proveedor' };
    }
    
    // Para cada checklist, obtener los items base
    const checklistsCompletos = checklistsProveedor.map(c => {
        const sistemaBase = getSystemById(c.systemId);
        if (!sistemaBase) return null;
        
        return {
            systemId: c.systemId,
            systemNombre: sistemaBase.nombre,
            cantidad: c.cantidad,
            identificadores: c.identificadores,
            itemsBase: sistemaBase.items.map(item => ({
                ...item,
                completed: false,
                notes: ''
            }))
        };
    }).filter(c => c !== null);
    
    // Archivo con ID y Licencia para validación
    return {
        metadata: {
            version: "2.0",
            type: "proveedor-config",
            generatedAt: new Date().toISOString(),
            generatedBy: "Contratista General",
            proyectoId: proyectoId,
            proyectoNombre: proyecto.name
        },
        validacion: {
            proveedorId: proveedor.id,
            licencia: proveedor.licencia,
            checksum: btoa(`${proveedor.id}:${proveedor.licencia}:${proyectoId}`)
        },
        proveedor: {
            id: proveedor.id,
            nombre: proveedor.nombre,
            contacto: proveedor.contacto || '',
            email: proveedor.email || '',
            telefono: proveedor.telefono || ''
        },
        proyecto: {
            id: proyecto.id,
            nombre: proyecto.name,
            cliente: proyecto.clientName
        },
        checklists: checklistsCompletos
    };
}

// ============================================
// IMPORTAR REPORTE DEL PROVEEDOR (con validación)
// ============================================

export function importarReporteProveedor(reporteData) {
    // Validar que el reporte tiene ID y Licencia del proveedor
    if (!reporteData.proveedor || !reporteData.proveedor.id || !reporteData.proveedor.licencia) {
        return { success: false, error: 'El reporte no contiene identificación de proveedor' };
    }
    
    // Validar que el proveedor existe
    const resultado = validarProveedor(reporteData.proveedor.id, reporteData.proveedor.licencia);
    
    if (!resultado.valido) {
        return { success: false, error: 'Proveedor no autorizado. ID o Licencia incorrectos.' };
    }
    
    // Verificar que el proyecto existe
    const proyecto = proyectos.find(p => p.id === reporteData.proyecto?.id);
    if (!proyecto) {
        return { success: false, error: 'El proyecto no existe en el sistema' };
    }
    
    // Registrar el reporte
    const registroReporte = {
        id: `REP-${Date.now()}`,
        proveedorId: reporteData.proveedor.id,
        proyectoId: reporteData.proyecto.id,
        etapa: reporteData.etapa,
        sistema: reporteData.sistema,
        fecha: new Date().toISOString(),
        estadisticas: reporteData.estadisticas,
        isProrroga: reporteData.metadata?.isProrroga || false,
        prorrogaMotivo: reporteData.metadata?.prorrogaMotivo || null
    };
    
    // Guardar reporte
    const reportesGuardados = JSON.parse(localStorage.getItem('reportes') || '[]');
    reportesGuardados.push(registroReporte);
    localStorage.setItem('reportes', JSON.stringify(reportesGuardados));
    
    return { 
        success: true, 
        message: `Reporte importado de ${resultado.proveedor.nombre}`,
        reporte: registroReporte
    };
}

export default {
    // Proveedores
    loadProveedores,
    saveProveedores,
    registrarProveedor,
    validarProveedor,
    getProveedorById,
    desactivarProveedor,
    getAllProveedores,
    // Proyectos
    loadProyectos,
    saveProyectos,
    getAllProyectos,
    getCurrentProject,
    createProyecto,
    asignarChecklistAProyecto,
    generarArchivoParaProveedor,
    validarArchivoProveedor,
    importarReporteProveedor
};
