// ============================================
// PROYECTOS - Gestión de proyectos y asignación de checklists
// ============================================

import { getSystemById } from './checklists-base.js';

let proyectos = [];
let currentProjectId = null;

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
            // Checklists asignados a este proyecto
            checklistsAsignados: [
                { systemId: 'tablero-media-tension', cantidad: 2, identificadores: ['MT-01', 'MT-02'], proveedorAsignado: null },
                { systemId: 'tablero-baja-tension', cantidad: 3, identificadores: ['BT-01', 'BT-02', 'BT-03'], proveedorAsignado: null },
                { systemId: 'motor-electrico', cantidad: 4, identificadores: ['MTR-101', 'MTR-102', 'MTR-103', 'MTR-104'], proveedorAsignado: null },
                { systemId: 'transmisor-presion', cantidad: 5, identificadores: ['PT-101', 'PT-102', 'PT-103', 'PT-104', 'PT-105'], proveedorAsignado: null }
            ]
        }];
    }
    
    const savedCurrent = localStorage.getItem('currentProjectId');
    if (savedCurrent) {
        currentProjectId = savedCurrent;
    } else if (proyectos.length > 0) {
        currentProjectId = proyectos[0].id;
    }
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

// Actualizar proyecto
export function updateProyecto(proyectoId, updates) {
    const index = proyectos.findIndex(p => p.id === proyectoId);
    if (index !== -1) {
        proyectos[index] = { ...proyectos[index], ...updates };
        saveProyectos();
        return proyectos[index];
    }
    return null;
}

// Eliminar proyecto
export function deleteProyecto(proyectoId) {
    if (proyectos.length === 1) return false;
    proyectos = proyectos.filter(p => p.id !== proyectoId);
    if (currentProjectId === proyectoId) {
        currentProjectId = proyectos[0]?.id;
    }
    saveProyectos();
    return true;
}

// Asignar checklist a proyecto
export function asignarChecklistAProyecto(proyectoId, systemId, cantidad, identificadores = [], proveedorId = null) {
    const proyecto = proyectos.find(p => p.id === proyectoId);
    if (proyecto) {
        proyecto.checklistsAsignados.push({
            systemId,
            cantidad,
            identificadores,
            proveedorAsignado: proveedorId,
            estado: 'pendiente' // pendiente, en-progreso, completado
        });
        saveProyectos();
        return proyecto;
    }
    return null;
}

// Generar archivo para proveedor (solo los checklists que le corresponden)
export function generarArchivoParaProveedor(proyectoId, proveedorId, proveedorData) {
    const proyecto = proyectos.find(p => p.id === proyectoId);
    if (!proyecto) return null;
    
    // Filtrar checklists asignados a este proveedor
    const checklistsProveedor = proyecto.checklistsAsignados.filter(c => c.proveedorAsignado === proveedorId);
    
    // Para cada checklist, obtener los items base
    const checklistsCompletos = checklistsProveedor.map(c => {
        const sistemaBase = getSystemById(c.systemId);
        if (!sistemaBase) return null;
        
        return {
            sistema: sistemaBase,
            cantidad: c.cantidad,
            identificadores: c.identificadores,
            items: sistemaBase.items.map(item => ({
                ...item,
                completed: false,
                notes: ''
            }))
        };
    }).filter(c => c !== null);
    
    return {
        metadata: {
            version: "2.0",
            type: "proveedor-config",
            generatedAt: new Date().toISOString(),
            generatedBy: "Contratista General",
            proyectoId: proyectoId,
            proyectoNombre: proyecto.name
        },
        proveedor: proveedorData,
        checklists: checklistsCompletos
    };
}

export default {
    loadProyectos,
    saveProyectos,
    getAllProyectos,
    getCurrentProject,
    createProyecto,
    updateProyecto,
    deleteProyecto,
    asignarChecklistAProyecto,
    generarArchivoParaProveedor
};
