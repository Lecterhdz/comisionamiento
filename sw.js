const CACHE_NAME = 'comisionamiento-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/pages/checklist-electrical.html',
  '/pages/checklist-instrumentation.html',
  '/pages/punchlist.html',
  '/pages/reports.html',
  '/css/variables.css',
  '/css/base.css',
  '/css/layout.css',
  '/css/sidebar.css',
  '/css/components.css',
  '/css/checklist.css',
  '/js/core/theme.js',
  '/js/core/storage.js',
  '/js/core/sw-register.js',
  '/js/core/utils.js',
  '/js/components/sidebar.js',
  '/js/components/circular-progress.js',
  '/js/components/progress-bar.js',
  '/js/components/checklist-item.js',
  '/js/components/status-badge.js',
  '/js/features/checklist/checklist-manager.js',
  '/js/features/checklist/categories.js',
  '/js/features/checklist/items-data.js',
  '/js/features/checklist/export.js',
  '/js/features/punchlist/punchlist-manager.js',
  '/js/features/punchlist/priority.js',
  '/js/features/punchlist/status.js',
  '/js/features/reports/report-generator.js',
  '/js/features/reports/templates.js',
  '/manifest.json',
  '/assets/icons/icon-72x72.png',
  '/assets/icons/icon-96x96.png',
  '/assets/icons/icon-128x128.png',
  '/assets/icons/icon-144x144.png',
  '/assets/icons/icon-152x152.png',
  '/assets/icons/icon-192x192.png',
  '/assets/icons/icon-384x384.png',
  '/assets/icons/icon-512x512.png'
];

// Instalación: cachear archivos estáticos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Cacheando archivos estáticos');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activación: limpiar caches viejos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Eliminando cache antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: estrategia cache-first con fallback a red
self.addEventListener('fetch', event => {
  // Ignorar peticiones a IndexedDB y otras APIs
  if (event.request.url.includes('/chrome-extension') ||
      event.request.url.includes('firestore') ||
      event.request.url.includes('analytics')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - devolver respuesta cacheada
        if (response) {
          return response;
        }

        // Clonar request porque es de un solo uso
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest)
          .then(response => {
            // Verificar respuesta válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clonar respuesta porque se va a cachear
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(error => {
            console.log('⚠️ Falló fetch, sirviendo offline fallback:', error);
            
            // Si es una navegación a página HTML, mostrar página offline
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html');
            }
            
            return new Response('Recurso no disponible offline', {
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
      })
  );
});

// Sincronización en segundo plano (opcional)
self.addEventListener('sync', event => {
  if (event.tag === 'sync-punchlist') {
    event.waitUntil(syncPunchlist());
  }
});

async function syncPunchlist() {
  // Aquí iría la lógica de sincronización con Firebase/backend
  console.log('🔄 Sincronizando punchlist pendientes...');
  // Implementar cuando se agregue backend
}
