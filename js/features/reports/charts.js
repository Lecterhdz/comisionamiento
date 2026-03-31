// ============================================
// CHARTS
// Configuración y generación de gráficas con Chart.js
// ============================================

import { createLogger } from '../../core/logger.js';

const log = createLogger('Charts');

// Colores para gráficas (tema claro/oscuro)
export const getChartColors = (isDark = false) => ({
    electrical: isDark ? '#00f2ff' : '#3b82f6',
    instrumentation: isDark ? '#8b5cf6' : '#8b5cf6',
    completed: isDark ? '#10b981' : '#10b981',
    pending: isDark ? '#ef4444' : '#ef4444',
    inProgress: isDark ? '#f59e0b' : '#f59e0b',
    grid: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    text: isDark ? '#f1f5f9' : '#1e293b'
});

// Configuración base para gráficas
export const getBaseConfig = (isDark = false) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom',
            labels: {
                color: getChartColors(isDark).text,
                font: { size: 12, family: 'system-ui' },
                usePointStyle: true,
                boxWidth: 8
            }
        },
        tooltip: {
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
            titleColor: isDark ? '#f1f5f9' : '#1e293b',
            bodyColor: isDark ? '#cbd5e1' : '#475569',
            borderColor: isDark ? '#334155' : '#e2e8f0',
            borderWidth: 1,
            callbacks: {
                label: (context) => {
                    let label = context.dataset.label || '';
                    if (label) label += ': ';
                    label += context.raw;
                    if (context.dataset.label === 'Porcentaje') label += '%';
                    return label;
                }
            }
        }
    }
});

// Gráfica de progreso general (dona)
export function createProgressDonutChart(ctx, completed, total, isDark = false) {
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    const colors = getChartColors(isDark);
    
    return new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Completado', 'Pendiente'],
            datasets: [{
                data: [completed, total - completed],
                backgroundColor: [colors.completed, colors.pending],
                borderWidth: 0,
                cutout: '70%',
                hoverOffset: 10
            }]
        },
        options: {
            ...getBaseConfig(isDark),
            plugins: {
                ...getBaseConfig(isDark).plugins,
                tooltip: {
                    ...getBaseConfig(isDark).plugins.tooltip,
                    callbacks: {
                        label: (context) => {
                            const value = context.raw;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percent = Math.round((value / total) * 100);
                            return `${context.label}: ${value} items (${percent}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Gráfica de barras por disciplina
export function createDisciplineBarChart(ctx, data, isDark = false) {
    const colors = getChartColors(isDark);
    
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [
                {
                    label: 'Completados',
                    data: data.completed,
                    backgroundColor: colors.completed,
                    borderRadius: 8,
                    barPercentage: 0.6
                },
                {
                    label: 'Pendientes',
                    data: data.pending,
                    backgroundColor: colors.pending,
                    borderRadius: 8,
                    barPercentage: 0.6
                }
            ]
        },
        options: {
            ...getBaseConfig(isDark),
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: colors.grid },
                    title: {
                        display: true,
                        text: 'Cantidad de items',
                        color: colors.text
                    }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: colors.text }
                }
            }
        }
    });
}

// Gráfica de evolución (línea)
export function createEvolutionLineChart(ctx, data, isDark = false) {
    const colors = getChartColors(isDark);
    
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [
                {
                    label: 'Progreso Eléctrico',
                    data: data.electrical,
                    borderColor: colors.electrical,
                    backgroundColor: 'transparent',
                    tension: 0.3,
                    fill: false,
                    pointBackgroundColor: colors.electrical,
                    pointBorderColor: colors.electrical,
                    pointRadius: 4,
                    pointHoverRadius: 6
                },
                {
                    label: 'Progreso Instrumentación',
                    data: data.instrumentation,
                    borderColor: colors.instrumentation,
                    backgroundColor: 'transparent',
                    tension: 0.3,
                    fill: false,
                    pointBackgroundColor: colors.instrumentation,
                    pointBorderColor: colors.instrumentation,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }
            ]
        },
        options: {
            ...getBaseConfig(isDark),
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: { color: colors.grid },
                    title: {
                        display: true,
                        text: 'Progreso (%)',
                        color: colors.text
                    },
                    ticks: {
                        callback: (value) => value + '%',
                        color: colors.text
                    }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: colors.text }
                }
            }
        }
    });
}

// Gráfica de progreso por subcontratista
export function createContractorProgressChart(ctx, contractors, isDark = false) {
    const colors = getChartColors(isDark);
    
    const labels = contractors.map(c => c.name);
    const data = contractors.map(c => c.progress?.overall || 0);
    
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Progreso (%)',
                data: data,
                backgroundColor: (context) => {
                    const value = context.raw;
                    if (value >= 80) return colors.completed;
                    if (value >= 50) return colors.inProgress;
                    return colors.pending;
                },
                borderRadius: 8,
                barPercentage: 0.5
            }]
        },
        options: {
            ...getBaseConfig(isDark),
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: { color: colors.grid },
                    title: {
                        display: true,
                        text: 'Progreso (%)',
                        color: colors.text
                    },
                    ticks: {
                        callback: (value) => value + '%',
                        color: colors.text
                    }
                },
                x: {
                    grid: { display: false },
                    ticks: { 
                        color: colors.text,
                        maxRotation: 45,
                        minRotation: 45
                    }
                }
            },
            plugins: {
                ...getBaseConfig(isDark).plugins,
                tooltip: {
                    ...getBaseConfig(isDark).plugins.tooltip,
                    callbacks: {
                        label: (context) => `Progreso: ${context.raw}%`
                    }
                }
            }
        }
    });
}

// Gráfica de distribución de punchlist por prioridad
export function createPunchlistPriorityChart(ctx, priorities, isDark = false) {
    const colors = getChartColors(isDark);
    
    return new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Alta', 'Media', 'Baja'],
            datasets: [{
                data: [priorities.high, priorities.medium, priorities.low],
                backgroundColor: ['#ef4444', '#f59e0b', '#10b981'],
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            ...getBaseConfig(isDark),
            plugins: {
                ...getBaseConfig(isDark).plugins,
                legend: {
                    position: 'bottom',
                    labels: {
                        color: getChartColors(isDark).text,
                        usePointStyle: true,
                        generateLabels: (chart) => {
                            const data = chart.data;
                            return data.labels.map((label, i) => ({
                                text: `${label} (${data.datasets[0].data[i]})`,
                                fillStyle: data.datasets[0].backgroundColor[i],
                                strokeStyle: data.datasets[0].backgroundColor[i],
                                lineWidth: 0,
                                pointStyle: 'circle'
                            }));
                        }
                    }
                }
            }
        }
    });
}
