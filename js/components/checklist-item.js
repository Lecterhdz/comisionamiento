// ============================================
// CHECKLIST ITEM COMPONENT
// Componente para renderizar checklists con agrupación por sección
// ============================================

/**
 * Renderiza un checklist agrupado por sección
 * @param {string} containerId - ID del contenedor donde renderizar
 * @param {Array} items - Lista de items del checklist
 * @param {string} category - Categoría del checklist (electrical/instrumentation)
 * @param {Function} onItemChange - Callback cuando un item cambia
 */
export function renderChecklist(containerId, items, category, onItemChange) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container con ID "${containerId}" no encontrado`);
        return;
    }
    
    // Agrupar por sección
    const grouped = items.reduce((acc, item) => {
        const section = item.section || 'General';
        if (!acc[section]) acc[section] = [];
        acc[section].push(item);
        return acc;
    }, {});
    
    let html = '';
    
    for (const [section, sectionItems] of Object.entries(grouped)) {
        const sectionCompleted = sectionItems.filter(i => i.completed).length;
        const sectionPercent = sectionItems.length > 0 ? Math.round((sectionCompleted / sectionItems.length) * 100) : 0;
        
        html += `
            <div class="checklist-section expanded">
                <div class="checklist-section-header" data-section="${section}">
                    <div class="section-title">
                        <span class="section-icon">📁</span>
                        <span>${escapeHtml(section)}</span>
                    </div>
                    <div class="section-progress">
                        ${sectionCompleted}/${sectionItems.length} (${sectionPercent}%)
                        <span class="section-expand">▼</span>
                    </div>
                </div>
                <div class="checklist-section-content">
                    ${sectionItems.map(item => `
                        <div class="checklist-item ${item.critical ? 'critical' : ''}" data-item-id="${item.id}">
                            <div class="checklist-item-checkbox">
                                <input type="checkbox" ${item.completed ? 'checked' : ''} data-id="${item.id}">
                            </div>
                            <div class="checklist-item-content">
                                <div class="checklist-item-text">
                                    ${escapeHtml(item.item)}
                                    ${item.critical ? '<span class="critical-badge">CRÍTICO</span>' : ''}
                                </div>
                                <div class="checklist-item-norm">Norma: ${escapeHtml(item.norm)}</div>
                                <textarea class="checklist-item-notes" data-id="${item.id}" placeholder="Notas / observaciones..." rows="2">${escapeHtml(item.notes || '')}</textarea>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    container.innerHTML = html;
    
    // Event listeners para checkboxes
    container.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const id = e.target.dataset.id;
            const completed = e.target.checked;
            const notesTextarea = container.querySelector(`textarea[data-id="${id}"]`);
            const notes = notesTextarea?.value || '';
            if (typeof onItemChange === 'function') {
                onItemChange(id, completed, notes);
            }
        });
    });
    
    // Event listeners para textarea (con debounce)
    container.querySelectorAll('.checklist-item-notes').forEach(textarea => {
        let timeout;
        textarea.addEventListener('input', (e) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                const id = e.target.dataset.id;
                const completed = container.querySelector(`input[data-id="${id}"]`)?.checked || false;
                const notes = e.target.value;
                if (typeof onItemChange === 'function') {
                    onItemChange(id, completed, notes);
                }
            }, 500);
        });
    });
    
    // Expandir/colapsar secciones
    container.querySelectorAll('.checklist-section-header').forEach(header => {
        header.addEventListener('click', (e) => {
            e.stopPropagation();
            const section = header.closest('.checklist-section');
            if (section) {
                section.classList.toggle('expanded');
            }
        });
    });
}

/**
 * Actualiza la barra de progreso global
 * @param {Array} items - Lista de items del checklist
 */
export function updateGlobalProgress(items) {
    const total = items.length;
    const completed = items.filter(i => i.completed).length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    const fill = document.getElementById('globalProgressFill');
    const text = document.getElementById('globalProgressText');
    
    if (fill) fill.style.width = `${percent}%`;
    if (text) text.textContent = `${percent}% completado (${completed}/${total})`;
}

/**
 * Actualiza el progreso de una sección específica
 * @param {HTMLElement} container - Contenedor del checklist
 * @param {string} itemId - ID del item actualizado
 * @param {boolean} completed - Estado completado del item
 */
export function updateSectionProgress(container, itemId, completed) {
    const item = container.querySelector(`.checklist-item[data-item-id="${itemId}"]`);
    const section = item?.closest('.checklist-section');
    if (!section) return;
    
    const itemsInSection = section.querySelectorAll('.checklist-item');
    const completedInSection = section.querySelectorAll('input[type="checkbox"]:checked').length;
    const percent = itemsInSection.length > 0 ? Math.round((completedInSection / itemsInSection.length) * 100) : 0;
    
    const progressSpan = section.querySelector('.section-progress');
    if (progressSpan) {
        const totalSpan = progressSpan.innerHTML.split('(')[0];
        progressSpan.innerHTML = `${completedInSection}/${itemsInSection.length} (${percent}%) <span class="section-expand">▼</span>`;
    }
}

/**
 * Escapa caracteres HTML para prevenir XSS
 * @param {string} str - String a escapar
 * @returns {string} String escapado
 */
function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Exportar todo como default para compatibilidad
export default {
    renderChecklist,
    updateGlobalProgress,
    updateSectionProgress
};
