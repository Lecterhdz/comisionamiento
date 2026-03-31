// ============================================
// REPORT MANAGER
// Gestión de reportes por etapa, sistema y proveedor
// ============================================

import { initStorage, saveSetting, getSetting } from '../core/storage.js';
import { createLogger } from '../core/logger.js';
import { etapasProyecto } from '../features/checklist/items-data.js';

const log = createLogger('ReportManager');

class ReportManager {
    constructor() {
        this.reports = []; // Todos los reportes recibidos
        this.proveedores = []; // Proveedores registrados
        this.proyectos = []; // Proyectos
    }
    
    async init() {
        await initStorage();
        await this.loadData();
        log.info(`ReportManager inicializado, ${this.reports.length} reportes cargados`);
    }
    
    async loadData() {
        const savedReports = await getSetting('reports');
        if (savedReports) {
            this.reports = JSON.parse(savedReports);
        }
        
        const savedProveedores = await getSetting('proveedores');
        if (savedProveedores) {
            this.proveedores = JSON.parse(savedProveedores);
        }
        
        const savedProyectos = await getSetting('proyectos');
        if (savedProyectos) {
            this.proyectos = JSON.parse(savedProyectos);
        }
    }
    
    async saveData() {
        await saveSetting('reports', JSON.stringify(this.reports));
        await saveSetting('proveedores', JSON.stringify(this.proveedores));
        await saveSetting('proyectos', JSON.stringify(this.proyectos));
    }
    
    // ============================================
    // IMPORTAR REPORTE DE PROVEEDOR
    // ============================================
    
    async importReport(reportData) {
        // Validar estructura
        if (!this.validateReport(reportData)) {
            throw new Error('Estructura de reporte inválida');
        }
        
        // Verificar si es una prórroga
        const isProrroga = reportData.metadata?.isProrroga || false;
        
        // Crear registro del reporte
        const reportRecord = {
            id: reportData.metadata?.reportId || this.generateReportId(),
            importadoEn: new Date().toISOString(),
            datos: reportData,
            isProrroga: isProrroga,
            prorrogaMotivo: reportData.metadata?.prorrogaMotivo || null
        };
        
        // Agregar a la lista
        this.reports.push(reportRecord);
        
        // Actualizar o crear proveedor
        await this.updateProveedor(reportData.proveedor);
        
        // Actualizar o crear proyecto
        await this.updateProyecto(reportData.proyecto);
        
        await this.saveData();
        
        log.info(`Reporte importado: ${reportRecord.id} - ${reportData.proveedor.nombre}`);
        
        return {
            success: true,
            reportId: reportRecord.id,
            isProrroga: isProrroga,
            message: isProrroga ? 'Reporte con prórroga importado' : 'Reporte importado correctamente'
        };
    }
    
    validateReport(data) {
        // Validaciones básicas
        if (!data.proyecto?.id) return false;
        if (!data.proveedor?.id) return false;
        if (!data.etapa?.id) return false;
        if (!data.sistema?.id) return false;
        if (!data.checklist) return false;
        
        return true;
    }
    
    generateReportId() {
        return `RPT-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    }
    
    async updateProveedor(proveedorData) {
        const existingIndex = this.proveedores.findIndex(p => p.id === proveedorData.id);
        
        if (existingIndex !== -1) {
            this.proveedores[existingIndex] = {
                ...this.proveedores[existingIndex],
                ...proveedorData,
                ultimoReporte: new Date().toISOString()
            };
        } else {
            this.proveedores.push({
                ...proveedorData,
                primerReporte: new Date().toISOString(),
                ultimoReporte: new Date().toISOString()
            });
        }
    }
    
    async updateProyecto(proyectoData) {
        const existingIndex = this.proyectos.findIndex(p => p.id === proyectoData.id);
        
        if (existingIndex !== -1) {
            this.proyectos[existingIndex] = {
                ...this.proyectos[existingIndex],
                ...proyectoData,
                ultimaActualizacion: new Date().toISOString()
            };
        } else {
            this.proyectos.push({
                ...proyectoData,
                creadoEn: new Date().toISOString(),
                ultimaActualizacion: new Date().toISOString()
            });
        }
    }
    
    // ============================================
    // CONSULTAS Y REPORTES
    // ============================================
    
    getProgresoConsolidado(proyectoId = null) {
        let reports = this.reports;
        
        if (proyectoId) {
            reports = reports.filter(r => r.datos.proyecto.id === proyectoId);
        }
        
        // Agrupar por proveedor
        const porProveedor = {};
        const porEtapa = {};
        const porSistema = {};
        
        for (const report of reports) {
            const datos = report.datos;
            const proveedorId = datos.proveedor.id;
            const etapaId = datos.etapa.id;
            const sistemaId = datos.sistema.id;
            
            // Por proveedor
            if (!porProveedor[proveedorId]) {
                porProveedor[proveedorId] = {
                    proveedor: datos.proveedor,
                    etapas: {},
                    sistemas: {},
                    totalItems: 0,
                    completados: 0,
                    reportes: []
                };
            }
            
            // Acumular estadísticas
            const stats = datos.estadisticas;
            porProveedor[proveedorId].totalItems += stats.totalItems;
            porProveedor[proveedorId].completados += stats.completados;
            porProveedor[proveedorId].reportes.push({
                etapa: datos.etapa,
                sistema: datos.sistema,
                fecha: report.importadoEn,
                porcentaje: stats.porcentaje,
                isProrroga: report.isProrroga
            });
            
            // Por etapa
            if (!porEtapa[etapaId]) {
                porEtapa[etapaId] = {
                    etapa: datos.etapa,
                    sistemas: {},
                    totalItems: 0,
                    completados: 0
                };
            }
            porEtapa[etapaId].totalItems += stats.totalItems;
            porEtapa[etapaId].completados += stats.completados;
            
            // Por sistema
            if (!porSistema[sistemaId]) {
                porSistema[sistemaId] = {
                    sistema: datos.sistema,
                    etapas: {},
                    totalItems: 0,
                    completados: 0
                };
            }
            porSistema[sistemaId].totalItems += stats.totalItems;
            porSistema[sistemaId].completados += stats.completados;
        }
        
        // Calcular porcentajes
        for (const [id, data] of Object.entries(porProveedor)) {
            data.porcentaje = data.totalItems > 0 
                ? Math.round((data.completados / data.totalItems) * 100) : 0;
        }
        
        for (const [id, data] of Object.entries(porEtapa)) {
            data.porcentaje = data.totalItems > 0 
                ? Math.round((data.completados / data.totalItems) * 100) : 0;
        }
        
        for (const [id, data] of Object.entries(porSistema)) {
            data.porcentaje = data.totalItems > 0 
                ? Math.round((data.completados / data.totalItems) * 100) : 0;
        }
        
        return {
            totalReportes: reports.length,
            proveedores: Object.values(porProveedor),
            etapas: Object.values(porEtapa),
            sistemas: Object.values(porSistema),
            prorrogas: reports.filter(r => r.isProrroga).length
        };
    }
    
    getReportesPorProveedor(proveedorId) {
        return this.reports
            .filter(r => r.datos.proveedor.id === proveedorId)
            .sort((a, b) => new Date(b.importadoEn) - new Date(a.importadoEn));
    }
    
    getReportesPorEtapa(etapaId) {
        return this.reports
            .filter(r => r.datos.etapa.id === etapaId)
            .sort((a, b) => new Date(b.importadoEn) - new Date(a.importadoEn));
    }
    
    getReportesProrroga() {
        return this.reports.filter(r => r.isProrroga);
    }
    
    getProveedores() {
        return this.proveedores;
    }
    
    getProyectos() {
        return this.proyectos;
    }
}

export const reportManager = new ReportManager();
export default reportManager;
