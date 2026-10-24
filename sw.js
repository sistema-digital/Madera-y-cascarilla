/* PWA Madera y Cascarilla · CACHE BUST 2026-10-24 horómetros v3 · historial previo de 16 tramos
   Usar junto al index.html actualizado. No mezcla estimaciones y viajes. */
const CACHE_VERSION='madera-horometros-v20261024-3-historico';
self.addEventListener('install',event=>{
 event.waitUntil((async()=>{const cache=await caches.open(CACHE_VERSION);try{await cache.add('./index.html')}catch(e){console.warn('Sin precarga de index',e)}await self.skipWaiting()})());
});
self.addEventListener('activate',event=>{
 event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(k=>k.startsWith('madera-horometros-')&&k!==CACHE_VERSION).map(k=>caches.delete(k)));await self.clients.claim()})());
});
self.addEventListener('fetch',event=>{
 const req=event.request;
 if(req.method!=='GET'||new URL(req.url).origin!==self.location.origin)return;
 if(req.mode==='navigate'||new URL(req.url).pathname.endsWith('/index.html')){
  event.respondWith((async()=>{
   try{const res=await fetch(req,{cache:'no-store'});if(res.ok){const cache=await caches.open(CACHE_VERSION);await cache.put('./index.html',res.clone())}return res}
   catch(e){const cache=await caches.open(CACHE_VERSION);const backup=await cache.match('./index.html');if(backup)return backup;throw e}
  })());
 }
});
