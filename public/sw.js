/* eslint-disable no-restricted-globals */
// Service Worker seguro para o Orquideas PWA.
// Princípios:
//  - NUNCA cachear navegação (HTML): sempre busca da rede, evitando servir HTML
//    obsoleto que referencia chunks antigos após um rebuild.
//  - Assets estáticos do Next (/_next/static) e ícones: stale-while-revalidate.
//  - Ao ativar, apaga todos os caches de versões anteriores.
const CACHE = "orquideas-cache-v2";
const PRECACHE = ["/manifest.webmanifest", "/icon.svg"];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)).catch(() => {})
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Navegação (HTML): sempre rede. Fallback mínimo se estiver offline.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(
        () => caches.match("/offline") || new Response("Offline", { status: 503 })
      )
    );
    return;
  }

  // Assets estáticos: stale-while-revalidate.
  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
