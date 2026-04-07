const CACHE_NAME = 'oio-vibe-v1';

const ARQUIVOS = [
  './',
  './index.html',
  './css/main.css',
  './css/glass-theme.css',
  './css/social-twitter.css',
  './css/style.css',
  './js/app.js',
  './js/database.js',
  './app/ehub_logic.js',
  './components/contacts-list.html',
  './components/chat-screen.html',
  './components/explore-grid.html',
  './components/profile-screen.html',
  './components/call-screen.html',
  './icon-192.png'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return Promise.allSettled(ARQUIVOS.map(url => cache.add(url)));
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
  return self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).then(response => {
        if (response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      });
    })
  );
});
