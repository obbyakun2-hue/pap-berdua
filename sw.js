// Service worker PAP Berdua — syarat agar bisa di-install di Android (Chrome)
// & membantu aplikasi terbuka cepat. Data Supabase selalu diambil dari jaringan.
const CACHE = "pap-berdua-v2";
const SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-180.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  // Hanya tangani file aplikasi sendiri; Supabase & CDN selalu lewat jaringan
  if (url.origin !== self.location.origin) return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(hit => {
      const ambil = fetch(e.request).then(res => {
        if (res && res.status === 200 && e.request.method === "GET") {
          const salinan = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, salinan));
        }
        return res;
      }).catch(() => hit);
      return hit || ambil;
    })
  );
});
