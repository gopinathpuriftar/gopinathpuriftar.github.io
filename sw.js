const C="iftar-v2";
const PRE=["./","index.html","manifest.webmanifest","firebase-config.js","icon-192.png","icon-512.png","apple-touch-icon.png"];
self.addEventListener("install",e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>Promise.all(PRE.map(u=>c.add(u).catch(()=>{})))))});
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>clients.claim())));
const SKIP=/firestore\.googleapis\.com|identitytoolkit|securetoken|accounts\.google\.com|apis\.google\.com|firebaseinstallations|firebaseapp\.com|googleapis\.com\/(v1|v2|identitytoolkit)/;
self.addEventListener("fetch",e=>{
 const r=e.request;if(r.method!="GET")return;
 const u=new URL(r.url);
 if(SKIP.test(u.href)||u.pathname.startsWith("/__/"))return;
 e.respondWith(caches.open(C).then(async c=>{
  const hit=await c.match(r,{ignoreSearch:r.mode=="navigate"});
  const net=fetch(r).then(res=>{if(res&&(res.ok||res.type=="opaque"))c.put(r,res.clone());return res}).catch(()=>null);
  if(hit){e.waitUntil(net);return hit}
  const res=await net;
  if(res)return res;
  if(r.mode=="navigate")return (await c.match("index.html"))||(await c.match("./"))||Response.error();
  return Response.error()}))});
