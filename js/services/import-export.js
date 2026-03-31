// ============================================
// IMPORT/EXPORT SERVICE
// Importación y exportación de datos entre contratistas
// Con acumulación de reportes
// ============================================

import { createLogger } from '../core/logger.js';
import { initStorage, saveSetting, getSetting } from '../core/storage.js';
import { electricalChecklistItems, instrumentationChecklistItems } from '../features/checklist/items-data.js';

const log = createLogger('ImportExport');

class ImportExportService {
    constructor() {
        this.supportedFormats = ['json', 'csv'];
        this.accumulatedReports = []; // Reportes acumulados de subcontratistas
    }
    
    async init() {
        await initStorage();
        await this.loadAccumulatedReports();
    }
    
    // ============================================
    // ACUMULACIÓN DE REPORTES
    // ============================================
    
    async loadAccumulatedReports() {
        const saved = await getSetting('accumulatedReports');
        if (saved) {
            this.accumulatedReports = JSON.parse(saved);
            log.info(`Cargados ${this.accumulatedReports.length} reportes acumulados`);
        }
    }
    
    async saveAccumulatedReports() {
        await saveSetting('accumulatedReports', JSON.stringify(this.accumulatedReports));
    }
    
    async addContractorReport(report) {
        // Verificar si ya existe reporte de este contratista
        const existingIndex = this.accumulatedReports.findIndex(
            r => r.contractor.id === report.contractor.id
        );
        
        if (existingIndex !== -1) {
            // Actualizar existente
            this.accumulatedReports[existingIndex] = {
                ...this.accumulatedReports[existingIndex],
                ...report,
                updatedAt: new Date().toISOString(),
                previousVersions: [
                    ...(this.accumulatedReports[existingIndex].previousVersions || []),
                    this.accumulatedReports[existingIndex]
                ]
            };
            log.info(`Reporte actualizado para: ${report.contractor.name}`);
        } else {
            // Nuevo contratista
            this.accumulatedReports.push({
                ...report,
                importedAt: new Date().toISOString(),
                previousVersions: []
            });
            log.info(`Nuevo reporte agregado: ${report.contractor.name}`);
        }
        
        await this.saveAccumulatedReports();
        return this.accumulatedReports;
    }
    
    getAccumulatedReports() {
        return this.accumulatedReports;
    }
    
    getConsolidatedProgress() {
        const consolidated = {
            electrical: { completed: 0, total: 0, percent: 0 },
            instrumentation: { completed: 0, total: 0, percent: 0 },
            contractors: [],
            overall: { completed: 0, total: 0, percent: 0 }
        };
        
        for (const report of this.accumulatedReports) {
            // Sumar progreso por disciplina
            if (report.progress) {
                if (report.progress.electrical) {
                    consolidated.electrical.completed += report.progress.electrical.completed || 0;
                    consolidated.electrical.total += report.progress.electrical.total || 0;
                }
                if (report.progress.instrumentation) {
                    consolidated.instrumentation.completed += report.progress.instrumentation.completed || 0;
                    consolidated.instrumentation.total += report.progress.instrumentation.total || 0;
                }
            }
            
            // Guardar info del contratista
            consolidated.contractors.push({
                id: report.contractor.id,
                name: report.contractor.name,
                discipline: report.contractor.discipline,
                progress: report.progress,
                lastUpdate: report.updatedAt || report.importedAt,
                licenseKey: report.contractor.licenseKey
            });
        }
        
        // Calcular porcentajes
        consolidated.electrical.percent = consolidated.electrical.total > 0 
            ? Math.round((consolidated.electrical.completed / consolidated.electrical.total) * 100) : 0;
        consolidated.instrumentation.percent = consolidated.instrumentation.total > 0 
            ? Math.round((consolidated.instrumentation.completed / consolidated.instrumentation.total) * 100) : 0;
        
        const totalCompleted = consolidated.electrical.completed + consolidated.instrumentation.completed;
        const totalItems = consolidated.electrical.total + consolidated.instrumentation.total;
        consolidated.overall.percent = totalItems > 0 ? Math.round((totalCompleted / totalItems) * 100) : 0;
        consolidated.overall.completed = totalCompleted;
        consolidated.overall.total = totalItems;
        
        return consolidated;
    }
    
    // ============================================
    // EXPORTACIÓN PARA CONTRATISTA GENERAL
    // ============================================
    
    async exportConsolidatedReport(options = {}) {
        const {
            format = 'json',
            filename = `consolidado-${Date.now()}.${format}`,
            includeDetails = true
        } = options;
        
        const consolidated = this.getConsolidatedProgress();
        const reports = this.accumulatedReports;
        
        const exportData = {
            metadata: {
                version: '1.0',
                exportedAt: new Date().toISOString(),
                type: 'consolidated',
                totalContractors: reports.length,
                totalItems: consolidated.overall.total,
                totalCompleted: consolidated.overall.completed,
                overallProgress: consolidated.overall.percent
            },
            consolidatedProgress: consolidated,
            reports: includeDetails ? reports : reports.map(r => ({
                contractor: {
                    id: r.contractor.id,
                    name: r.contractor.name,
                    discipline: r.contractor.discipline
                },
                progress: r.progress,
                lastUpdate: r.updatedAt || r.importedAt
            }))
        };
        
        switch (format) {
            case 'json':
                return this.downloadJSON(exportData, filename);
            case 'csv':
                return this.downloadCSV(exportData, filename);
            default:
                throw new Error(`Formato no soportado: ${format}`);
        }
    }
    
    downloadJSON(data, filename) {
        const jsonStr = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        this.downloadBlob(blob, filename);
        log.info('JSON exportado', { filename });
        return true;
    }
    
    downloadCSV(data, filename) {
        const rows = [['Contratista', 'Disciplina', 'Items Totales', 'Completados', 'Progreso (%)', 'Última Actualización']];
        
        for (const report of data.reports || []) {
            const progress = report.progress?.overall?.percent || 
                             report.progress?.electrical?.percent || 0;
            const total = report.progress?.overall?.total || 
                          report.progress?.electrical?.total || 0;
            const completed = report.progress?.overall?.completed || 
                             report.progress?.electrical?.completed || 0;
            
            rows.push([
                `"${report.contractor.name}"`,
                report.contractor.discipline === 'electrical' ? 'Eléctrico' : 'Instrumentación',
                total,
                completed,
                progress,
                report.lastUpdate
            ]);
        }
        
        const csvContent = rows.map(row => row.join(',')).join('\n');
        const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
        this.downloadBlob(blob, filename);
        return true;
    }
    
    downloadBlob(blob, filename) {
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
    
    // ============================================
    // IMPORTACIÓN DE REPORTE DE SUBCONTRATISTA
    // ============================================
    
    async importSubcontractorReport(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = async (e) => {
                try {
                    const content = e.target.result;
                    let data;
                    
                    if (file.name.endsWith('.json')) {
                        data = JSON.parse(content);
                    } else {
                        reject(new Error('Formato no soportado. Use JSON'));
                        return;
                    }
                    
                    // Validar estructura
                    if (!data.contractor) {
                        reject(new Error('Archivo inválido: no contiene datos de contratista'));
                        return;
                    }
                    
                    if (!data.contractor.licenseKey) {
                        reject(new Error('Archivo inválido: no contiene clave de licencia'));
                        return;
                    }
                    
                    // Calcular progreso del reporte
                    const progress = this.calculateProgress(data.checklist || {});
                    
                    const report = {
                        contractor: {
                            id: data.contractor.id,
                            name: data.contractor.name,
                            discipline: data.contractor.discipline,
                            licenseKey: data.contractor.licenseKey,
                            contactName: data.contractor.contactName,
                            contactEmail: data.contractor.contactEmail
                        },
                        checklist: data.checklist,
                        progress: progress,
                        importedAt: new Date().toISOString()
                    };
                    
                    // Acumular reporte
                    await this.addContractorReport(report);
                    
                    resolve({
                        success: true,
                        contractor: report.contractor,
                        progress: progress,
                        message: `Reporte de ${report.contractor.name} importado correctamente`
                    });
                    
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = () => reject(new Error('Error al leer el archivo'));
            reader.readAsText(file, 'UTF-8');
        });
    }
    
    calculateProgress(checklist) {
        const progress = {
            electrical: { completed: 0, total: 0, percent: 0 },
            instrumentation: { completed: 0, total: 0, percent: 0 },
            overall: { completed: 0, total: 0, percent: 0 }
        };
        
        // Calcular eléctrico
        if (checklist.electrical && checklist.electrical.length > 0) {
            progress.electrical.total = checklist.electrical.length;
            progress.electrical.completed = checklist.electrical.filter(i => i.completed).length;
            progress.electrical.percent = Math.round((progress.electrical.completed / progress.electrical.total) * 100);
        }
        
        // Calcular instrumentación
        if (checklist.instrumentation && checklist.instrumentation.length > 0) {
            progress.instrumentation.total = checklist.instrumentation.length;
            progress.instrumentation.completed = checklist.instrumentation.filter(i => i.completed).length;
            progress.instrumentation.percent = Math.round((progress.instrumentation.completed / progress.instrumentation.total) * 100);
        }
        
        // Calcular general
        progress.overall.total = progress.electrical.total + progress.instrumentation.total;
        progress.overall.completed = progress.electrical.completed + progress.instrumentation.completed;
        progress.overall.percent = progress.overall.total > 0 
            ? Math.round((progress.overall.completed / progress.overall.total) * 100) : 0;
        
        return progress;
    }
    
    // ============================================
    // GENERACIÓN DE ARCHIVO PARA SUBCONTRATISTA
    // ============================================
    
    generateSubcontractorFile(contractorData) {
        // Crear archivo con solo los items que le corresponden al subcontratista
        const fileData = {
            metadata: {
                version: '1.0',
                generatedAt: new Date().toISOString(),
                generatedBy: 'Comisionamiento PWA',
                instructions: 'Complete los items marcados como pendientes y devuelva este archivo'
            },
            contractor: {
                id: contractorData.id,
                name: contractorData.name,
                discipline: contractorData.discipline,
                licenseKey: contractorData.licenseKey,
                companyId: contractorData.companyId,
                contactName: contractorData.contactName,
                contactEmail: contractorData.contactEmail
            },
            checklist: {}
        };
        
        // Filtrar solo items de su disciplina
        if (contractorData.discipline === 'electrical') {
            fileData.checklist.electrical = electricalChecklistItems.map(item => ({
                ...item,
                completed: false,
                notes: '',
                category: 'electrical'
            }));
        } else if (contractorData.discipline === 'instrumentation') {
            fileData.checklist.instrumentation = instrumentationChecklistItems.map(item => ({
                ...item,
                completed: false,
                notes: '',
                category: 'instrumentation'
            }));
        } else {
            // Ambas disciplinas
            fileData.checklist.electrical = electricalChecklistItems.map(item => ({
                ...item,
                completed: false,
                notes: '',
                category: 'electrical'
            }));
            fileData.checklist.instrumentation = instrumentationChecklistItems.map(item => ({
                ...item,
                completed: false,
                notes: '',
                category: 'instrumentation'
            }));
        }
        
        return fileData;
    }
    
    // ============================================
    // GENERACIÓN DE LICENCIAS
    // ============================================
    
    generateLicenseKey(companyId, contractorId) {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        const hash = this.simpleHash(`${companyId}-${contractorId}-${timestamp}`);
        return `COM-${hash}-${random}`;
    }
    
    generateContractorId() {
        return `CTR-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    }
    
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash |= 0;
        }
        return Math.abs(hash).toString(36).toUpperCase().substring(0, 6);
    }
    
    validateLicense(licenseKey, expectedKey) {
        return licenseKey === expectedKey;
    }
    
    // ============================================
    // ELIMINAR CONTRATISTA
    // ============================================
    
    async removeContractor(contractorId) {
        this.accumulatedReports = this.accumulatedReports.filter(r => r.contractor.id !== contractorId);
        await this.saveAccumulatedReports();
        log.info(`Contratista eliminado: ${contractorId}`);
        return true;
    }
    
    async clearAllReports() {
        this.accumulatedReports = [];
        await this.saveAccumulatedReports();
        log.info('Todos los reportes eliminados');
    }
}

export const importExportService = new ImportExportService();
export default importExportService;
