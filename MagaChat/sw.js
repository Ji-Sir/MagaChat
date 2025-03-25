const CACHE_NAME = 'weixin-clone-v1';
const urlsToCache = [
  './',
  './index.html',
  './moments.html',
  './css/style.css',
  './css/icons.css',
  './css/font-awesome.min.css',
  './js/script.js',
  './js/moments.js',
  './images/avatar1.jpg',
  './images/avatar2.jpg',
  './images/avatar3.jpg',
  './images/avatar4.jpg',
  './images/avatar5.jpg',
  './images/avatar6.jpg',
  './images/avatar7.jpg',
  './images/my-avatar.jpg',
  './images/icons/check.png',
  './images/icons/folder.png',
  './images/icons/heart-outline.png',
  './images/icons/heart.png',
  './images/icons/image.png',
  './images/icons/infinity.png',
  './images/icons/link.png',
  './images/icons/music.png',
  './images/icons/pay.png',
  './images/icons/plus.png',
  './images/icons/question.png',
  './images/icons/settings.png',
  './images/icons/shopping.png',
  './images/icons/smile.png',
  './images/icons/user-plus.png',
  './images/icons/wallet.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request)
          .then(response => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            return response;
          });
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // 强制清除所有缓存
          return caches.delete(cacheName);
        })
      );
    })
  );
});