/* Live Cards Studio. The draft lives on the device and saves as you type; signing in and publishing are only used when the service is switched on. */
(function(){'use strict';
const A=window.LiveCardsAPI,V=window.LiveCardView,$=id=>document.getElementById(id),phone=$('lc'),engine=window.LiveCard.init(phone);
const ACCENTS=['#2563eb','#0f766e','#b45309','#be123c','#6d28d9','#111827'],SLUG=/^[a-z0-9](?:[a-z0-9-]{1,38}[a-z0-9])$/;
let draft={data:{name:'',company:'',role:'',tagline:'',accent:'#2563eb',logo:{url:'',line1:'',line2:''},actions:{},background:{type:'scene',id:engine.glOK?'ocean':'sunrise',fit:'fill',sound:true}},bgBlob:null,logoBlob:null,cardId:null,slug:'',published:false};
const urls={};const blobUrl=(k,b)=>{if(!b){if(urls[k]){URL.revokeObjectURL(urls[k].u);delete urls[k]}return''}if(!urls[k]||urls[k].b!==b){if(urls[k])URL.revokeObjectURL(urls[k].u);urls[k]={b,u:URL.createObjectURL(b)}}return urls[k].u};
const get=(o,path)=>path.split('.').reduce((x,k)=>x==null?x:x[k],o),put=(o,path,v)=>{const ks=path.split('.'),last=ks.pop();ks.reduce((x,k)=>x[k]||(x[k]={}),o)[last]=v};
let toastT;function toast(m){const t=$('toast');t.textContent=m;t.hidden=false;clearTimeout(toastT);toastT=setTimeout(()=>{t.hidden=true},5200)}
const state=m=>{$('state').textContent=m};
{const pv=$('pv'),fit=()=>{phone.style.transform='scale('+(pv.clientWidth/360)+')'};new ResizeObserver(fit).observe(pv);fit()}
// ---------- preview and saving
function viewData(){const d=JSON.parse(JSON.stringify(draft.data));if(draft.bgBlob)d.background.url=blobUrl('bg',draft.bgBlob);if(draft.logoBlob)d.logo.url=blobUrl('logo',draft.logoBlob);return d}
let lastBg='';function paint(){const d=viewData(),bgKey=JSON.stringify(d.background);V.render(phone,d,{engine:bgKey===lastBg?null:engine});lastBg=bgKey}
let saveT;function changed(){paint();clearTimeout(saveT);state('Saving…');saveT=setTimeout(async()=>{await A.local.set('draft',draft);state(draft.published?'Saved here. Publish again to update your link.':'Saved on this device')},350)}
// ---------- form
function fill(){document.querySelectorAll('[data-k]').forEach(el=>{const v=get(draft.data,el.dataset.k);if(el.type==='checkbox')el.checked=!!v;else el.value=v||''});
  $('logo-clear').hidden=!(draft.logoBlob||draft.data.logo.url);const own=draft.data.background.type!=='scene';$('own-opts').hidden=!own;
  $('fit-fill').setAttribute('aria-pressed',String(draft.data.background.fit!=='band'));$('fit-band').setAttribute('aria-pressed',String(draft.data.background.fit==='band'));$('f-sound').checked=draft.data.background.sound!==false;
  document.querySelectorAll('#scenes button').forEach(b=>b.setAttribute('aria-pressed',String(!own&&b.dataset.id===draft.data.background.id)));
  document.querySelectorAll('#swatches button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.c===draft.data.accent)));$('f-slug').value=draft.slug||''}
document.querySelectorAll('[data-k]').forEach(el=>el.addEventListener(el.type==='checkbox'?'change':'input',()=>{put(draft.data,el.dataset.k,el.type==='checkbox'?el.checked:el.value);changed()}));
for(const c of ACCENTS){const b=document.createElement('button');b.type='button';b.dataset.c=c;b.style.background=c;b.setAttribute('aria-label','Button color '+c);b.addEventListener('click',()=>{draft.data.accent=c;fill();changed()});$('swatches').appendChild(b)}
{let col='',grp;for(const s of engine.scenes){if(s.col!==col){col=s.col;grp=document.createElement('div');grp.className='grp';const l=document.createElement('div');l.className='col';l.textContent=col;grp.appendChild(l);$('scenes').appendChild(grp)}
  const b=document.createElement('button');b.type='button';b.dataset.id=s.id;b.textContent=s.name;b.addEventListener('click',()=>{draft.data.background=Object.assign({},draft.data.background,{type:'scene',id:s.id,url:''});draft.bgBlob=null;blobUrl('bg',null);$('bg-note').textContent=s.hint||'';fill();changed()});grp.appendChild(b)}}
document.querySelectorAll('.tabs button').forEach(t=>t.addEventListener('click',()=>{document.querySelectorAll('.tabs button').forEach(x=>{const on=x===t;x.setAttribute('aria-selected',String(on));$(x.getAttribute('aria-controls')).hidden=!on});if(t.id==='t-publish')pubView()}));
$('f-logo').addEventListener('change',async e=>{const f=e.target.files[0];e.target.value='';if(!f)return;try{draft.logoBlob=await A.shrinkImage(f);draft.data.logo.url='';fill();changed()}catch(err){toast(err.message)}});
$('logo-clear').addEventListener('click',()=>{draft.logoBlob=null;blobUrl('logo',null);draft.data.logo.url='';fill();changed()});
$('f-bg').addEventListener('change',async e=>{const f=e.target.files[0];e.target.value='';if(!f)return;
  try{const isV=f.type.startsWith('video/');if(!isV&&!f.type.startsWith('image/'))throw new Error('Please choose a photo or a video.');
    draft.bgBlob=isV?await A.checkVideo(f):await A.shrinkImage(f);draft.data.background=Object.assign({},draft.data.background,{type:isV?'video':'image',url:''});$('bg-note').textContent=(isV?'Video':'Photo')+' added. It stays on this device until you publish.';fill();changed()}catch(err){toast(err.message)}});
for(const [id,v] of [['fit-fill','fill'],['fit-band','band']])$(id).addEventListener('click',()=>{draft.data.background.fit=v;fill();changed()});
$('f-sound').addEventListener('change',e=>{draft.data.background.sound=e.target.checked;changed()});
// ---------- share / publish
const cardLink=()=>(A.config.site||location.origin)+'/c/'+draft.slug;let pendingEmail='';
function pubView(){const on=A.enabled,user=A.auth.user,show=(id,v)=>{$(id).hidden=!v};
  show('pub-off',!on);show('pub-email',on&&!user&&!pendingEmail);show('pub-code',on&&!user&&!!pendingEmail);show('pub-go',on&&!!user&&!draft.published);show('pub-done',on&&!!user&&draft.published);show('acct',on&&!!user);
  if(user)$('acct-who').textContent='Signed in as '+user.email;$('site-prefix').textContent=(A.config.site||location.origin).replace(/^https?:\/\//,'')+'/c/';
  if(on&&user&&draft.published){$('pub-link').textContent=cardLink();window.QRCode.toCanvas($('pub-qr'),cardLink(),{width:200,margin:1,errorCorrectionLevel:'M'},()=>{});$('pub-share').hidden=!navigator.share}}
const busy=(btn,on,label)=>{btn.disabled=on;if(label)btn.textContent=label};
$('pub-email').addEventListener('submit',async e=>{e.preventDefault();const b=e.target.querySelector('button'),em=$('f-acct').value.trim();busy(b,true);try{await A.auth.sendCode(em);pendingEmail=em;pubView();$('f-code').focus()}catch(err){toast(err.status===429?'Too many tries. Wait a minute and try again.':err.message)}busy(b,false)});
$('code-back').addEventListener('click',()=>{pendingEmail='';pubView()});
$('pub-code').addEventListener('submit',async e=>{e.preventDefault();const b=e.target.querySelector('button');busy(b,true);
  try{await A.auth.verify(pendingEmail,$('f-code').value);pendingEmail='';$('f-code').value='';await adopt();pubView()}catch(err){toast(err.status===401||err.status===403||err.status===400?'That code did not work. Check it or ask for a new one.':err.message)}busy(b,false)});
async function adopt(){if(draft.cardId)return;try{const mine=await A.cards.mine();if(mine&&mine[0]){const m=mine[0];draft.cardId=m.id;draft.slug=m.slug;draft.published=m.published;if(!draft.data.name){draft.data=m.data;draft.bgBlob=draft.logoBlob=null}fill();lastBg='';changed()}}catch(e){}}
$('f-slug').addEventListener('input',e=>{const v=e.target.value.toLowerCase().replace(/[^a-z0-9-]/g,'-').replace(/-+/g,'-');if(v!==e.target.value)e.target.value=v;$('slug-note').textContent='Lowercase letters, numbers and dashes.'});
async function publish(e){e.preventDefault();const b=$('pub-btn'),slug=$('f-slug').value.trim();
  if(!SLUG.test(slug)){$('slug-note').textContent='Use 3 to 40 lowercase letters, numbers or dashes, starting and ending with a letter or number.';return}
  if(!draft.data.name.trim()){toast('Add your name on the Details tab first.');return}
  busy(b,true,'Publishing…');
  try{if(slug!==draft.slug||!draft.cardId){if(!(await A.cards.slugFree(slug))){$('slug-note').textContent='That link is taken. Try another.';busy(b,false,'Publish my card');return}}
    const stamp=Date.now().toString(36);
    if(draft.bgBlob){draft.data.background.url=await A.cards.upload(draft.bgBlob,'bg-'+stamp+(draft.data.background.type==='video'?'.mp4':'.jpg'));draft.bgBlob=null;blobUrl('bg',null)}
    if(draft.logoBlob){draft.data.logo.url=await A.cards.upload(draft.logoBlob,'logo-'+stamp+'.jpg');draft.logoBlob=null;blobUrl('logo',null)}
    const row=await A.cards.save(draft.cardId,slug,V.normalize(draft.data),true);draft.cardId=row.id;draft.slug=row.slug;draft.published=true;await A.local.set('draft',draft);lastBg='';paint();state('Published');pubView()}
  catch(err){toast(err.code==='23505'?'That link is taken. Try another.':err.message)}busy(b,false,'Publish my card')}
$('pub-go').addEventListener('submit',publish);
$('pub-copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(cardLink());toast('Link copied')}catch(e){toast(cardLink())}});
$('pub-share').addEventListener('click',()=>{navigator.share({title:draft.data.name,text:'My digital business card',url:cardLink()}).catch(()=>{})});
$('pub-unpub').addEventListener('click',async()=>{try{await A.cards.save(draft.cardId,draft.slug,V.normalize(draft.data),false);draft.published=false;await A.local.set('draft',draft);state('Saved on this device');pubView();toast('Your card is offline. Publish again any time.')}catch(err){toast(err.message)}});
$('acct-out').addEventListener('click',async()=>{await A.auth.signOut();pubView()});
let delArmed=0;$('acct-del').addEventListener('click',async e=>{if(Date.now()-delArmed>6000){delArmed=Date.now();e.target.textContent='Tap again to delete everything';setTimeout(()=>{e.target.textContent='Delete my account and card'},6000);return}
  try{await A.auth.deleteAccount();draft.cardId=null;draft.slug='';draft.published=false;await A.local.set('draft',draft);pubView();toast('Your account and public card were deleted.')}catch(err){toast(err.message)}});
// ---------- install
let installEvt=null;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installEvt=e;$('install-btn').hidden=false;$('install-how').hidden=true});
$('install-btn').addEventListener('click',async()=>{if(!installEvt)return;installEvt.prompt();await installEvt.userChoice.catch(()=>{});installEvt=null;$('install-btn').hidden=true});
if(window.matchMedia('(display-mode: standalone)').matches||navigator.standalone)$('install').hidden=true;
if('serviceWorker' in navigator&&location.protocol==='https:')navigator.serviceWorker.register('/studio/sw.js').catch(()=>{});
// ---------- start
A.local.get('draft').then(async d=>{if(d&&d.data){draft=Object.assign(draft,d);draft.data.logo=draft.data.logo||{};draft.data.actions=draft.data.actions||{};draft.data.background=draft.data.background||{type:'scene',id:'ocean'}}fill();paint();if(A.enabled&&A.auth.user)await adopt()});
})();
