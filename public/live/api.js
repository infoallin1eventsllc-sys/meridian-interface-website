/* Meridian Live Cards: the one place that saves and loads. Two homes for a card:
   the device (IndexedDB, always available, private to this phone) and the service (accounts, public links), used only when switched on. */
(function(){'use strict';
const C=window.LIVE_CARDS_CONFIG||{},ON=!!(C.enabled&&C.url&&C.key),SKEY='lc_session';
// ---------- device storage
function idb(){return new Promise((res,rej)=>{const r=indexedDB.open('meridian-live-cards',1);r.onupgradeneeded=()=>r.result.createObjectStore('kv');r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
async function kv(mode,fn){const db=await idb();return new Promise((res,rej)=>{const tx=db.transaction('kv',mode),rq=fn(tx.objectStore('kv'));tx.oncomplete=()=>res(rq&&rq.result);tx.onerror=()=>rej(tx.error)})}
const local={get:k=>kv('readonly',s=>s.get(k)).catch(()=>undefined),set:(k,v)=>kv('readwrite',s=>s.put(v,k)).catch(()=>undefined),del:k=>kv('readwrite',s=>s.delete(k)).catch(()=>undefined)};
// ---------- account (email code)
let session=null;try{session=JSON.parse(localStorage.getItem(SKEY)||'null')}catch(e){}
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
  sendCode:email=>call('/auth/v1/otp',{method:'POST',body:{email,create_user:true}}),
  async verify(email,code){keep(await call('/auth/v1/verify',{method:'POST',body:{type:'email',email,token:String(code).trim()}}));return session.user},
  async signOut(){try{await call('/auth/v1/logout',{method:'POST',auth:true})}catch(e){}saveSession(null)},
  async deleteAccount(){const u=session&&session.user;if(!u)return;
    try{const files=await call('/storage/v1/object/list/'+C.bucket,{method:'POST',auth:true,body:{prefix:u.id+'/',limit:200}});if(files&&files.length)await call('/storage/v1/object/'+C.bucket,{method:'DELETE',auth:true,body:{prefixes:files.map(f=>u.id+'/'+f.name)}})}catch(e){}
    await call('/rest/v1/rpc/lc_delete_account',{method:'POST',auth:true,body:{}});saveSession(null)}};
// ---------- cards on the service
const cards={
  async bySlug(slug){const j=await call('/rest/v1/lc_cards?select=slug,data&slug=eq.'+encodeURIComponent(slug)+'&limit=1');return j&&j[0]||null},
  async mine(){return call('/rest/v1/lc_cards?select=id,slug,data,published,updated_at&order=updated_at.desc',{auth:true})},
  async slugFree(slug){const j=await call('/rest/v1/rpc/lc_slug_available',{method:'POST',body:{p_slug:slug}});return j===true},
  async save(id,slug,data,published){const row={slug,data,published};
    const j=id?await call('/rest/v1/lc_cards?id=eq.'+id,{method:'PATCH',auth:true,body:row,headers:{Prefer:'return=representation'}}):await call('/rest/v1/lc_cards',{method:'POST',auth:true,body:row,headers:{Prefer:'return=representation'}});return j&&j[0]},
  async upload(blob,name){const u=session.user.id,path=u+'/'+name;await call('/storage/v1/object/'+C.bucket+'/'+path,{method:'POST',auth:true,raw:true,body:blob,headers:{'Content-Type':blob.type||'application/octet-stream','x-upsert':'true','cache-control':'max-age=31536000'}});
    return C.url+'/storage/v1/object/public/'+C.bucket+'/'+path},
  report:(slug,reason)=>call('/rest/v1/lc_reports',{method:'POST',body:{slug,reason:String(reason).slice(0,500)}})};
// ---------- media helpers (run on the device before anything is saved)
function shrinkImage(file){return new Promise((res,rej)=>{const im=new Image(),u=URL.createObjectURL(file);im.onload=()=>{const m=C.maxImagePx||1800,k=Math.min(1,m/Math.max(im.naturalWidth,im.naturalHeight)),c=document.createElement('canvas');
    c.width=Math.round(im.naturalWidth*k);c.height=Math.round(im.naturalHeight*k);c.getContext('2d').drawImage(im,0,0,c.width,c.height);URL.revokeObjectURL(u);c.toBlob(b=>b?res(b):rej(new Error('Could not read that picture.')),'image/jpeg',.86)};
  im.onerror=()=>{URL.revokeObjectURL(u);rej(new Error('Could not read that picture. Try a JPG or PNG.'))};im.src=u})}
function checkVideo(file){return new Promise((res,rej)=>{if(file.size>(C.maxVideoMB||25)*1048576)return rej(new Error('That video is larger than '+(C.maxVideoMB||25)+' MB. Trim it in your Photos app and try again.'));
  const v=document.createElement('video'),u=URL.createObjectURL(file);v.preload='metadata';v.onloadedmetadata=()=>{const d=v.duration;URL.revokeObjectURL(u);d>(C.maxVideoSeconds||30)+.5?rej(new Error('That video is longer than '+(C.maxVideoSeconds||30)+' seconds. Trim it and try again.')):res(file)};
  v.onerror=()=>{URL.revokeObjectURL(u);rej(new Error('This phone cannot play that video file. Try an MP4.'))};v.src=u})}
window.LiveCardsAPI={enabled:ON,config:C,local,auth,cards,shrinkImage,checkVideo,ApiError};
})();
