const CACHE = "vibe-cache-v1";

// Arquivos que serão guardados no celular para o app abrir rápido
const assets = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png" // Garanta que subiu esse arquivo no GitHub
];

// Instalação do Service Worker
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => {
      console.log("Arquivos cacheados com sucesso!");
      return cache.addAll(assets);
    })
  );
});

// Ativação e limpeza de caches antigos
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE).map(key => caches.delete(key))
      );
    })
  );
});

// Responde com o cache ou busca na rede
self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request);
    })
  );
});
