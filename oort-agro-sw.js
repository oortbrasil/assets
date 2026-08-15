const APP_URL='./';

self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));

self.addEventListener('notificationclick',event=>{
  event.notification.close();
  const target=(event.notification.data&&event.notification.data.url)||APP_URL;
  event.waitUntil((async()=>{
    const list=await clients.matchAll({type:'window',includeUncontrolled:true});
    for(const client of list){
      if('focus' in client){await client.focus();return;}
    }
    if(clients.openWindow)return clients.openWindow(target);
  })());
});

// Já deixa o Service Worker preparado para Web Push no futuro.
// Quando houver um backend de push, ele pode enviar {title, body, tag, url}.
self.addEventListener('push',event=>{
  let data={};
  try{data=event.data?event.data.json():{};}catch(e){data={body:event.data?event.data.text():''};}
  const title=data.title||'Oort Agro';
  const options={
    body:data.body||'Nova atualização meteorológica disponível.',
    icon:'https://raw.githubusercontent.com/oortbrasil/assets/main/icon.png',
    badge:'https://raw.githubusercontent.com/oortbrasil/assets/main/icon.png',
    tag:data.tag||'oort-agro-push',
    data:{url:data.url||APP_URL}
  };
  event.waitUntil(self.registration.showNotification(title,options));
});
