import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';

// 1. Precache App Shell
precacheAndRoute(self.__WB_MANIFEST);

// 2. Cache API Stories (StaleWhileRevalidate)
registerRoute(
  ({ url }) => url.href.startsWith('https://story-api.dicoding.dev/v1/stories'),
  new StaleWhileRevalidate({
    cacheName: 'story-api-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Hari
      }),
    ],
  })
);

// 3. Cache Gambar (CacheFirst)
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Hari
      }),
    ],
  })
);

// 4. Push Notification Handler
self.addEventListener('push', (event) => {
  let data = { title: 'Story App', options: { body: 'Ada cerita baru!' } };

  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'Story App', options: { body: event.data.text() } };
    }
  }

  const options = {
    body: data.options.body || 'New Notification',
    icon: './icons/icon-192x192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});