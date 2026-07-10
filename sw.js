/* Trellis service worker — v16
   Stratégia:
   - HTML/navigáció  -> NETWORK FIRST (mindig a friss oldalt kéri, offline-ra cache tartalék)
   - statikus fájlok -> STALE-WHILE-REVALIDATE (azonnal cache-ből, közben frissít háttérben)
   - Firebase/Google -> sose cache, mindig hálózat
   A cache-verziót MINDEN kiadásnál léptesd (v12 -> v13 ...), így az app-shell frissül. */
const VERSION = "v16";
const CACHE = "trellis-" + VERSION;

const CORE = [
  "./", "./index.html", "./manifest.webmanifest", "./firebase-config.js",
  "./icon-192.png", "./icon-512.png", "./icon-maskable-512.png", "./icon-180.png",
  "./favicon.ico", "./favicon-32.png",
  "./splash.mp4"
];

// Telepítés: app-shell előtöltése. NEM hívunk skipWaiting-et automatikusan —
// az új verzió "waiting" marad, amíg a felhasználó a Frissítés gombra nem kattint.
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).catch(() => {}));
});

// A UI "Frissítés" gombja ezt küldi: azonnal aktiváljuk az új verziót.
self.addEventListener("message", e => {
  if (e.data === "SKIP_WAITING") self.skipWaiting();
});

// Aktiválás: régi cache-ek törlése + azonnali átvétel.
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Igaz, ha HTML-oldal kérése (navigáció vagy Accept: text/html).
function isHtmlRequest(req) {
  if (req.mode === "navigate") return true;
  const accept = req.headers.get("accept") || "";
  return accept.includes("text/html");
}

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Firebase / Google / betűtípusok: sose a cache-ből — hagyjuk a böngészőre.
  if (/gstatic|googleapis|firebase/.test(url.host)) return;

  // Csak azonos eredetű (same-origin) kéréseket kezelünk.
  if (url.origin !== self.location.origin) return;

  // --- HTML: NETWORK FIRST ---
  if (isHtmlRequest(req)) {
    e.respondWith(
      fetch(req)
        .then(res => {
          // Friss oldal cache-be a következő offline induláshoz.
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put("./index.html", copy)).catch(() => {});
          return res;
        })
        .catch(() =>
          // Offline: cache-ből az oldal, végső esetben az app-shell index.html.
          caches.match(req).then(hit => hit || caches.match("./index.html"))
        )
    );
    return;
  }

  // --- Statikus fájlok: STALE-WHILE-REVALIDATE ---
  e.respondWith(
    caches.match(req).then(hit => {
      const net = fetch(req).then(res => {
        if (res && res.status === 200 && (res.type === "basic" || res.type === "default")) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        }
        return res;
      }).catch(() => hit);
      // Ha van cache, azonnal azt adjuk; a hálózati frissítés a háttérben fut.
      return hit || net;
    })
  );
});
