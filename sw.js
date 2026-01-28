const CACHE_NAME = 'leafink-v2'; 

const ASSETS = [
  'index.html',
  'manifest.json',
  'Leafink-icon.png',
  'Leafink-logo.png',
  'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.5/jszip.min.js',
  'https://cdn.jsdelivr.net/npm/epubjs/dist/epub.min.js'
];

// Unified Install Event
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Force new service worker to take over
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Unified Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      clients.claim(), // Take control of pages immediately
      caches.keys().then((keys) => {
        return Promise.all(
          keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
        );
      })
    ])
  );
});

// Fetch Event (Required for Install Prompt)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});




