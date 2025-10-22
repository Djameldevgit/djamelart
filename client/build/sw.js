// public/sw.js - VERSIÓN CORREGIDA PARA RENDER.COM
const CACHE_NAME = 'djamel-aps-v3-render';
const OFFLINE_URL = '/offline.html';

// ✅ Recursos esenciales para cache
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png'
];

// INSTALACIÓN
self.addEventListener('install', (event) => {
  console.log('🔄 Service Worker: Instalando en Render.com...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Cacheando recursos esenciales');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('✅ Service Worker: Instalación completada');
        return self.skipWaiting();
      })
      .catch(error => {
        console.log('❌ Service Worker: Error en instalación', error);
      })
  );
});

// ACTIVACIÓN
self.addEventListener('activate', (event) => {
  console.log('🔥 Service Worker: Activando...');
  
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
      console.log('✅ Service Worker: Activado y listo!');
      return self.clients.claim();
    })
  );
});

// FETCH - Estrategia Cache First
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
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
            if (!fetchResponse || fetchResponse.status !== 200) {
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
            // Para navegación, devolver página offline
            if (event.request.mode === 'navigate') {
              return caches.match('/');
            }
          });
      })
  );
});