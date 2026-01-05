const CACHE_NAME = 'my-pro-app-cache-v1';
// ඔයාට cache කරන්න ඕනේ files මෙතන දාන්න
const urlsToCache = [
  '/',
  '/index.html',
  '/Smedia.html',
  '/principal.html',
  '/sw.js',
  '/teacher.html',
  '/logo.png',
  '/offline.html' // ඉන්ටර්නෙට් නැති වෙලාවට පෙන්වන්න වෙනම page එකක් (optional)
];

// Service Worker එක Install වන විට Files ටික Cache කිරීම
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// පරණ Cache files අයින් කර අලුත් version එක active කිරීම
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Network එක නැති වෙලාවට Cache එකෙන් Data ලබා දීම (Offline Support)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache එකේ තියෙනවා නම් ඒක දෙනවා, නැත්නම් network එකෙන් ගන්නවා
        return response || fetch(event.request).catch(() => {
          // Network එකත් නැත්නම්, Cache එකෙත් නැත්නම් offline page එක පෙන්වනවා
          return caches.match('/offline.html');
        });
      })
  );
});