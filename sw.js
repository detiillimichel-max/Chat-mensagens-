const CACHE = "chat-v1";

// Esta lista deve ter APENAS arquivos que você sabe que existem no GitHub
const assets = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png", // <--- Este nome precisa estar certo
  "./icon-512.png"  // <--- Este nome precisa estar certo
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => {
      console.log("Arquivos cacheados com sucesso!");
      // O 'addAll' só funciona se TODOS os arquivos da lista existirem no GitHub
      return cache.addAll(assets);
    })
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
