// // const CACHE_NAME = "music-player-cache-v1";
// // const urlsToCache = ["/", "/index.html", "/styles.css", "/script.js"];

// // self.addEventListener("install", (event) => {
// //   event.waitUntil(
// //     caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
// //   );
// // });

// // self.addEventListener("fetch", (event) => {
// //   event.respondWith(
// //     caches
// //       .match(event.request)
// //       .then((response) => response || fetch(event.request))
// //   );
// // });

// const CACHE_NAME = "music-player-cache-v1";
// const urlsToCache = [
//   "/250815-player/",
//   "/250815-player/index.html",
//   "/250815-player/styles.css",
//   "/250815-player/script.js",
// ];

// self.addEventListener("install", (event) => {
//   event.waitUntil(
//     caches.open(CACHE_NAME).then((cache) => {
//       console.log("Caching files:", urlsToCache); // Debug
//       return cache.addAll(urlsToCache).catch((err) => {
//         console.error("Cache addAll failed:", err); // Debug
//         throw err;
//       });
//     })
//   );
// });

// self.addEventListener("fetch", (event) => {
//   event.respondWith(
//     caches.match(event.request).then((response) => {
//       if (response) {
//         console.log("Serving from cache:", event.request.url); // Debug
//         return response;
//       }
//       return fetch(event.request).catch(() => {
//         console.error("Fetch failed:", event.request.url); // Debug
//         return caches.match("/250815-player/index.html"); // Fallback
//       });
//     })
//   );
// });

const CACHE_NAME = "music-player-cache-v1";
const urlsToCache = [
  "/250815-player/",
  "/250815-player/index.html",
  "/250815-player/styles.css",
  "/250815-player/script.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Attempting to cache:", urlsToCache);
        return Promise.all(
          urlsToCache.map((url) =>
            fetch(url, { cache: "no-store" })
              .then((response) => {
                if (!response.ok) {
                  console.warn(`Failed to fetch ${url}: ${response.status}`);
                  return null; // Skip failed requests
                }
                return cache.put(url, response);
              })
              .catch((err) => {
                console.warn(`Cache failed for ${url}:`, err);
                return null;
              })
          )
        ).then((results) => {
          console.log(
            "Caching completed:",
            results.filter((r) => r !== null).length,
            "files cached"
          );
        });
      })
      .catch((err) => {
        console.error("Cache open failed:", err);
      })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        console.log("Serving from cache:", event.request.url);
        return response;
      }
      console.log("Fetching from network:", event.request.url);
      return fetch(event.request).catch(() => {
        console.error("Fetch failed, serving fallback:", event.request.url);
        return caches.match("/250815-player/index.html");
      });
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    })
  );
});
