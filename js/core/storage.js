// Gestión de almacenamiento con IndexedDB
let db = null;
const DB_NAME = 'ComisionamientoDB';
const DB_VERSION = 2;

// Inicializar base de datos
export async function initStorage() {
    return new Promise((resolve, reject) => {
        if (db && db.name === DB_NAME) {
            resolve(db);
            return;
        }
        
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        
        request.onerror = () => reject(request.error);
        
        request.onsuccess = () => {
            db = request.result;
            resolve(db);
        };
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            
            // Store para checklists
            if (!db.objectStoreNames.contains('checklists')) {
                const checklistStore = db.createObjectStore('checklists', { keyPath: ['category', 'itemId'] });
                checklistStore.createIndex('category', 'category', { unique: false });
                checklistStore.createIndex('completed', 'completed', { unique: false });
            }
            
            // Store para punchlist
            if (!db.objectStoreNames.contains('punchlist')) {
                const punchlistStore = db.createObjectStore('punchlist', { keyPath: 'id', autoIncrement: true });
                punchlistStore.createIndex('category', 'category', { unique: false });
                punchlistStore.createIndex('priority', 'priority', { unique: false });
                punchlistStore.createIndex('status', 'status', { unique: false });
                punchlistStore.createIndex('createdAt', 'createdAt', { unique: false });
            }
            
            // Store para configuración
            if (!db.objectStoreNames.contains('settings')) {
                db.createObjectStore('settings', { keyPath: 'key' });
            }
        };
    });
}

// Obtener progreso de un checklist
export async function getChecklistProgress(category) {
    const checklistData = await getChecklistItems(category);
    const total = checklistData.length;
    const completed = checklistData.filter(item => item.completed).length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { total, completed, percent };
}

// Obtener items de checklist por categoría
export async function getChecklistItems(category) {
    if (!db) await initStorage();
    
    return new Promise((resolve) => {
        const transaction = db.transaction(['checklists'], 'readonly');
        const store = transaction.objectStore('checklists');
        const index = store.index('category');
        const items = [];
        
        index.openCursor(IDBKeyRange.only(category)).onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                items.push(cursor.value);
                cursor.continue();
            } else {
                resolve(items);
            }
        };
    });
}

// Guardar item de checklist
export async function saveChecklistItem(category, itemId, completed, notes = '') {
    if (!db) await initStorage();
    
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['checklists'], 'readwrite');
        const store = transaction.objectStore('checklists');
        
        const item = {
            category,
            itemId,
            completed,
            notes,
            updatedAt: new Date().toISOString()
        };
        
        const request = store.put(item);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

// Obtener resumen de punchlist
export async function getPunchlistSummary() {
    const items = await getAllPunchlistItems();
    const high = items.filter(i => i.priority === 'high' && i.status !== 'resolved').length;
    const medium = items.filter(i => i.priority === 'medium' && i.status !== 'resolved').length;
    const low = items.filter(i => i.priority === 'low' && i.status !== 'resolved').length;
    const total = high + medium + low;
    
    return { high, medium, low, total };
}

// Obtener todos los items de punchlist
export async function getAllPunchlistItems() {
    if (!db) await initStorage();
    
    return new Promise((resolve) => {
        const transaction = db.transaction(['punchlist'], 'readonly');
        const store = transaction.objectStore('punchlist');
        const items = [];
        
        store.openCursor().onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                items.push(cursor.value);
                cursor.continue();
            } else {
                resolve(items);
            }
        };
    });
}

// Agregar observación a punchlist
export async function addPunchlistItem(item) {
    if (!db) await initStorage();
    
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['punchlist'], 'readwrite');
        const store = transaction.objectStore('punchlist');
        
        const newItem = {
            ...item,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: item.status || 'pending'
        };
        
        const request = store.add(newItem);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// Actualizar item de punchlist
export async function updatePunchlistItem(id, updates) {
    if (!db) await initStorage();
    
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['punchlist'], 'readwrite');
        const store = transaction.objectStore('punchlist');
        
        const getRequest = store.get(id);
        getRequest.onsuccess = () => {
            const item = getRequest.result;
            if (item) {
                Object.assign(item, updates, { updatedAt: new Date().toISOString() });
                const putRequest = store.put(item);
                putRequest.onsuccess = () => resolve();
                putRequest.onerror = () => reject(putRequest.error);
            } else {
                reject(new Error('Item no encontrado'));
            }
        };
        getRequest.onerror = () => reject(getRequest.error);
    });
}

// Eliminar item de punchlist
export async function deletePunchlistItem(id) {
    if (!db) await initStorage();
    
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['punchlist'], 'readwrite');
        const store = transaction.objectStore('punchlist');
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

// Obtener observaciones recientes
export async function getRecentObservations(limit = 5) {
    const items = await getAllPunchlistItems();
    return items
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, limit);
}

// Guardar configuración
export async function saveSetting(key, value) {
    if (!db) await initStorage();
    
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['settings'], 'readwrite');
        const store = transaction.objectStore('settings');
        const request = store.put({ key, value, updatedAt: new Date().toISOString() });
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

// Obtener configuración
export async function getSetting(key) {
    if (!db) await initStorage();
    
    return new Promise((resolve) => {
        const transaction = db.transaction(['settings'], 'readonly');
        const store = transaction.objectStore('settings');
        const request = store.get(key);
        request.onsuccess = () => resolve(request.result?.value);
        request.onerror = () => resolve(null);
    });
}
