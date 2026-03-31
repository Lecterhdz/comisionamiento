// ============================================
// PROVEEDOR STORAGE
// Almacenamiento local de checklists del proveedor
// ============================================

import { createLogger } from '../core/logger.js';

const log = createLogger('ProveedorStorage');

class ProveedorStorage {
    constructor() {
        this.storageKey = 'proveedor_checklists';
        this.checklists = [];
    }
    
    async init() {
        await this.load();
        log.info(`Cargados ${this.checklists.length} checklists locales`);
    }
    
    async load() {
        const saved = localStorage.getItem(this.storageKey);
        if (saved) {
            this.checklists = JSON.parse(saved);
        }
    }
    
    async save() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.checklists));
    }
    
    // ============================================
    // CRUD de checklists
    // ============================================
    
    async addChecklist(checklistData) {
        const newChecklist = {
            ...checklistData,
            id: this.generateId(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: 'pending' // pending, completed, exported
        };
        
        this.checklists.push(newChecklist);
        await this.save();
        
        log.info(`Checklist agregado: ${newChecklist.id}`);
        return newChecklist;
    }
    
    async updateChecklist(id, updates) {
        const index = this.checklists.findIndex(c => c.id === id);
        if (index === -1) return null;
        
        this.checklists[index] = {
            ...this.checklists[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };
        
        await this.save();
        log.info(`Checklist actualizado: ${id}`);
        return this.checklists[index];
    }
    
    async deleteChecklist(id) {
        const initialLength = this.checklists.length;
        this.checklists = this.checklists.filter(c => c.id !== id);
        
        if (this.checklists.length !== initialLength) {
            await this.save();
            log.info(`Checklist eliminado: ${id}`);
            return true;
        }
        
        return false;
    }
    
    async getChecklist(id) {
        return this.checklists.find(c => c.id === id);
    }
    
    getAllChecklists() {
        return [...this.checklists];
    }
    
    getChecklistsByProyecto(proyectoId) {
        return this.checklists.filter(c => c.proyecto?.id === proyectoId);
    }
    
    getChecklistsByStatus(status) {
        return this.checklists.filter(c => c.status === status);
    }
    
    // ============================================
    // EXPORTACIÓN
    // ============================================
    
    async exportChecklist(id) {
        const checklist = await this.getChecklist(id);
        if (!checklist) return null;
        
        // Marcar como exportado
        await this.updateChecklist(id, { status: 'exported', lastExportedAt: new Date().toISOString() });
        
        return checklist;
    }
    
    async exportMultipleChecklists(ids) {
        const selected = this.checklists.filter(c => ids.includes(c.id));
        
        // Marcar como exportados
        for (const checklist of selected) {
            await this.updateChecklist(checklist.id, { 
                status: 'exported', 
                lastExportedAt: new Date().toISOString() 
            });
        }
        
        return selected;
    }
    
    async exportAllChecklists() {
        const all = [...this.checklists];
        
        // Marcar todos como exportados
        for (const checklist of all) {
            await this.updateChecklist(checklist.id, { 
                status: 'exported', 
                lastExportedAt: new Date().toISOString() 
            });
        }
        
        return all;
    }
    
    // ============================================
    // UTILIDADES
    // ============================================
    
    generateId() {
        return `CHK-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    }
    
    async clearAll() {
        this.checklists = [];
        await this.save();
        log.info('Todos los checklists eliminados');
    }
    
    getStats() {
        const total = this.checklists.length;
        const pending = this.checklists.filter(c => c.status === 'pending').length;
        const completed = this.checklists.filter(c => c.status === 'completed').length;
        const exported = this.checklists.filter(c => c.status === 'exported').length;
        
        // Calcular progreso general
        let totalItems = 0;
        let totalCompleted = 0;
        
        for (const checklist of this.checklists) {
            const stats = checklist.estadisticas;
            if (stats) {
                totalItems += stats.totalItems;
                totalCompleted += stats.completados;
            }
        }
        
        const overallProgress = totalItems > 0 ? Math.round((totalCompleted / totalItems) * 100) : 0;
        
        return {
            total,
            pending,
            completed,
            exported,
            totalItems,
            totalCompleted,
            overallProgress
        };
    }
}

export const proveedorStorage = new ProveedorStorage();
export default proveedorStorage;
