const CACHE = 'es6-feed-v1';
const ASSETS = [
  '/', '/index.html', '/css/styles.css', '/js/app.js', '/js/feed.js', '/js/components/post.js', '/js/api.js'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(()=> self.skipWaiting()));
});
self.addEventListener('activate', e => { e.waitUntil(clients.claim()); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(f => {
    const res = f.clone();
    caches.open(CACHE).then(c => c.put(e.request, res));
    return f;
  })).catch(()=> caches.match('/index.html')));
});
