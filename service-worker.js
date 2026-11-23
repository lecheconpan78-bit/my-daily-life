const CACHE_NAME = "my-daily-life-v2";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./styles.css",
    "./responsive.css",
    "./manifest.json",
    "./database.js",
    "./navigation.js",
    "./app.js",
    "./tasks.js",
    "./subjects.js",
    "./calendar.js",
    "./routines.js",
    "./finances.js",
    "./ideas.js",
    "./goal.js",
    "./notes.js",
    "./reminders.js",
    "./backup.js",
    "./assets/icons/icon-192.png",
    "./assets/icons/icon-512.png"
];

// INSTALAR Y GUARDAR LOS ARCHIVOS DE LA APP
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(FILES_TO_CACHE))
            .then(() => self.skipWaiting())
    );
});

// ACTIVAR Y ELIMINAR CACHÉS ANTIGUAS
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        ).then(() => self.clients.claim())
    );
});

// RESPONDER DESDE CACHÉ SI NO HAY INTERNET
self.addEventListener("fetch", event => {
    if (event.request.method !== "GET") return;

    const url = new URL(event.request.url);
    if (url.origin !== self.location.origin) return;

    event.respondWith(
        caches.match(event.request).then(cached => {
            if (cached) return cached;

            return fetch(event.request).then(response => {
                if (response.ok) {
                    const copy = response.clone();
                    caches.open(CACHE_NAME).then(cache =>
                        cache.put(event.request, copy)
                    );
                }
                return response;
            }).catch(async () => {
                if (event.request.mode === "navigate") {
                    return await caches.match("./index.html");
                }
                throw new Error("Recurso no disponible sin conexión");
            });
        })
    );
});
