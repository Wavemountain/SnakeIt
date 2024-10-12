// Define the files to cache
const cacheName = 'snake-game'; // Namn på cachet, används för att identifiera den här versionen av cachet.
const cacheFiles = [
    './', // Huvudkatalogen
    './index.html', // Startsidan
    './styles.css', // Stilmallarna för spelet
    './script.js', // JavaScript-koden för spelet
    './icon-192x192.png', // Ikon i mindre storlek
    './icon-512x512.png', // Ikon i större storlek
    './gameover-sound.mp3', // Ljud för när spelet tar slut
    './eat-sound.mp3' // Ljud för när äpplet äts upp
];

// Install event - cache specified files
self.addEventListener('install', (event) => {
    // Den här händelsen körs när service workern installeras
    event.waitUntil(
        caches.open(cacheName).then((cache) => {
            console.log('Caching app shell'); // Logga att cachen byggs upp
            return cache.addAll(cacheFiles); // Lägg till alla definierade filer i cachet
        })
    );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
    // Den här händelsen körs när en nätverksbegäran görs
    // Kontrollera om begäran är för en fil som finns i cachet
    if (cacheFiles.includes(new URL(event.request.url).pathname)) {
        event.respondWith(
            caches.match(event.request).then((response) => {
                // Om en cachelagrad fil hittas, returnera den, annars hämta från nätverket
                return response || fetch(event.request);
            })
        );
    }
});

// Activate event - cleanup old caches if cache name changes
self.addEventListener('activate', (event) => {
    // Den här händelsen körs när service workern aktiveras, används för att rensa gamla cache-versioner
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((thisCacheName) => {
                    // Ta bort gamla cacheversioner om namnet inte matchar det nuvarande
                    if (thisCacheName !== cacheName) {
                        console.log('Removing old cache:', thisCacheName);
                        return caches.delete(thisCacheName);
                    }
                })
            );
        })
    );
});
