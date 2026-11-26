/* Meridian Live Cards: the one place that saves and loads. Two homes for a card:
   the device (IndexedDB, always available, private to this phone) and the service (accounts, public links), used only when switched on. */
(function(){'use strict';
const C=window.LIVE_CARDS_CONFIG||{};
// When the app has its own address, it runs only there. Anywhere else: drop any sign-in kept here and go to the right place.
if(/^https:\/\/[a-z0-9.-]+$/.test(C.appOrigin||'')&&/^https?:$/.test(location.protocol)&&location.origin!==C.appOrigin&&!/^(localhost|127\.0\.0\.1)$/.test(location.hostname)){
  try{localStorage.removeItem('lc_session')}catch(e){}location.replace(C.appOrigin+location.pathname+location.search);throw new Error('Live Cards runs at '+C.appOrigin)}
const ON=!!(C.enabled&&/^https:\/\/[a-z0-9.-]+$/.test(C.url||'')&&C.key&&/^[a-z0-9-]{3,40}$/.test(C.bucket||'')),SKEY='lc_session';
// ---------- device storage
function idb(){return new Promise((res,rej)=>{const r=indexedDB.open('meridian-live-cards',1);r.onupgradeneeded=()=>r.result.createObjectStore('kv');r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
async function kv(mode,fn){const db=await idb();return new Promise((res,rej)=>{const tx=db.transaction('kv',mode),rq=fn(tx.objectStore('kv'));tx.oncomplete=()=>res(rq&&rq.result);tx.onerror=()=>rej(tx.error)})}
const local={get:k=>kv('readonly',s=>s.get(k)).catch(()=>undefined),set:(k,v)=>kv('readwrite',s=>s.put(v,k)).catch(()=>undefined),del:k=>kv('readwrite',s=>s.delete(k)).catch(()=>undefined)};
// ---------- account (email code)
let session=null;try{session=JSON.parse(localStorage.getItem(SKEY)||'null')}catch(e){}
if(session&&!(typeof session.access_token==='string'&&typeof session.refresh_token==='string'&&session.user&&/^[0-9a-f-]{36}$/.test(session.user.id||'')))session=null;
const saveSession=s=>{session=s;try{s?localStorage.setItem(SKEY,JSON.stringify(s)):localStorage.removeItem(SKEY)}catch(e){}};
class ApiError extends Error{constructor(msg,status,code){super(msg);this.status=status;this.code=code}}
async function call(path,{method='GET',body,auth,headers={},raw}={}){
  if(!ON)throw new ApiError('The Live Cards service is not switched on yet.',0,'off');
  const h=Object.assign({apikey:C.key},headers);if(auth){const t=await token();if(!t)throw new ApiError('Please sign in again.',401,'signed_out');h.Authorization='Bearer '+t}else h.Authorization='Bearer '+C.key;
  if(body!==undefined&&!raw)h['Content-Type']='application/json';
  let r;try{r=await fetch(C.url+path,{method,headers:h,body:body===undefined?undefined:raw?body:JSON.stringify(body)})}catch(e){throw new ApiError('No connection. Check your internet and try again.',0,'offline')}
  const txt=await r.text();let j=null;try{j=txt?JSON.parse(txt):null}catch(e){}
  if(!r.ok)throw new ApiError((j&&(j.msg||j.message||j.error_description||j.error))||('Request failed ('+r.status+')'),r.status,j&&(j.code||j.error_code));return j}
async function token(){if(!session)return null;if(session.expires_at-60>Date.now()/1000)return session.access_token;
  try{const j=await call('/auth/v1/token?grant_type=refresh_token',{method:'POST',body:{refresh_token:session.refresh_token}});keep(j);return session.access_token}catch(e){if(e.status>=400&&e.status<500)saveSession(null);return null}}
function keep(j){saveSession({access_token:j.access_token,refresh_token:j.refresh_token,expires_at:Math.floor(Date.now()/1000)+(j.expires_in||3600),user:{id:j.user.id,email:j.user.email}})}
const auth={get user(){return session&&session.user},
  sendCode(email,humanCheck){email=String(email||'').trim().toLowerCase();if(!/^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/.test(email))return Promise.reject(new ApiError('Enter a valid email address.',0,'email'));
    const body={email,create_user:true};if(humanCheck)body.gotrue_meta_security={captcha_token:humanCheck};return call('/auth/v1/otp',{method:'POST',body})},
  async verify(email,code){code=String(code).replace(/\D/g,'');if(code.length<6||code.length>10)throw new ApiError('That code did not work.',400,'code');
    keep(await call('/auth/v1/verify',{method:'POST',body:{type:'email',email:String(email).trim().toLowerCase(),token:code}}));return session.user},
  async signOut(){try{await call('/auth/v1/logout',{method:'POST',auth:true})}catch(e){}saveSession(null)},
  async deleteAccount(){const u=session&&session.user;if(!u)return;
    try{const files=await call('/storage/v1/object/list/'+C.bucket,{method:'POST',auth:true,body:{prefix:u.id+'/',limit:200}});if(files&&files.length)await call('/storage/v1/object/'+C.bucket,{method:'DELETE',auth:true,body:{prefixes:files.map(f=>u.id+'/'+f.name)}})}catch(e){}
    await call('/rest/v1/rpc/lc_delete_account',{method:'POST',auth:true,body:{}});saveSession(null)}};
// ---------- cards on the service
const cards={
  /** One published card by its exact link name. The service has no way to list cards. */
  async bySlug(slug){const d=await call('/rest/v1/rpc/lc_get_card',{method:'POST',body:{p_slug:String(slug)}});return d&&typeof d==='object'?{slug,data:d}:null},
  async mine(){return call('/rest/v1/lc_cards?select=id,slug,data,published,updated_at&order=updated_at.desc',{auth:true})},
  async slugFree(slug){const j=await call('/rest/v1/rpc/lc_slug_available',{method:'POST',body:{p_slug:slug}});return j===true},
  async save(id,slug,data,published){const row={slug,data,published};
    const j=id?await call('/rest/v1/lc_cards?id=eq.'+id,{method:'PATCH',auth:true,body:row,headers:{Prefer:'return=representation'}}):await call('/rest/v1/lc_cards',{method:'POST',auth:true,body:row,headers:{Prefer:'return=representation'}});return j&&j[0]},
  /** Deletes one of this account's own cards. */
  remove(id){if(!/^[0-9a-f-]{36}$/.test(id||''))return Promise.reject(new ApiError('Not found.',404,'id'));return call('/rest/v1/lc_cards?id=eq.'+id,{method:'DELETE',auth:true})},
  /** kind is 'bg' (background), 'logo', 'photo' (headshot) or 'og' (the link preview picture). The service only accepts
      <account>/(bg|logo|photo|og)-<letters and numbers>.(jpg|mp4|mov|webm), up to 12 files an account. Only a background may be a video;
      only a logo may be a PNG (kept when it has a see-through background). */
  async upload(blob,kind){const ext=EXT[blob.type];kind=['logo','photo','og'].includes(kind)?kind:'bg';if(!ext||(ext==='png'&&kind!=='logo')||(kind!=='bg'&&ext!=='jpg'&&ext!=='png'))throw new ApiError('That file type cannot be used. Use a JPG or PNG picture, or an MP4, MOV or WebM video.',0,'type');
    const u=session.user.id,name=kind+'-'+Date.now().toString(36)+Math.floor(Math.random()*1296).toString(36)+'.'+ext,path=u+'/'+name;
    await call('/storage/v1/object/'+C.bucket+'/'+path,{method:'POST',auth:true,raw:true,body:blob,headers:{'Content-Type':blob.type,'cache-control':'max-age=31536000'}});
    return C.url+'/storage/v1/object/public/'+C.bucket+'/'+path},
  /** Deletes this account's uploaded files that are not in keep (a list of file addresses). Keeps the account under the file limit. */
  async tidy(keep){const u=session&&session.user;if(!u)return;const pre=C.url+'/storage/v1/object/public/'+C.bucket+'/'+u.id+'/',want=new Set((keep||[]).filter(k=>typeof k==='string'&&k.startsWith(pre)).map(k=>k.slice(pre.length)));
    try{const files=await call('/storage/v1/object/list/'+C.bucket,{method:'POST',auth:true,body:{prefix:u.id+'/',limit:100}}),old=(files||[]).map(f=>f.name).filter(n=>n&&!want.has(n));
      if(old.length)await call('/storage/v1/object/'+C.bucket,{method:'DELETE',auth:true,body:{prefixes:old.map(n=>u.id+'/'+n)}})}catch(e){}},
  report:(slug,reason)=>call('/rest/v1/rpc/lc_report',{method:'POST',body:{p_slug:String(slug),p_reason:String(reason).slice(0,500)}})};
const EXT={'image/jpeg':'jpg','image/png':'png','video/mp4':'mp4','video/quicktime':'mov','video/webm':'webm'};
// ---------- media helpers (run on the device before anything is saved)
/** Shrinks a picture on the device before anything is saved. o.max: longest side in pixels. o.alpha: keep a see-through background (saved as PNG; used for logos only). */
function shrinkImage(file,o){o=o||{};return new Promise((res,rej)=>{const im=new Image(),u=URL.createObjectURL(file);im.onload=()=>{const w=im.naturalWidth,h=im.naturalHeight,c=document.createElement('canvas'),m=o.max||C.maxImagePx||1800,k=Math.min(1,m/Math.max(w,h)),x=c.getContext('2d');
    c.width=Math.max(1,Math.round(w*k));c.height=Math.max(1,Math.round(h*k));x.drawImage(im,0,0,c.width,c.height);URL.revokeObjectURL(u);
    let clear=false;if(o.alpha)try{const d=x.getImageData(0,0,c.width,c.height).data;for(let i=3;i<d.length;i+=28)if(d[i]<250){clear=true;break}}catch(e){}
    c.toBlob(b=>b?res(b):rej(new Error('Could not read that picture.')),clear?'image/png':'image/jpeg',.86)};
  im.onerror=()=>{URL.revokeObjectURL(u);rej(new Error('Could not read that picture. Try a JPG or PNG.'))};im.src=u})}
function checkVideo(file){return new Promise((res,rej)=>{if(!EXT[file.type]||file.type.startsWith('image/'))return rej(new Error('That video type cannot be used. Use an MP4, MOV or WebM video.'));if(file.size>(C.maxVideoMB||25)*1048576)return rej(new Error('That video is larger than '+(C.maxVideoMB||25)+' MB. Trim it in your Photos app and try again.'));
  const v=document.createElement('video'),u=URL.createObjectURL(file);v.preload='metadata';v.onloadedmetadata=()=>{const d=v.duration;URL.revokeObjectURL(u);d>(C.maxVideoSeconds||30)+.5?rej(new Error('That video is longer than '+(C.maxVideoSeconds||30)+' seconds. Trim it and try again.')):res(file)};
  v.onerror=()=>{URL.revokeObjectURL(u);rej(new Error('This phone cannot play that video file. Try an MP4.'))};v.src=u})}
// ---------- plans (off until config.billing is true). Card details are only ever typed on Stripe's own page; this just asks the service for that page's address.
const billing={enabled:ON&&C.billing===true,
  async plan(){const j=await call('/rest/v1/lc_accounts?select=plan&limit=1',{auth:true});return j&&j[0]&&j[0].plan==='pro'?'pro':'free'},
  /** action is 'checkout' or 'portal'. Returns an address only if it is really Stripe's. */
  async open(action){if(!billing.enabled)throw new ApiError('Plans are not available yet.',0,'off');
    const j=await call('/functions/v1/lc-billing',{method:'POST',auth:true,body:{action:action==='portal'?'portal':'checkout'}}),u=j&&j.url;
    if(typeof u!=='string'||!/^https:\/\/(checkout|billing)\.stripe\.com\//.test(u))throw new ApiError('The payment page could not be opened.',0,'billing');return u}};
// ---------- activity (off until config.activity is true). Counts only: how many opens and taps, never who.
const activity={enabled:ON&&C.activity===true,
  /** Adds one to a card's count for an event (open, call, save and so on). Never waits and never fails loudly. */
  hit(slug,ev){if(!activity.enabled||!slug)return;try{fetch(C.url+'/rest/v1/rpc/lc_hit',{method:'POST',keepalive:true,headers:{apikey:C.key,Authorization:'Bearer '+C.key,'Content-Type':'application/json'},body:JSON.stringify({p_slug:String(slug),p_event:String(ev).slice(0,12)})}).catch(()=>{})}catch(e){}},
  /** A visitor leaves their own name and a way to reach them for the card's owner. */
  sendInfo(slug,d){return call('/rest/v1/rpc/lc_send_info',{method:'POST',body:{p_slug:String(slug),p_name:String(d.name||'').slice(0,60),p_contact:String(d.contact||'').slice(0,200),p_note:String(d.note||'').slice(0,200)}})},
  /** For one of the signed-in account's own cards, by its link name. */
  stats(slug){return call('/rest/v1/rpc/lc_card_stats',{method:'POST',auth:true,body:{p_slug:String(slug||'')}})},
  people(slug){return call('/rest/v1/rpc/lc_card_leads',{method:'POST',auth:true,body:{p_slug:String(slug||'')}})},
  forget(id){if(!/^[0-9a-f-]{36}$/.test(id||''))return Promise.reject(new ApiError('Not found.',404,'id'));return call('/rest/v1/lc_leads?id=eq.'+id,{method:'DELETE',auth:true})}};
window.LiveCardsAPI={enabled:ON,config:C,local,auth,cards,billing,activity,shrinkImage,checkVideo,ApiError};
})();
