const CACHE_NAME = 'darlehen-cache-v3'; // <— Version erhöhen, wenn du etwas änderst

const URLS_TO_CACHE = [
  'index.html',
  'manifest.webmanifest'
];

// Install: Cache neu laden
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(URLS_TO_CACHE))
  );
  self.skipWaiting(); // sofort aktiv werden
});

// Activate: alte Caches löschen
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim(); // neue Version sofort nutzen
});

// Fetch: immer zuerst online versuchen, dann Cache
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // neue Version speichern
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request)) // offline fallback
  );
});


