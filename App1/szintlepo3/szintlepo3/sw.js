/* Szintlépő service worker — app-shell cache offline használathoz. */
const CACHE = "szintlepo-v3";
const CORE = ["./","./index.html","./manifest.webmanifest","./firebase-config.js",
  "./icons/icon-192.png","./icons/icon-512.png","./icons/icon-maskable-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(()=>self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener("fetch", e => {
  const req = e.request; if (req.method !== "GET") return;
  const url = new URL(req.url);
  // Firebase/Google kéréseket sose a cache-ből szolgáljuk ki
  if (/gstatic|googleapis|firebase/.test(url.host)) return;
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
    if (res && res.status === 200 && req.url.startsWith("http")) { const c = res.clone(); caches.open(CACHE).then(x=>x.put(req,c)).catch(()=>{}); }
    return res;
  }).catch(()=>caches.match("./index.html"))));
});
