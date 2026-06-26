/* Simone Mahler Poland Plan — gated build service worker */
const CACHE = 'sm-poland-gate-v2';
const ASSETS = ['./','./index.html','./manifest.webmanifest','./icon.svg','./icon-maskable.svg'];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k)=>k!==CACHE).map((k)=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  e.respondWith(caches.match(req).then((c) => c || fetch(req)));
});
