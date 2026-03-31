export function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const hamburger = document.getElementById('hamburger');
    const sidebarClose = document.getElementById('sidebarClose');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (!sidebar) return;
    
    const open = () => {
        sidebar.classList.add('open');
        if (overlay) overlay.classList.add('active');
    };
    
    const close = () => {
        sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('active');
    };
    
    if (hamburger) hamburger.addEventListener('click', open);
    if (sidebarClose) sidebarClose.addEventListener('click', close);
    if (overlay) overlay.addEventListener('click', close);
}
