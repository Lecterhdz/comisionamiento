let db = null;

export async function initStorage() {
    return new Promise((resolve) => {
        const request = indexedDB.open('ComisionamientoDB', 1);
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('checklists')) {
                db.createObjectStore('checklists', { keyPath: ['category', 'itemId'] });
            }
            if (!db.objectStoreNames.contains('punchlist')) {
                db.createObjectStore('punchlist', { keyPath: 'id', autoIncrement: true });
            }
        };
        request.onsuccess = () => {
            db = request.result;
            resolve(db);
        };
    });
}

export async function getPunchlistSummary() {
    return { high: 0, medium: 0, low: 0, total: 0 };
}

export async function getAllPunchlistItems() {
    return [];
}
