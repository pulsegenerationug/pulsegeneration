const CACHE_NAME = "pulse-generation-v1";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.json",
  "./assets/pulse-logo-192.png",
  "./assets/pulse-logo-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).catch(() => {})
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

// Cache the website shell only. Never intercept or cache application
// downloads (.apk / .exe) or third-party API/video requests.
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  if (/\.(apk|exe)$/i.test(url.pathname)) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request)
          .then((response) => {
            if (event.request.method === "GET" && response.ok) {
              const clone = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
            }
            return response;
          })
          .catch(() => caches.match("./index.html"))
      );
    })
  );
});
