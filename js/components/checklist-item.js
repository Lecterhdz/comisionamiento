// Renderizar checklist agrupado por sección
export function renderChecklist(containerId, items, category, onItemChange) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Agrupar por sección
    const grouped = items.reduce((acc, item) => {
        if (!acc[item.section]) acc[item.section] = [];
        acc[item.section].push(item);
        return acc;
    }, {});
    
    let html = '';
    
    for (const [section, sectionItems] of Object.entries(grouped)) {
        const sectionCompleted = sectionItems.filter(i => i.completed).length;
        const sectionPercent = Math.round((sectionCompleted / sectionItems.length) * 100);
        
        html += `
            <div class="checklist-section expanded">
                <div class="checklist-section-header">
                    <div class="section-title">
                        <span>📁</span>
                        <span>${section}</span>
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
                                    ${item.item}
                                    ${item.critical ? '<span class="critical-badge">CRÍTICO</span>' : ''}
                                </div>
                                <div class="checklist-item-norm">Norma: ${item.norm}</div>
                                <textarea class="checklist-item-notes" data-id="${item.id}" placeholder="Notas / observaciones..." rows="2">${escapeHtml(item.notes || '')}</textarea>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    container.innerHTML = html;
    
    // Event listeners
    container.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const id = e.target.dataset.id;
            const completed = e.target.checked;
            const notesTextarea = container.querySelector(`textarea[data-id="${id}"]`);
            const notes = notesTextarea?.value || '';
            onItemChange(id, completed, notes);
        });
    });
    
    container.querySelectorAll('.checklist-item-notes').forEach(textarea => {
        let timeout;
        textarea.addEventListener('input', (e) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                const id = e.target.dataset.id;
                const completed = container.querySelector(`input[data-id="${id}"]`)?.checked || false;
                const notes = e.target.value;
                onItemChange(id, completed, notes);
            }, 500);
        });
    });
    
    // Expandir/colapsar secciones
    container.querySelectorAll('.checklist-section-header').forEach(header => {
        header.addEventListener('click', () => {
            const section = header.closest('.checklist-section');
            section.classList.toggle('expanded');
        });
    });
}

export function updateGlobalProgress(items) {
    const total = items.length;
    const completed = items.filter(i => i.completed).length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    const fill = document.getElementById('globalProgressFill');
    const text = document.getElementById('globalProgressText');
    
    if (fill) fill.style.width = `${percent}%`;
    if (text) text.textContent = `${percent}% completado (${completed}/${total})`;
}

function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
