/* Live Cards Studio: keeps the app opening when the connection is poor. App files are cached; saved cards and uploads always go to the network. */
const V='lc-studio-v1',SHELL=['/studio/','/live/card.css','/live/studio.css','/live/config.js','/live/api.js','/live/engine.js','/live/card-view.js','/live/studio.js','/live/qrcode.min.js','/fonts/hanken-grotesk-var-latin.woff2','/fonts/inter-var-latin.woff2','/studio/icon-192.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==location.origin)return;
  if(!(u.pathname.startsWith('/studio/')||u.pathname.startsWith('/live/')||u.pathname.startsWith('/fonts/')))return;
  e.respondWith(fetch(e.request).then(r=>{if(r.ok){const cp=r.clone();caches.open(V).then(c=>c.put(e.request,cp))}return r}).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match('/studio/'))))});
