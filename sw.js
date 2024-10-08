self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open('snake-game').then((cache) => {
            return cache.addAll([
                './',
                './index.html',
                './styles.css',
                './script.js',
                './icon-192x192.png',
                './icon-512x512.png',
            ]);
        })
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => {
            return response || fetch(e.request);
        })
    );
});
