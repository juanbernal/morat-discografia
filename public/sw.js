
const CACHE_NAME = 'diosmasgym-music-v4';
const urlsToCache = [
  './',
  './index.html'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache).catch(err => {
            console.warn('Algunos archivos no se pudieron cachear en la instalación:', err);
        });
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Ignorar peticiones que no sean GET
  if (event.request.method !== 'GET') return;
  // Ignorar extensiones de navegador
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
            return cachedResponse;
        }

        return fetch(event.request).then((networkResponse) => {
             // Verificar respuesta válida
             if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                 return networkResponse;
             }

             // Clonar la respuesta para cachearla si es un recurso estático (JS, CSS, Imágenes locales)
             // Evitar cachear llamadas API dinámicas para asegurar datos frescos
             if (event.request.url.indexOf('/api/') === -1 && !event.request.url.includes('google') && !event.request.url.includes('spotify')) {
                 const responseToCache = networkResponse.clone();
                 caches.open(CACHE_NAME).then((cache) => {
                     cache.put(event.request, responseToCache);
                 });
             }

             return networkResponse;
        }).catch(() => {
            // Fallback si falla la red y no hay caché
            // Si es navegación, se podría devolver una página offline.html si existiera
        });
      })
  );
});
