const VER = 'v21';                       // ← ПРИ КАЖДОМ АПДЕЙТЕ меняй: v2, v3, v4...
const CACHE = 'cards-' + VER;

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k.startsWith('cards-') && k !== CACHE)
            .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.open(CACHE).then(c =>
      c.match(e.request).then(r =>
        r || fetch(e.request).then(res => {
          if (res && res.status === 200 && res.type === 'basic')
            c.put(e.request, res.clone());
          return res;
        }).catch(() => r)
      )
    )
  );
});
