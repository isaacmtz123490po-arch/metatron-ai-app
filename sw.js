const CACHE='metatron-device-v4';
const BASE=new URL('./',self.registration.scope);
const ASSETS=['','index.html','manifest.webmanifest','icon.svg','icon-192.png','icon-512.png','knowledge.json','qr.png'].map(p=>new URL(p,BASE).toString());
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('metatron-device-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||url.origin!==location.origin)return;
 if(url.pathname.endsWith('/version.json')){event.respondWith(fetch(event.request,{cache:'no-store'}));return;}
 event.respondWith(caches.match(event.request).then(hit=>hit||fetch(event.request).then(response=>{if(response.ok&&url.pathname.startsWith(new URL('./',self.registration.scope).pathname)){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));}return response;}).catch(()=>caches.match(new URL('index.html',BASE).toString()))));
});
