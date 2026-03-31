/* ============================================
   SIDEBAR - MENÚ HAMBURGUESA IZQUIERDA
   Estilo Jarvis con efectos neon
   ============================================ */

/* Sidebar base */
.sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: 280px;
    height: 100vh;
    background-color: var(--bg-sidebar);
    border-right: 1px solid var(--border-color);
    backdrop-filter: blur(10px);
    z-index: 1000;
    transition: transform var(--transition-normal), box-shadow var(--transition-normal);
    transform: translateX(0);
    display: flex;
    flex-direction: column;
}

/* Efecto neon en borde derecho (solo tema oscuro) */
[data-theme="dark"] .sidebar {
    border-right: 1px solid rgba(0, 242, 255, 0.2);
    box-shadow: 4px 0 20px rgba(0, 0, 0, 0.5);
}

/* Sidebar header */
.sidebar-header {
    padding: var(--spacing-xl) var(--spacing-lg);
    border-bottom: 1px solid var(--border-color);
    position: relative;
}

.logo {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    text-decoration: none;
}

.logo-icon {
    font-size: 2rem;
    animation: pulseNeon 2s ease-in-out infinite;
}

[data-theme="dark"] .logo-icon {
    filter: drop-shadow(0 0 5px var(--accent-neon));
}

.logo-text {
    font-size: 1.25rem;
    font-weight: 700;
    background: linear-gradient(135deg, var(--primary-500), var(--primary-700));
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

[data-theme="dark"] .logo-text {
    background: linear-gradient(135deg, var(--accent-neon), var(--primary-500));
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: var(--neon-text-glow);
}

/* Navegación */
.sidebar-nav {
    flex: 1;
    padding: var(--spacing-md) var(--spacing-sm);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
}

.nav-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-md) var(--spacing-lg);
    margin: 0 var(--spacing-sm);
    border-radius: var(--radius-lg);
    color: var(--text-secondary);
    text-decoration: none;
    transition: all var(--transition-fast);
    position: relative;
    overflow: hidden;
}

/* Efecto hover */
.nav-item:hover {
    background-color: var(--bg-tertiary);
    color: var(--text-primary);
    transform: translateX(4px);
}

[data-theme="dark"] .nav-item:hover {
    background: linear-gradient(90deg, rgba(0, 242, 255, 0.1), transparent);
    color: var(--accent-neon);
    text-shadow: 0 0 5px var(--accent-neon);
}

/* Item activo */
.nav-item.active {
    background: linear-gradient(90deg, var(--primary-500), var(--primary-600));
    color: white;
    box-shadow: var(--shadow-md);
}

[data-theme="dark"] .nav-item.active {
    background: linear-gradient(90deg, var(--accent-neon), var(--primary-500));
    color: var(--bg-primary);
    box-shadow: var(--neon-glow);
    text-shadow: none;
}

/* Iconos */
.nav-icon {
    font-size: 1.25rem;
    width: 28px;
    text-align: center;
    transition: transform var(--transition-fast);
}

.nav-item:hover .nav-icon {
    transform: scale(1.1);
}

[data-theme="dark"] .nav-item.active .nav-icon {
    filter: drop-shadow(0 0 3px currentColor);
}

.nav-text {
    font-size: 0.9375rem;
    font-weight: 500;
    flex: 1;
}

/* Badge en nav */
.nav-item .badge {
    background-color: var(--primary-500);
    color: white;
    border-radius: var(--radius-full);
    padding: 2px 8px;
    font-size: 0.7rem;
    font-weight: 600;
    margin-left: auto;
}

[data-theme="dark"] .nav-item .badge {
    background: linear-gradient(135deg, var(--accent-neon), var(--primary-500));
    box-shadow: 0 0 8px var(--accent-neon);
}

/* Sidebar footer */
.sidebar-footer {
    padding: var(--spacing-md);
    border-top: 1px solid var(--border-color);
}

/* Toggle tema */
.theme-toggle-btn {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-sm) var(--spacing-md);
    width: 100%;
    border-radius: var(--radius-lg);
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    color: var(--text-secondary);
    cursor: pointer;
    transition: all var(--transition-fast);
}

.theme-toggle-btn:hover {
    background: var(--bg-primary);
    border-color: var(--primary-500);
    transform: translateY(-1px);
}

[data-theme="dark"] .theme-toggle-btn:hover {
    border-color: var(--accent-neon);
    box-shadow: 0 0 10px rgba(0, 242, 255, 0.3);
}

.theme-icon-light,
.theme-icon-dark {
    font-size: 1.125rem;
    width: 28px;
    text-align: center;
}

[data-theme="dark"] .theme-icon-dark {
    display: inline-block;
}

[data-theme="dark"] .theme-icon-light {
    display: none;
}

[data-theme="light"] .theme-icon-dark {
    display: none;
}

[data-theme="light"] .theme-icon-light {
    display: inline-block;
}

/* Overlay para móvil */
.sidebar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    z-index: 999;
    opacity: 0;
    visibility: hidden;
    transition: opacity var(--transition-normal), visibility var(--transition-normal);
}

.sidebar-overlay.active {
    opacity: 1;
    visibility: visible;
}

/* Botón hamburguesa (top bar) */
.hamburger {
    display: none;
    flex-direction: column;
    justify-content: space-between;
    width: 28px;
    height: 20px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    margin-right: var(--spacing-md);
}

.hamburger span {
    width: 100%;
    height: 2px;
    background-color: var(--text-primary);
    border-radius: 2px;
    transition: all var(--transition-fast);
}

.hamburger:hover span {
    background-color: var(--primary-500);
}

[data-theme="dark"] .hamburger:hover span {
    background-color: var(--accent-neon);
    box-shadow: 0 0 5px var(--accent-neon);
}

/* Close button (solo móvil) */
.sidebar-close {
    display: none;
    background: none;
    border: none;
    color: var(--text-secondary);
    font-size: 1.25rem;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: var(--radius-sm);
    transition: all var(--transition-fast);
}

.sidebar-close:hover {
    color: var(--primary-500);
    background-color: var(--bg-tertiary);
}

[data-theme="dark"] .sidebar-close:hover {
    color: var(--accent-neon);
    text-shadow: 0 0 5px var(--accent-neon);
}

/* ============================================
   RESPONSIVE
   ============================================ */

/* Tablet y móvil */
@media (max-width: 1024px) {
    .sidebar {
        transform: translateX(-100%);
        box-shadow: none;
    }
    
    .sidebar.open {
        transform: translateX(0);
        box-shadow: var(--shadow-lg);
    }
    
    .sidebar-close {
        display: block;
    }
    
    .hamburger {
        display: flex;
    }
}

/* Desktop */
@media (min-width: 1025px) {
    .sidebar-overlay {
        display: none;
    }
    
    .sidebar-close {
        display: none;
    }
}

/* ============================================
   ANIMACIONES
   ============================================ */

@keyframes pulseNeon {
    0%, 100% {
        filter: drop-shadow(0 0 2px var(--accent-neon));
    }
    50% {
        filter: drop-shadow(0 0 10px var(--accent-neon));
    }
}

/* Animación de entrada del menú */
@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateX(-20px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.nav-item {
    animation: slideIn 0.3s ease backwards;
}

.nav-item:nth-child(1) { animation-delay: 0.05s; }
.nav-item:nth-child(2) { animation-delay: 0.1s; }
.nav-item:nth-child(3) { animation-delay: 0.15s; }
.nav-item:nth-child(4) { animation-delay: 0.2s; }
.nav-item:nth-child(5) { animation-delay: 0.25s; }
