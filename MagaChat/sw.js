const CACHE_NAME = "weixin-clone-v2"; // Incremented version
const urlsToCache = [
  "./", // Cache the root
  "./index.html",
  "./moments.html",
  "./post-moment.html", // Added
  "./css/style.css",
  "./css/icons.css",
  "./js/script.js",
  "./js/moments.js", // Added type="module", but SW caches the file content
  "./js/post-moment.js", // Added
  "./js/virtual-users.js", // Added
  "./manifest.json", // Added manifest
  // Images (Avatars)
  "./images/avatar1.jpg",
  "./images/avatar2.jpg",
  "./images/avatar3.jpg",
  "./images/avatar4.jpg",
  "./images/avatar5.jpg",
  "./images/avatar6.jpg",
  "./images/avatar7.jpg",
  "./images/my-avatar.jpg",
  // Images (Icons - Add ALL used icons)
  "./images/icons/angle-left.png",
  "./images/icons/angle-right.png",
  "./images/icons/app-icon-192.png",
  "./images/icons/app-icon-512.png",
  "./images/icons/camera.png",
  "./images/icons/chat.png",
  "./images/icons/chat-outline.png",
  "./images/icons/check.png",
  "./images/icons/comment.png",
  "./images/icons/discover.png",
  "./images/icons/ellipsis-h.png",
  "./images/icons/emoji.png",
  "./images/icons/folder.png",
  "./images/icons/heart.png",
  "./images/icons/heart-outline.png",
  "./images/icons/image.png",
  "./images/icons/infinity.png",
  "./images/icons/link.png",
  "./images/icons/me.png",
  "./images/icons/microphone.png",
  "./images/icons/music.png",
  "./images/icons/pay.png",
  "./images/icons/plus.png",
  "./images/icons/qrcode.png",
  "./images/icons/question.png",
  "./images/icons/search.png",
  "./images/icons/settings.png",
  "./images/icons/shopping.png",
  "./images/icons/star.png",
  "./images/icons/user-plus.png",
  "./images/icons/wallet.png",
  // Add other assets like fonts if you use them
];

// Install event: Cache core assets
self.addEventListener("install", (event) => {
  console.log("[SW] Install event");
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("[SW] Caching core assets");
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error("[SW] Failed to cache core assets:", error);
      })
  );
});

// Activate event: Clean up old caches
self.addEventListener("activate", (event) => {
  console.log("[SW] Activate event");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete caches that are not the current one
          if (cacheName !== CACHE_NAME) {
            console.log("[SW] Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim(); // Ensure new SW takes control immediately
});

// Fetch event: Serve from cache first, fallback to network
self.addEventListener("fetch", (event) => {
  // console.log('[SW] Fetch event for:', event.request.url);
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return response
      if (response) {
        // console.log('[SW] Serving from cache:', event.request.url);
        return response;
      }

      // Not in cache - fetch from network
      // console.log('[SW] Fetching from network:', event.request.url);
      return fetch(event.request)
        .then((networkResponse) => {
          // Check if we received a valid response
          if (
            !networkResponse ||
            networkResponse.status !== 200 ||
            networkResponse.type !== "basic"
          ) {
            return networkResponse;
          }

          // Clone the response
          const responseToCache = networkResponse.clone();

          caches.open(CACHE_NAME).then((cache) => {
            // console.log('[SW] Caching new resource:', event.request.url);
            cache.put(event.request, responseToCache);
          });

          return networkResponse;
        })
        .catch((error) => {
          console.error(
            "[SW] Fetch failed; returning offline page instead.",
            error
          );
          // Optional: return a custom offline page
          // return caches.match('./offline.html');
        });
    })
  );
});
