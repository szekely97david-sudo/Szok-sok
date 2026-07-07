/* Szintlépő service worker — app-shell cache offline használathoz. */
const CACHE = "szintlepo-v11";
const CORE = ["./","./index.html","./manifest.webmanifest","./firebase-config.js",
  "./icon-192.png","./icon-512.png","./icon-maskable-512.png","./icon-180.png",
  "./favicon.ico","./favicon-32.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE))); });
// A felhasználó a "Frissítés" ikonra kattintva aktiválja az új verziót:
self.addEventListener("message", e => { if (e.data === "SKIP_WAITING") self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener("fetch", e => {
  const req = e.request; if (req.method !== "GET") return;
  const url = new URL(req.url);
  // Firebase/Google kéréseket sose a cache-ből szolgáljuk ki
  if (/gstatic|googleapis|firebase/.test(url.host)) return;
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
    if (res &&