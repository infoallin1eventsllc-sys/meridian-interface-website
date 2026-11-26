/* Meridian Live Cards: demo mode, for trying the whole app before the service exists.
   It only ever runs on a test copy (localhost or a *.vercel.app preview) and only after ?demo=1 is opened once; ?demo=0 turns it off.
   On meridianinterface.com it never starts, whatever the address says. While it runs, everything (sign-in, cards, pictures, counts,
   people who send their info) is kept in this browser only and nothing is sent anywhere. It replaces the service parts of
   window.LiveCardsAPI with stand-ins that follow the same rules as the real service. Loaded after api.js. */
(function(){'use strict';
const A=window.LiveCardsAPI;if(!A)return;
const host=location.hostname,TEST=/^(localhost|127\.0\.0\.1)$/.test(host)||/\.vercel\.app$/.test(host);
/** Pure check, kept separate so it can be tested: demo mode is allowed only on a test copy. */
window.LiveCardsDemoAllowed=h=>/^(localhost|127\.0\.0\.1)$/.test(h)||/\.vercel\.app$/.test(h);
let want=false;try{const q=new URLSearchParams(location.search).get('demo');if(q==='1')localStorage.setItem('lc_demo','1');if(q==='0')localStorage.removeItem('lc_demo');want=localStorage.getItem('lc_demo')==='1'}catch(e){}
if(!TEST||!want||A.enabled)return;
const L=A.local,UID='00000000-0000-4000-8000-0000000000d0',E=(m,s,c)=>new A.ApiError(m,s||0,c||'demo');
const RESERVED=['admin','api','app','card','cards','c','studio','live','live-cards','meridian','meridianinterface','meridian-interface','otis','otis-williams','owner','support','help','login','signin','signup','account','settings','billing','pay','payment','checkout','security','terms','privacy','sample','demo','test','www','mail','null','undefined'];
// pictures are kept as data addresses so they survive a reload; a video only lasts until the page is closed (the real service keeps it)
const toData=b=>new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=()=>rej(E('That file could not be read.'));r.readAsDataURL(b)});
const db=async()=>(await L.get('demo'))||{cards:[],hits:{},leads:{},user:null};
const put=async d=>{await L.set('demo',d)};
let session=null;try{session=JSON.parse(localStorage.getItem('lc_demo_session')||'null')}catch(e){}
const keep=s=>{session=s;try{s?localStorage.setItem('lc_demo_session',JSON.stringify(s)):localStorage.removeItem('lc_demo_session')}catch(e){}};
const auth={get user(){return session},
  async sendCode(email){email=String(email||'').trim().toLowerCase();if(!/^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/.test(email))throw E('Enter a valid email address.');auth._email=email;return {}},
  async verify(email,code){code=String(code).replace(/\D/g,'');if(code.length<6||code.length>10)throw E('That code did not work.',400,'code');keep({id:UID,email:String(email).trim().toLowerCase()});return session},
  async signOut(){keep(null)},
  async deleteAccount(){await put({cards:[],hits:{},leads:{},user:null});keep(null)}};
const clean=d=>window.LiveCardView?window.LiveCardView.normalize(d):d;
const cards={
  async bySlug(slug){const d=await db(),c=d.cards.find(x=>x.slug===String(slug)&&x.published);return c?{slug:c.slug,data:c.data}:null},
  async mine(){if(!session)throw E('Please sign in again.',401,'signed_out');return (await db()).cards.map(c=>Object.assign({},c))},
  async slugFree(slug){const d=await db();return !RESERVED.includes(slug)&&!d.cards.some(c=>c.slug===slug)},
  async save(id,slug,data,published){if(!session)throw E('Please sign in again.',401,'signed_out');const d=await db();let c=id&&d.cards.find(x=>x.id===id);
    if(!c){if(d.cards.length>=5)throw E('Your plan allows 5 cards.',400,'P0001');if(d.cards.some(x=>x.slug===slug))throw E('That link is taken. Try another.',409,'23505');c={id:(crypto.randomUUID?crypto.randomUUID():'c'+Date.now()),created_at:new Date().toISOString()};d.cards.push(c)}
    else if(slug!==c.slug&&d.cards.some(x=>x.slug===slug))throw E('That link is taken. Try another.',409,'23505');
    Object.assign(c,{slug,data:clean(data),published:!!published,updated_at:new Date().toISOString()});await put(d);return Object.assign({},c)},
  async remove(id){const d=await db();d.cards=d.cards.filter(c=>c.id!==id);await put(d)},
  async upload(blob,kind){if(!session)throw E('Please sign in again.',401,'signed_out');if(/^video\//.test(blob.type)){if(kind!=='bg')throw E('That file type cannot be used. Use a JPG or PNG picture, or an MP4, MOV or WebM video.',0,'type');return URL.createObjectURL(blob)}
    if(!/^image\/(jpeg|png)$/.test(blob.type)||(blob.type==='image/png'&&kind!=='logo'))throw E('That file type cannot be used. Use a JPG or PNG picture, or an MP4, MOV or WebM video.',0,'type');return toData(blob)},
  async tidy(){},
  async report(){return null}};
const billing={enabled:true,async plan(){return 'pro'},async open(){throw E('Payments are not part of the demo.')}};
const EV=/^(open|call|text|email|book|web|map|save|review|pay|social)$/;
const activity={enabled:true,
  hit(slug,ev){if(!EV.test(ev))return;db().then(d=>{if(!d.cards.some(c=>c.slug===slug&&c.published))return;const h=d.hits[slug]=d.hits[slug]||{};h[ev]=(h[ev]||0)+1;return put(d)}).catch(()=>{})},
  async sendInfo(slug,info){const d=await db(),c=d.cards.find(x=>x.slug===slug&&x.published);if(!c||!(c.data.actions&&c.data.actions.leads))throw E('Not accepted.',400);
    const list=d.leads[slug]=d.leads[slug]||[];if(list.length>=50)throw E('Too many.',429);
    list.unshift({id:(crypto.randomUUID?crypto.randomUUID():'l'+Date.now()),name:String(info.name).slice(0,60),contact:String(info.contact).slice(0,200),note:String(info.note||'').slice(0,200),created_at:new Date().toISOString()});
    const h=d.hits[slug]=d.hits[slug]||{};h.info=(h.info||0)+1;await put(d);return null},
  async stats(slug){const h=Object.assign({},(await db()).hits[slug]||{}),opens=h.open||0;delete h.open;return {days:30,opens,taps:h}},
  async people(slug){return (await db()).leads[slug]||[]},
  async forget(id){const d=await db();for(const k in d.leads)d.leads[k]=d.leads[k].filter(l=>l.id!==id);await put(d)}};
Object.assign(A,{enabled:true,demo:true,auth,cards,billing,activity});
A.config=Object.assign({},A.config,{site:location.origin,humanCheck:'',appOrigin:''});
// a plain bar at the top so nobody mistakes the demo for the real thing
function bar(){if(document.getElementById('lc-demo'))return;const b=document.createElement('div'),t=document.createElement('span'),x=document.createElement('a');b.id='lc-demo';b.className='lc-demo';b.setAttribute('role','note');
  t.textContent='Demo: everything stays on this phone. Nothing is sent anywhere.';x.href=location.pathname+'?demo=0';x.textContent='Leave demo';b.append(t,x);document.body.prepend(b)}
if(document.body)bar();else document.addEventListener('DOMContentLoaded',bar);
})();
