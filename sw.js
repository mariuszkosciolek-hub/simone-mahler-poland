/* Simone Mahler Poland Plan — gated build service worker */
const CACHE = 'sm-poland-gate-mqwbuljd';
/* Only static assets are pre-cached. index.html (the encrypted gate) is fetched
   network-first so a new build / new credentials always load when online. */
const ASSETS = ['./manifest.webmanifest','./icon.svg','./icon-maskable.svg'];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k)=>k!==CACHE).map((k)=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const isPage = req.mode === 'navigate' || url.pathname.endsWith('/') || url.pathname.endsWith('/index.html');
  if (isPage) {
    // network-first: always try the live gate, fall back to cache only when offline
    e.respondWith(
      fetch(req).then((r) => { const cp = r.clone(); caches.open(CACHE).then((c) => c.put(req, cp)); return r; })
                .catch(() => caches.match(req))
    );
    return;
  }
  // cache-first for static assets
  e.respondWith(caches.match(req).then((c) => c || fetch(req)));
});
