// ============================================
// EXPORT SERVICE
// Exportación a PDF y Excel con formato profesional
// ============================================

import { createLogger } from '../core/logger.js';
import { CONFIG } from '../core/config.js';
import { formatters } from '../utils/format.js';

const log = createLogger('ExportService');

class ExportService {
    constructor() {
        this.loaded = false;
        this.html2canvas = null;
        this.jspdf = null;
        this.XLSX = null;
    }
    
    async loadLibraries() {
        if (this.loaded) return;
        
        try {
            // Cargar librerías dinámicamente
            const [html2canvasModule, jspdfModule, xlsxModule] = await Promise.all([
                import('https://cdn.skypack.dev/html2canvas'),
                import('https://cdn.skypack.dev/jspdf'),
                import('https://cdn.skypack.dev/xlsx')
            ]);
            
            this.html2canvas = html2canvasModule.default;
            this.jspdf = jspdfModule.default;
            this.XLSX = xlsxModule;
            this.loaded = true;
            
            log.info('Librerías de exportación cargadas');
        } catch (error) {
            log.error('Error cargando librerías:', error);
            throw new Error('No se pudieron cargar las librerías de exportación');
        }
    }
    
    async exportToPDF(elementId, options = {}) {
        await this.loadLibraries();
        
        const element = document.getElementById(elementId);
        if (!element) {
            throw new Error(`Elemento ${elementId} no encontrado`);
        }
        
        const {
            filename = `reporte-${formatters.date(new Date(), 'iso')}.pdf`,
            title = 'Reporte de Comisionamiento',
            orientation = 'portrait',
            format = 'a4'
        } = options;
        
        log.info('Generando PDF...', { filename });
        
        // Capturar elemento como canvas
        const canvas = await this.html2canvas(element, {
            scale: 2,
            backgroundColor: '#ffffff',
            logging: false,
            useCORS: true
        });
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new this.jspdf({ orientation, format, unit: 'mm' });
        
        const imgWidth = orientation === 'portrait' ? 190 : 277;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
        pdf.save(filename);
        
        log.info('PDF generado correctamente');
        return true;
    }
    
    async exportToExcel(data, options = {}) {
        await this.loadLibraries();
        
        const {
            filename = `reporte-${formatters.date(new Date(), 'iso')}.xlsx`,
            sheetName = 'Reporte'
        } = options;
        
        const ws = this.XLSX.utils.json_to_sheet(data);
        const wb = this.XLSX.utils.book_new();
        this.XLSX.utils.book_append_sheet(wb, ws, sheetName);
        this.XLSX.writeFile(wb, filename);
        
        log.info('Excel generado correctamente', { filename });
        return true;
    }
    
    async exportToCSV(data, options = {}) {
        const {
            filename = `reporte-${formatters.date(new Date(), 'iso')}.csv`,
            delimiter = ','
        } = options;
        
        if (!data || data.length === 0) {
            throw new Error('No hay datos para exportar');
        }
        
        // Obtener headers
        const headers = Object.keys(data[0]);
        const csvRows = [];
        
        // Agregar headers
        csvRows.push(headers.join(delimiter));
        
        // Agregar filas
        for (const row of data) {
            const values = headers.map(header => {
                let value = row[header];
                if (value === undefined || value === null) value = '';
                if (typeof value === 'string' && (value.includes(delimiter) || value.includes('"'))) {
                    value = `"${value.replace(/"/g, '""')}"`;
                }
                return value;
            });
            csvRows.push(values.join(delimiter));
        }
        
        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        log.info('CSV generado correctamente', { filename });
        return true;
    }
    
    async exportChecklistToPDF(checklistData, projectData, options = {}) {
        await this.loadLibraries();
        
        // Crear contenido HTML para el reporte
        const reportHtml = this.generateChecklistReportHTML(checklistData, projectData);
        
        // Crear elemento temporal
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = reportHtml;
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        tempDiv.style.top = '-9999px';
        document.body.appendChild(tempDiv);
        
        // Generar PDF
        const result = await this.exportToPDF(null, {
            ...options,
            element: tempDiv
        });
        
        document.body.removeChild(tempDiv);
        return result;
    }
    
    generateChecklistReportHTML(checklistData, projectData) {
        const date = formatters.date(new Date(), 'datetime');
        
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Reporte de Comisionamiento</title>
                <style>
                    body {
                        font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
                        margin: 40px;
                        color: #1e293b;
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 40px;
                        border-bottom: 2px solid #3b82f6;
                        padding-bottom: 20px;
                    }
                    .logo-container {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 20px;
                    }
                    .logo {
                        max-width: 150px;
                        max-height: 80px;
                    }
                    .title {
                        font-size: 24px;
                        font-weight: bold;
                        color: #3b82f6;
                    }
                    .subtitle {
                        color: #64748b;
                        margin-top: 8px;
                    }
                    .project-info {
                        background: #f8fafc;
                        padding: 20px;
                        border-radius: 12px;
                        margin-bottom: 30px;
                    }
                    .info-grid {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 12px;
                    }
                    .info-item {
                        display: flex;
                        gap: 8px;
                    }
                    .info-label {
                        font-weight: 600;
                        color: #475569;
                    }
                    .info-value {
                        color: #1e293b;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 20px;
                    }
                    th, td {
                        border: 1px solid #e2e8f0;
                        padding: 12px;
                        text-align: left;
                    }
                    th {
                        background-color: #f1f5f9;
                        font-weight: 600;
                    }
                    .completed {
                        color: #10b981;
                    }
                    .pending {
                        color: #ef4444;
                    }
                    .summary {
                        margin-top: 30px;
                        padding: 20px;
                        background: #f1f5f9;
                        border-radius: 12px;
                    }
                    .footer {
                        margin-top: 40px;
                        text-align: center;
                        font-size: 12px;
                        color: #94a3b8;
                        border-top: 1px solid #e2e8f0;
                        padding-top: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="logo-container">
                        ${projectData.clientLogo ? `<img src="${projectData.clientLogo}" class="logo" alt="Logo Cliente">` : '<div></div>'}
                        ${projectData.userLogo ? `<img src="${projectData.userLogo}" class="logo" alt="Logo Usuario">` : '<div></div>'}
                    </div>
                    <div class="title">Reporte de Comisionamiento</div>
                    <div class="subtitle">Generado el ${date}</div>
                </div>
                
                <div class="project-info">
                    <h3>Información del Proyecto</h3>
                    <div class="info-grid">
                        <div class="info-item"><span class="info-label">Proyecto:</span><span class="info-value">${projectData.name || '-'}</span></div>
                        <div class="info-item"><span class="info-label">Cliente:</span><span class="info-value">${projectData.clientName || '-'}</span></div>
                        <div class="info-item"><span class="info-label">Código:</span><span class="info-value">${projectData.projectCode || '-'}</span></div>
                        <div class="info-item"><span class="info-label">Ubicación:</span><span class="info-value">${projectData.location || '-'}</span></div>
                        <div class="info-item"><span class="info-label">Fecha inicio:</span><span class="info-value">${projectData.startDate || '-'}</span></div>
                        <div class="info-item"><span class="info-label">Fecha fin:</span><span class="info-value">${projectData.endDate || '-'}</span></div>
                    </div>
                </div>
                
                <h3>Resumen de Avance</h3>
                <table>
                    <thead>
                        <tr><th>Disciplina</th><th>Items Totales</th><th>Completados</th><th>Pendientes</th><th>Avance</th></tr>
                    </thead>
                    <tbody>
                        ${checklistData.map(d => `
                            <tr>
                                <td>${d.discipline}</td>
                                <td>${d.total}</td>
                                <td class="completed">${d.completed}</td>
                                <td class="pending">${d.pending}</td>
                                <td>${d.percent}%</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                
                <div class="summary">
                    <strong>Resumen General:</strong>
                    <div>Progreso total: ${checklistData.reduce((acc, d) => acc + d.completed, 0)} / ${checklistData.reduce((acc, d) => acc + d.total, 0)} items</div>
                    <div>Porcentaje global: ${Math.round((checklistData.reduce((acc, d) => acc + d.completed, 0) / checklistData.reduce((acc, d) => acc + d.total, 0)) * 100)}%</div>
                </div>
                
                <div class="footer">
                    Reporte generado por Comisionamiento PWA - Sistema de gestión de comisionamiento
                </div>
            </body>
            </html>
        `;
    }
}

export const exportService = new ExportService();
export default exportService;
