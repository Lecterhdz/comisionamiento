// ============================================
// PROJECT MANAGER
// Gestión de múltiples proyectos y contratistas
// ============================================

import { initStorage, saveSetting, getSetting } from '../../core/storage.js';
import { createLogger } from '../../core/logger.js';
import { CONFIG } from '../../core/config.js';

const log = createLogger('ProjectManager');

// Proyecto por defecto
const DEFAULT_PROJECT = {
    id: 'default',
    name: 'Proyecto Principal',
    clientName: 'Cliente',
    clientLogo: null,
    projectCode: 'PROJ-001',
    location: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    description: '',
    status: 'active',
    contractors: []
};

// Subcontratista por defecto
const DEFAULT_CONTRACTOR = {
    id: null,
    name: '',
    discipline: 'electrical', // electrical, instrumentation
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    progress: {
        electrical: { completed: 0, total: 0, percent: 0 },
        instrumentation: { completed: 0, total: 0, percent: 0 },
        overall: 0
    },
    status: 'active'
};

class ProjectManager {
    constructor() {
        this.currentProject = null;
        this.projects = [];
    }
    
    async init() {
        await initStorage();
        await this.loadProjects();
        
        // Cargar proyecto actual
        const currentProjectId = await getSetting('currentProjectId');
        if (currentProjectId) {
            this.currentProject = this.projects.find(p => p.id === currentProjectId);
        }
        
        if (!this.currentProject && this.projects.length > 0) {
            this.currentProject = this.projects[0];
        }
        
        if (!this.currentProject) {
            this.currentProject = { ...DEFAULT_PROJECT, id: this.generateId() };
            this.projects.push(this.currentProject);
            await this.saveProjects();
        }
        
        log.info('ProjectManager inicializado', { 
            projectsCount: this.projects.length,
            currentProject: this.currentProject?.name 
        });
        
        return this.currentProject;
    }
    
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    async loadProjects() {
        const saved = await getSetting('projects');
        if (saved) {
            this.projects = JSON.parse(saved);
        } else {
            this.projects = [{ ...DEFAULT_PROJECT, id: this.generateId() }];
            await this.saveProjects();
        }
    }
    
    async saveProjects() {
        await saveSetting('projects', JSON.stringify(this.projects));
    }
    
    async createProject(projectData) {
        const newProject = {
            ...DEFAULT_PROJECT,
            ...projectData,
            id: this.generateId(),
            createdAt: new Date().toISOString()
        };
        
        this.projects.push(newProject);
        await this.saveProjects();
        
        log.info('Proyecto creado', { id: newProject.id, name: newProject.name });
        return newProject;
    }
    
    async updateProject(projectId, updates) {
        const index = this.projects.findIndex(p => p.id === projectId);
        if (index === -1) return null;
        
        this.projects[index] = { ...this.projects[index], ...updates };
        await this.saveProjects();
        
        if (this.currentProject?.id === projectId) {
            this.currentProject = this.projects[index];
        }
        
        log.info('Proyecto actualizado', { id: projectId });
        return this.projects[index];
    }
    
    async deleteProject(projectId) {
        if (this.projects.length === 1) {
            throw new Error('No se puede eliminar el único proyecto');
        }
        
        this.projects = this.projects.filter(p => p.id !== projectId);
        
        if (this.currentProject?.id === projectId) {
            this.currentProject = this.projects[0];
            await saveSetting('currentProjectId', this.currentProject.id);
        }
        
        await this.saveProjects();
        log.info('Proyecto eliminado', { id: projectId });
    }
    
    async setCurrentProject(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (project) {
            this.currentProject = project;
            await saveSetting('currentProjectId', projectId);
            log.info('Proyecto actual cambiado', { projectId, name: project.name });
        }
        return this.currentProject;
    }
    
    getCurrentProject() {
        return this.currentProject;
    }
    
    getAllProjects() {
        return [...this.projects];
    }
    
    // Gestión de subcontratistas
    async addContractor(projectId, contractorData) {
        const project = this.projects.find(p => p.id === projectId);
        if (!project) return null;
        
        const newContractor = {
            ...DEFAULT_CONTRACTOR,
            ...contractorData,
            id: this.generateId(),
            createdAt: new Date().toISOString()
        };
        
        project.contractors = project.contractors || [];
        project.contractors.push(newContractor);
        await this.saveProjects();
        
        log.info('Subcontratista agregado', { projectId, contractorId: newContractor.id });
        return newContractor;
    }
    
    async updateContractor(projectId, contractorId, updates) {
        const project = this.projects.find(p => p.id === projectId);
        if (!project) return null;
        
        const index = project.contractors.findIndex(c => c.id === contractorId);
        if (index === -1) return null;
        
        project.contractors[index] = { ...project.contractors[index], ...updates };
        await this.saveProjects();
        
        log.info('Subcontratista actualizado', { projectId, contractorId });
        return project.contractors[index];
    }
    
    async deleteContractor(projectId, contractorId) {
        const project = this.projects.find(p => p.id === projectId);
        if (!project) return false;
        
        project.contractors = project.contractors.filter(c => c.id !== contractorId);
        await this.saveProjects();
        
        log.info('Subcontratista eliminado', { projectId, contractorId });
        return true;
    }
    
    getContractors(projectId = null) {
        const project = projectId 
            ? this.projects.find(p => p.id === projectId)
            : this.currentProject;
        
        if (!project) return [];
        return project.contractors || [];
    }
    
    async updateContractorProgress(projectId, contractorId, checklistData) {
        const contractor = await this.getContractor(projectId, contractorId);
        if (!contractor) return;
        
        // Actualizar progreso según disciplina
        for (const [discipline, data] of Object.entries(checklistData)) {
            if (contractor.progress[discipline]) {
                contractor.progress[discipline] = {
                    completed: data.completed,
                    total: data.total,
                    percent: data.percent
                };
            }
        }
        
        // Calcular progreso general
        const disciplines = ['electrical', 'instrumentation'];
        let totalCompleted = 0;
        let totalItems = 0;
        
        disciplines.forEach(d => {
            if (contractor.progress[d]) {
                totalCompleted += contractor.progress[d].completed || 0;
                totalItems += contractor.progress[d].total || 0;
            }
        });
        
        contractor.progress.overall = totalItems > 0 
            ? Math.round((totalCompleted / totalItems) * 100) 
            : 0;
        
        await this.updateContractor(projectId, contractorId, { progress: contractor.progress });
        
        return contractor.progress;
    }
    
    async getContractor(projectId, contractorId) {
        const project = this.projects.find(p => p.id === projectId);
        if (!project) return null;
        return project.contractors?.find(c => c.id === contractorId) || null;
    }
}

export const projectManager = new ProjectManager();
export default projectManager;
