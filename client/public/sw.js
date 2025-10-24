// Configuración - ¡Personaliza estas variables!
const CACHE_NAME = 'tu-app-mern-v1.0';
const API_CACHE_NAME = 'tu-app-api-v1.0';
const STATIC_CACHE_NAME = 'tu-app-static-v1.0';

// URLs para cachear
const STATIC_ASSETS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/favicon.ico'
];

// Estrategias de cache
const STRATEGIES = {
  STATIC: 'cache-first',
  API: 'network-first',
  IMAGES: 'cache-first'
};

// 📦 INSTALACIÓN - Cachear recursos críticos
self.addEventListener('install', (event) => {
  console.log('🔄 Service Worker instalando...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('📦 Cacheando recursos estáticos');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('✅ Todos los recursos cacheados');
        return self.skipWaiting(); // Activar inmediatamente
      })
      .catch((error) => {
        console.error('❌ Error en instalación:', error);
      })
  );
});

// 🎯 ACTIVACIÓN - Limpiar caches viejos
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activado');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && 
              cacheName !== API_CACHE_NAME && 
              cacheName !== STATIC_CACHE_NAME) {
            console.log('🗑️ Eliminando cache viejo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker listo para controlar clientes');
      return self.clients.claim();
    })
  );
});

// 🌐 FETCH - Interceptar peticiones
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Estrategia para APIs
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
  }
  // Estrategia para assets estáticos
  else if (isStaticAsset(url)) {
    event.respondWith(handleStaticRequest(request));
  }
  // Estrategia para imágenes
  else if (isImageRequest(request)) {
    event.respondWith(handleImageRequest(request));
  }
  // Estrategia por defecto
  else {
    event.respondWith(handleDefaultRequest(request));
  }
});

// 🎯 ESTRATEGIAS DE CACHE

// Para APIs - Network First
async function handleApiRequest(request) {
  const cache = await caches.open(API_CACHE_NAME);
  
  try {
    // Intentar network primero
    const networkResponse = await fetch(request);
    
    // Cachear respuesta exitosa
    if (networkResponse.ok) {
      await cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Fallback a cache si no hay conexión
    console.log('🌐 Fallando a cache para API');
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Respuesta de error elegante
    return new Response(
      JSON.stringify({ 
        error: 'Sin conexión', 
        message: 'No hay conexión y no hay datos en cache' 
      }),
      { 
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Para assets estáticos - Cache First
async function handleStaticRequest(request) {
  const cache = await caches.open(STATIC_CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    await cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    // Fallback para HTML - servir la app shell
    if (request.destination === 'document') {
      return cache.match('/');
    }
    throw error;
  }
}

// Para imágenes - Cache First con actualización
async function handleImageRequest(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    // Actualizar cache en background
    fetch(request).then((networkResponse) => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse);
      }
    });
    return cachedResponse;
  }
  
  const networkResponse = await fetch(request);
  if (networkResponse.ok) {
    await cache.put(request, networkResponse.clone());
  }
  return networkResponse;
}

// Estrategia por defecto
async function handleDefaultRequest(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  return fetch(request);
}

// 🔍 HELPERS
function isStaticAsset(url) {
  return url.pathname.startsWith('/static/') ||
         url.pathname.endsWith('.js') ||
         url.pathname.endsWith('.css') ||
         url.pathname.endsWith('.json');
}

function isImageRequest(request) {
  return request.destination === 'image';
}

// 📱 Manejo de mensajes (para actualizaciones)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});