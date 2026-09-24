// Service worker — Receta médica (app shell offline)
const CACHE = 'receta-v1';
const CORE = ['./', './index.html',
  './icons/icon-192.png','./icons/icon-512.png','./icons/maskable-512.png','./icons/icon-180.png'];
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE).catch(()=>{})));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // no interceptar Firebase / APIs externas
  if (url.origin !== location.origin) return;
  // navegaciones -> index.html (cache-first, red de respaldo)
  if (req.mode === 'navigate') {
    e.respondWith(caches.match('./index.html').then(r => r || fetch(req)).catch(()=>caches.match('./index.html')));
    return;
  }
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(req, copy)).catch(()=>{});
      return res;
    }).catch(()=>hit))
  );
});
