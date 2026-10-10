self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(caches.open('frases-v1').then(c=>c.match(e.request).then(r=>r||fetch(e.request).then(res=>{
    if(res&&res.status===200&&res.type==='basic')c.put(e.request,res.clone());
    return res;
  }).catch(()=>r))));
});
