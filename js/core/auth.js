// ============================================
// AUTH - Sistema de autenticación simple
// ============================================

// Roles disponibles
export const ROLES = {
    CONTRATISTA: 'contratista',
    PROVEEDOR: 'proveedor'
};

// Credenciales de ejemplo (en producción vendrían de un servidor)
const CREDENCIALES = {
    contratista: {
        usuario: 'contratista',
        password: 'comisiona2024',
        rol: ROLES.CONTRATISTA,
        nombre: 'Contratista General'
    },
    proveedor: {
        usuario: 'proveedor',
        password: 'instalador2024',
        rol: ROLES.PROVEEDOR,
        nombre: 'Proveedor'
    }
};

// Proveedores registrados (para validación de acceso)
let proveedoresRegistrados = [];

// Cargar proveedores registrados desde localStorage
export function loadProveedoresAuth() {
    const saved = localStorage.getItem('client_proveedores');
    if (saved) {
        proveedoresRegistrados = JSON.parse(saved);
    }
}

// Validar credenciales de proveedor (ID y Licencia)
export function validarProveedorAuth(proveedorId, licencia) {
    const proveedor = proveedoresRegistrados.find(p => p.id === proveedorId && p.licencia === licencia);
    if (proveedor) {
        return {
            valido: true,
            rol: ROLES.PROVEEDOR,
            proveedor: proveedor,
            nombre: proveedor.nombre
        };
    }
    return { valido: false, error: 'ID o Licencia inválidos' };
}

// Validar credenciales de contratista
export function validarContratistaAuth(usuario, password) {
    if (usuario === CREDENCIALES.contratista.usuario && password === CREDENCIALES.contratista.password) {
        return {
            valido: true,
            rol: ROLES.CONTRATISTA,
            nombre: CREDENCIALES.contratista.nombre
        };
    }
    return { valido: false, error: 'Usuario o contraseña incorrectos' };
}

// Login general
export function login(usuario, password, rol = null) {
    if (rol === ROLES.PROVEEDOR) {
        return validarProveedorAuth(usuario, password);
    }
    return validarContratistaAuth(usuario, password);
}

// Verificar si el usuario está autenticado
export function isAuthenticated() {
    const session = localStorage.getItem('user_session');
    return session !== null;
}

// Obtener usuario actual
export function getCurrentUser() {
    const session = localStorage.getItem('user_session');
    if (session) {
        return JSON.parse(session);
    }
    return null;
}

// Obtener rol actual
export function getCurrentRole() {
    const user = getCurrentUser();
    return user?.rol || null;
}

// Login y guardar sesión
export function doLogin(userData) {
    localStorage.setItem('user_session', JSON.stringify(userData));
    return userData;
}

// Logout
export function logout() {
    localStorage.removeItem('user_session');
    window.location.href = '/comisionamiento/login.html';
}

// Verificar acceso a página según rol
export function checkAccess(allowedRoles) {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = '/comisionamiento/login.html';
        return false;
    }
    
    if (!allowedRoles.includes(user.rol)) {
        window.location.href = '/comisionamiento/unauthorized.html';
        return false;
    }
    
    return true;
}

export default {
    ROLES,
    login,
    isAuthenticated,
    getCurrentUser,
    getCurrentRole,
    doLogin,
    logout,
    checkAccess,
    loadProveedoresAuth
};
