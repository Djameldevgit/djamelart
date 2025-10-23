// public/sw.js - VERSIÓN ARTE DJAMEL CON CACHE ESTRATÉGICO
const CACHE_NAME = 'djamel-art-v3';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png',
  '/static/js/bundle.js',
  '/static/css/main.css'
];

// INSTALACIÓN - TEXTO ARTÍSTICO
self.addEventListener('install', (event) => {
  console.log('🎨 Service Worker Djamel Art: Instalando galería...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('🖼️ Service Worker: Cacheando obras maestras');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('✅ Service Worker Djamel Art: Galería instalada');
        return self.skipWaiting();
      })
      .catch(error => {
        console.log('❌ Service Worker: Error en la instalación', error);
      })
  );
});

// ACTIVACIÓN
self.addEventListener('activate', (event) => {
  console.log('🔥 Service Worker Djamel Art: Activando exposición...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('🔄 Service Worker: Renovando exposición anterior', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker Djamel Art: Exposición activada!');
      return self.clients.claim();
    })
  );
});

// FETCH - Estrategia Cache First con fallback a network
self.addEventListener('fetch', (event) => {
  // No manejar requests que no sean GET
  if (event.request.method !== 'GET') return;
  
  // Excluir chrome-extension y otros
  if (event.request.url.indexOf('chrome-extension') !== -1) return;
  
  // Para solicitudes de la misma origen
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          if (cachedResponse) {
            console.log('🎭 Sirviendo desde galería cacheada:', event.request.url);
            return cachedResponse;
          }
          
          return fetch(event.request)
            .then(response => {
              // Verificar si la respuesta es válida
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }
              
              // Clonar la respuesta para cachear
              const responseToCache = response.clone();
              
              caches.open(CACHE_NAME)
                .then(cache => {
                  console.log('💾 Guardando nueva obra en galería:', event.request.url);
                  cache.put(event.request, responseToCache);
                });
              
              return response;
            })
            .catch(error => {
              console.log('🌐 Conexión falló, mostrando galería offline:', error);
              // Podrías devolver una página de galería offline personalizada aquí
            });
        })
    );
  }
});

// Manejar mensajes del cliente
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('🔄 Service Worker: Actualizando galería inmediatamente');
    self.skipWaiting();
  }
});