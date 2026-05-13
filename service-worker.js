/**
 * PWA offline — incrementar CACHE_NAME al publicar cambios.
 */
const CACHE_NAME = "en-es-game-v5";

const PRECACHE_URLS = [
  "./",
  "./index.html",
  "./styles.css",
  "./manifest.webmanifest",
  "./js/storage.js",
  "./js/theme-large-text.js",
  "./js/normalize-answer.js",
  "./js/srs.js",
  "./js/speech.js",
  "./js/tracks-meta.js",
  "./js/game-progress.js",
  "./js/items-registry.js",
  "./js/exercise-engine.js",
  "./js/placement.js",
  "./js/app.js",
  "./data/tenses.js",
  "./data/irregular-verbs.js",
  "./data/phrasal-verbs.js",
  "./data/idioms.js",
  "./data/false-friends.js",
  "./data/prepositions.js",
  "./data/articles-quantifiers.js",
  "./data/placement-test.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.all(
        PRECACHE_URLS.map((url) =>
          cache.add(url).catch((err) => {
            console.warn("[SW] precache failed for", url, err);
          })
        )
      )
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) {
        fetch(req)
          .then((resp) => {
            if (resp && resp.ok) {
              const copy = resp.clone();
              caches.open(CACHE_NAME).then((c) => c.put(req, copy)).catch(() => {});
            }
          })
          .catch(() => {});
        return cached;
      }
      return fetch(req)
        .then((resp) => {
          if (resp && resp.ok) {
            const copy = resp.clone();
            caches.open(CACHE_NAME).then((c) => c.put(req, copy)).catch(() => {});
          }
          return resp;
        })
        .catch(() => caches.match("./index.html"));
    })
  );
});
