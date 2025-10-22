// public/sw.js - VERSIÓN MEJORADA
const CACHE_NAME = 'djamel-aps-v2';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/icon-web-01.png',
  '/logo192.png',
  '/offline.html',
  // ✅ Agregar rutas principales de tu app
  '/',
  '/search',
  '/profile'
  // Agrega aquí las rutas principales de tu React app
];
// INSTALACIÓN
self.addEventListener('install', (event) => {
  console.log('🔄 Service Worker: Installation...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Service Worker: Ressources de mise en cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('✅ Service Worker: Installation terminée');
        return self.skipWaiting();
      })
      .catch(error => {
        console.log('❌ Service Worker: Error en instalaction', error);
      })
  );
});

// ACTIVACIÓN
self.addEventListener('activate', (event) => {
  console.log('🔥 Service Worker: Activé...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('🗑️ Service Worker: Eliminando cache viejo', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker: activé et prêt!');
      return self.clients.claim();
    })
  );
});

// FETCH - Estrategia mejorada
self.addEventListener('fetch', (event) => {
  // No manejar requests que no sean GET
  if (event.request.method !== 'GET') return;
  
  // Excluir chrome-extension y otros
  if (event.request.url.indexOf('chrome-extension') !== -1) return;

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Devolver del cache si existe
        if (response) {
          return response;
        }

        // Hacer fetch y cachear
        return fetch(event.request)
          .then(fetchResponse => {
            // Solo cachear respuestas válidas
            if (!fetchResponse || fetchResponse.status !== 200 || !fetchResponse.type === 'basic') {
              return fetchResponse;
            }

            // Clonar para cachear
            const responseToCache = fetchResponse.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return fetchResponse;
          })
          .catch(error => {
            console.log('🌐 Fetch failed:', error);
            // Podrías devolver una página offline aquí
          });
      })
  );
});