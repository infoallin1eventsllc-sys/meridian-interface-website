/* Live Cards Studio. The draft lives on the device and saves as you type; signing in and publishing are only used when the service is switched on. */
(function(){'use strict';
const A=window.LiveCardsAPI,V=window.LiveCardView,$=id=>document.getElementById(id),phone=$('lc'),engine=window.LiveCard.init(phone);
const ACCENTS=['#2563eb','#0f766e','#b45309','#be123c','#6d28d9','#111827'],SLUG=/^[a-z0-9](?:[a-z0-9-]{1,38}[a-z0-9])$/;
const blank=()=>({data:{name:'',company:'',role:'',tagline:'',accent:'#2563eb',logo:{url:'',line1:'',line2:''},photo:{url:''},preview:{url:''},hours:'',actions:{},background:{type:'scene',id:engine.glOK?'ocean':'sunrise',fit:'fill',sound:true}},bgBlob:null,logoBlob:null,photoBlob:null,photoSrc:null,photoPos:{x:.5,y:.5,z:1},cardId:null,slug:'',published:false});
// `draft` is the card being edited. `book` holds every card on this device: one for most people, several for a team.
let draft=blank(),book={cards:[draft],at:0,same:true},teamPlan='';
const keep=()=>{book.cards[book.at]=draft;return Promise.all([A.local.set('draft',draft),A.local.set('book',{cards:book.cards,at:book.at,same:book.same})])};
const urls={};const blobUrl=(k,b)=>{if(!b){if(urls[k]){URL.revokeObjectURL(urls[k].u);delete urls[k]}return''}if(!urls[k]||urls[k].b!==b){if(urls[k])URL.revokeObjectURL(urls[k].u);urls[k]={b,u:URL.createObjectURL(b)}}return urls[k].u};
const get=(o,path)=>path.split('.').reduce((x,k)=>x==null?x:x[k],o),put=(o,path,v)=>{const ks=path.split('.'),last=ks.pop();ks.reduce((x,k)=>x[k]||(x[k]={}),o)[last]=v};
let toastT;function toast(m){const t=$('toast');t.textContent=m;t.hidden=false;clearTimeout(toastT);toastT=setTimeout(()=>{t.hidden=true},5200)}
const state=m=>{const e=$('state');e.textContent=m;e.dataset.s=/^Saving/.test(m)?'saving':'saved'};
let plan='',planBusy=false; // paid or free, asked from the service
const humanOn=/^[0-9A-Za-z_-]{10,60}$/.test(A.config.humanCheck||'')&&A.enabled;let humanToken='',humanId; // human check on sign-in
{const pv=$('pv'),fit=()=>{phone.style.transform='scale('+(pv.clientWidth/360)+')'};new ResizeObserver(fit).observe(pv);fit()}
// ---------- preview and saving
function viewData(){const d=JSON.parse(JSON.stringify(draft.data));if(draft.bgBlob)d.background.url=blobUrl('bg',draft.bgBlob);if(draft.logoBlob)d.logo.url=blobUrl('logo',draft.logoBlob);d.photo=d.photo||{};if(draft.photoBlob)d.photo.url=blobUrl('photo',draft.photoBlob);return d}
let lastBg='';function paint(){const d=viewData(),bgKey=JSON.stringify(d.background);V.render(phone,d,{engine:bgKey===lastBg?null:engine});lastBg=bgKey}
let saveT;let linkT;function changed(){if(draft.published){draft.dirty=true}if(book.same&&book.cards.length>1)spread();dirtyView();if(book.cards.length>1)whoView();paint();if(!$('p-publish').hidden){clearTimeout(linkT);linkT=setTimeout(linkView,500)}clearTimeout(saveT);state('Saving…');saveT=setTimeout(async()=>{await keep();state(draft.published?'Saved here. On the Share tab, tap Update my live card.':'Saved on this device')},350)}
// ---------- form
function fill(){document.querySelectorAll('[data-k]').forEach(el=>{const v=get(draft.data,el.dataset.k);if(el.type==='checkbox')el.checked=!!v;else el.value=v||''});
  $('logo-clear').hidden=!(draft.logoBlob||draft.data.logo.url);{const u=draft.photoBlob?blobUrl('photo',draft.photoBlob):V.media((draft.data.photo||{}).url),im=$('face-pv');im.hidden=!u;if(u&&im.getAttribute('src')!==u)im.src=u;$('photo-clear').hidden=!u;$('photo-word').textContent=u?'Change':'Add your photo';const adj=!!(u&&draft.photoSrc);$('face-adj').hidden=!adj;$('face-note').hidden=adj;im.classList.toggle('drag',adj);im.tabIndex=adj?0:-1;if(adj){im.setAttribute('aria-label','Your photo. Drag, or use the arrow keys, to move it.');$('f-zoom').value=draft.photoPos.z}else im.removeAttribute('aria-label')}
 const own=draft.data.background.type!=='scene';$('own-opts').hidden=!own;
  $('fit-fill').setAttribute('aria-pressed',String(draft.data.background.fit!=='band'));$('fit-band').setAttribute('aria-pressed',String(draft.data.background.fit==='band'));$('f-sound').checked=draft.data.background.sound!==false;
  document.querySelectorAll('#scenes button').forEach(b=>b.setAttribute('aria-pressed',String(!own&&b.dataset.id===draft.data.background.id)));
  document.querySelectorAll('#starts button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.id===draft.start)));
  document.querySelectorAll('#swatches button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.c===draft.data.accent)));$('f-slug').value=draft.slug||''}
document.querySelectorAll('[data-k]').forEach(el=>el.addEventListener(el.type==='checkbox'?'change':'input',()=>{put(draft.data,el.dataset.k,el.type==='checkbox'?el.checked:el.value);changed()}));
// ---------- starting points by trade: fills only what is still empty, or what an earlier starting point filled, so nothing typed is ever overwritten
const FIRST_SCENE=engine.glOK?'ocean':'sunrise',STARTS=[
  {id:'realtor',name:'Real estate',role:'Realtor',tagline:'Helping you buy and sell with confidence',book:'Book a showing',scene:'sunrise',accent:'#2563eb'},
  {id:'barber',name:'Barber or salon',role:'Barber',tagline:'Fresh cuts and sharp fades',book:'Book a cut',scene:'ribbon',accent:'#111827'},
  {id:'contractor',name:'Contractor',role:'General Contractor',tagline:'Remodels, repairs and new builds',book:'Request an estimate',scene:'sail',accent:'#b45309'},
  {id:'restaurant',name:'Restaurant',role:'Restaurant',tagline:'Dine in, takeout and catering',book:'Reserve a table',scene:'fire',accent:'#be123c'},
  {id:'consultant',name:'Consultant',role:'Consultant',tagline:'Clear advice for growing businesses',book:'Book a consultation',scene:'aurora',accent:'#0f766e'}];
function startWith(t){const d=draft.data,old=STARTS.find(x=>x.id===draft.start)||{},mine=(cur,was)=>!cur||cur===was;d.actions=d.actions||{};
  if(mine(d.role,old.role))d.role=t.role;if(mine(d.tagline,old.tagline))d.tagline=t.tagline;if(mine(d.actions.bookingLabel,old.book))d.actions.bookingLabel=t.book;
  if(d.accent===(old.accent||'#2563eb'))d.accent=t.accent;if(d.background.type==='scene'&&d.background.id===(old.scene||FIRST_SCENE))d.background=Object.assign({},d.background,{id:t.scene});
  draft.start=t.id;fill();lastBg='';changed()}
for(const t of STARTS){const b=document.createElement('button');b.type='button';b.dataset.id=t.id;b.textContent=t.name;b.addEventListener('click',()=>startWith(t));$('starts').appendChild(b)}
const ACCENT_NAMES=['Blue','Teal','Amber','Rose','Violet','Graphite'];
for(const [n,c] of ACCENTS.entries()){const b=document.createElement('button');b.type='button';b.dataset.c=c;b.style.background=c;b.title=ACCENT_NAMES[n];b.setAttribute('aria-label',ACCENT_NAMES[n]);b.addEventListener('click',()=>{draft.data.accent=c;fill();changed()});$('swatches').appendChild(b)}
{let col='',grp;for(const s of engine.scenes){if(s.col!==col){col=s.col;grp=document.createElement('div');grp.className='grp';const l=document.createElement('div');l.className='col';l.textContent=col;grp.appendChild(l);$('scenes').appendChild(grp)}
  const b=document.createElement('button'),im=document.createElement('img');b.type='button';b.dataset.id=s.id;im.src='/live/thumbs/'+s.id+'.jpg';im.alt='';im.width=120;im.height=150;im.loading='lazy';im.decoding='async';b.append(im,s.name);b.addEventListener('click',()=>{draft.data.background=Object.assign({},draft.data.background,{type:'scene',id:s.id,url:''});draft.bgBlob=null;blobUrl('bg',null);$('bg-note').textContent=s.hint||'';fill();changed()});grp.appendChild(b)}}
$('t-activity').hidden=$('leads-set').hidden=!A.activity.enabled;
const TABS=[...document.querySelectorAll('.tabs button')];
TABS.forEach((t,n)=>{t.addEventListener('click',()=>{TABS.forEach(x=>{const on=x===t;x.setAttribute('aria-selected',String(on));x.tabIndex=on?0:-1;$(x.getAttribute('aria-controls')).hidden=!on});if(t.id==='t-publish')pubView();if(t.id==='t-activity')actView();
    const top=document.querySelector('.panel').getBoundingClientRect().top+scrollY-(document.querySelector('.preview').offsetHeight+document.querySelector('.top').offsetHeight);if(scrollY>top&&matchMedia('(max-width:899px)').matches)scrollTo(0,Math.max(0,top))});
  t.tabIndex=t.getAttribute('aria-selected')==='true'?0:-1;t.addEventListener('keydown',e=>{const d=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0;if(!d)return;e.preventDefault();const live=TABS.filter(x=>!x.hidden),nx=live[(live.indexOf(t)+d+live.length)%live.length];nx.focus();nx.click()})});
$('f-logo').addEventListener('change',async e=>{const f=e.target.files[0];e.target.value='';if(!f)return;try{draft.logoBlob=await A.shrinkImage(f,{max:800,alpha:true});draft.data.logo.url='';fill();changed()}catch(err){toast(err.message)}});
$('logo-clear').addEventListener('click',()=>{draft.logoBlob=null;blobUrl('logo',null);draft.data.logo.url='';fill();changed()});
// ---------- headshot: the chosen photo is kept on this device so it can be moved and zoomed inside the circle; only the cut square is ever uploaded
let faceIm=null,faceOf=null,faceBusy=false,faceAgain=false;
async function cutFace(){if(faceBusy){faceAgain=true;return}faceBusy=true;try{const src=draft.photoSrc;if(src){if(faceOf!==src){faceIm=await loadImg(blobUrl('psrc',src));faceOf=src}const im=faceIm;if(im){const w=im.naturalWidth,h=im.naturalHeight,p=draft.photoPos,side=Math.min(w,h)/p.z,c=document.createElement('canvas');c.width=c.height=Math.max(1,Math.min(640,Math.round(side)));
      c.getContext('2d').drawImage(im,(w-side)*p.x,(h-side)*p.y,side,side,0,0,c.width,c.height);const b=await new Promise(r=>c.toBlob(r,'image/jpeg',.88));if(b&&draft.photoSrc===src){draft.photoBlob=b;draft.data.photo={url:''};fill();changed()}}}}finally{faceBusy=false;if(faceAgain){faceAgain=false;cutFace()}}}
const nudge=(dx,dy)=>{const p=draft.photoPos,im=faceIm;if(!im||!draft.photoSrc)return;const w=im.naturalWidth,h=im.naturalHeight,side=Math.min(w,h)/p.z,cl=v=>Math.max(0,Math.min(1,v));if(w-side>1)p.x=cl(p.x-dx*side/(w-side));if(h-side>1)p.y=cl(p.y-dy*side/(h-side));cutFace()}; // dx, dy as a share of the circle's width
$('f-photo').addEventListener('change',async e=>{const f=e.target.files[0];e.target.value='';if(!f)return;try{if(!f.type.startsWith('image/'))throw new Error('Please choose a photo.');const src=await A.shrinkImage(f,{max:1600}),im=await loadImg(blobUrl('psrc',src));if(!im)throw new Error('Could not read that picture. Try a JPG or PNG.');
    draft.photoSrc=src;faceIm=im;faceOf=src;draft.photoPos={x:.5,y:im.naturalHeight>im.naturalWidth?.3:.5,z:1};await cutFace()}catch(err){toast(err.message)}});
$('photo-clear').addEventListener('click',()=>{draft.photoBlob=draft.photoSrc=null;faceIm=faceOf=null;blobUrl('photo',null);blobUrl('psrc',null);draft.data.photo={url:''};fill();changed()});
{const im=$('face-pv');let at=null;im.addEventListener('pointerdown',e=>{if(!draft.photoSrc)return;at=[e.clientX,e.clientY];im.setPointerCapture(e.pointerId);e.preventDefault()});
  im.addEventListener('pointermove',e=>{if(!at)return;const d=im.clientWidth||104;nudge((e.clientX-at[0])/d,(e.clientY-at[1])/d);at=[e.clientX,e.clientY]});
  for(const ev of ['pointerup','pointercancel'])im.addEventListener(ev,()=>{at=null});im.addEventListener('dragstart',e=>e.preventDefault());
  im.addEventListener('keydown',e=>{const k={ArrowLeft:[.06,0],ArrowRight:[-.06,0],ArrowUp:[0,.06],ArrowDown:[0,-.06]}[e.key];if(!k||!draft.photoSrc)return;e.preventDefault();nudge(k[0],k[1])});
  $('f-zoom').addEventListener('input',e=>{if(!draft.photoSrc)return;draft.photoPos.z=Math.max(1,Math.min(3,+e.target.value||1));cutFace()})}
$('f-bg').addEventListener('change',async e=>{const f=e.target.files[0];e.target.value='';if(!f)return;
  try{const isV=f.type.startsWith('video/');if(!isV&&!f.type.startsWith('image/'))throw new Error('Please choose a photo or a video.');
    draft.bgBlob=isV?await A.checkVideo(f):await A.shrinkImage(f);draft.data.background=Object.assign({},draft.data.background,{type:isV?'video':'image',url:''});$('bg-note').textContent=(isV?'Video':'Photo')+' added. It stays on this device until you publish.';fill();changed()}catch(err){toast(err.message)}});
for(const [id,v] of [['fit-fill','fill'],['fit-band','band']])$(id).addEventListener('click',()=>{draft.data.background.fit=v;fill();changed()});
$('f-sound').addEventListener('change',e=>{draft.data.background.sound=e.target.checked;changed()});
// ---------- share / publish
const filesOf=d=>d?[d.background&&d.background.url,d.logo&&d.logo.url,d.photo&&d.photo.url,d.preview&&d.preview.url]:[],allFiles=()=>book.cards.flatMap(c=>filesOf(c.data));
const cardLink=()=>(A.config.site||location.origin)+'/c/'+draft.slug;let pendingEmail='';
function dirtyView(){const d=!!(draft.published&&draft.dirty);$('pub-update').hidden=!d;$('pub-dirty').hidden=!d;const n=book.cards.filter(c=>c.published&&c.dirty&&c.cardId).length;$('team-update').hidden=!(book.cards.length>1&&n>0&&!(n===1&&d));$('team-update').textContent='Update every card ('+n+')'}
// Only what is still missing is listed. Nothing missing, nothing shown.
function readyView(){const d=draft.data,a=d.actions||{},ul=$('ready');ul.textContent='';
  const rows=[[!!(d.name||'').trim(),'Add your name','t-details'],[!!(a.phone||a.email||a.booking||a.website),'Add at least one way to reach you','t-buttons']].filter(r=>!r[0]);
  for(const [,label,tab] of rows){const li=document.createElement('li'),b=document.createElement('button');li.dataset.ok='false';b.type='button';b.textContent=label;b.addEventListener('click',()=>$(tab).click());li.appendChild(b);ul.appendChild(li)}
  $('todo').hidden=!rows.length}
// ---------- link preview: the picture and title people see when the card's link is texted or posted.
// Drawn here, on the device, from the same details as the card, and saved next to the card when it is published.
const loadImg=src=>new Promise(res=>{if(!src)return res(null);const im=new Image();if(/^https:/.test(src))im.crossOrigin='anonymous';im.onload=()=>res(im);im.onerror=()=>res(null);im.src=src});
const videoFrame=src=>new Promise(res=>{if(!src)return res(null);const v=document.createElement('video');let done=false;const end=x=>{if(done)return;done=true;clearTimeout(t);res(x)},t=setTimeout(()=>end(null),2500);
  v.muted=true;v.playsInline=true;v.preload='auto';if(/^https:/.test(src))v.crossOrigin='anonymous';v.onloadeddata=()=>{try{v.currentTime=Math.min(.4,(v.duration||1)/2)}catch(e){end(null)}};v.onseeked=()=>end(v);v.onerror=()=>end(null);v.src=src});
function cover(x,im,dx,dy,dw,dh){const iw=im.videoWidth||im.naturalWidth,ih=im.videoHeight||im.naturalHeight;if(!iw||!ih)return;const k=Math.max(dw/iw,dh/ih),sw=dw/k,sh=dh/k;x.drawImage(im,(iw-sw)/2,(ih-sh)/2,sw,sh,dx,dy,dw,dh)}
function lines(x,text,max,most){const out=[];let cur='';for(const w of text.split(/\s+/)){const t=cur?cur+' '+w:w;if(x.measureText(t).width<=max||!cur)cur=t;else{out.push(cur);cur=w}}if(cur)out.push(cur);
  if(out.length>most){out.length=most;let l=out[most-1];while(l&&x.measureText(l+'…').width>max)l=l.slice(0,-1);out[most-1]=l.replace(/\s+$/,'')+'…'}return out}
let pvRun=0;async function drawPreview(cv,solo){const run=solo?0:++pvRun,c=V.normalize(viewData()),W=1200,H=630,x=cv.getContext('2d'),b=c.background,D='"Hanken Grotesk","Helvetica Neue",Arial,sans-serif',B='"Inter",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif';
  try{await Promise.all([document.fonts.load('800 80px "Hanken Grotesk"'),document.fonts.load('600 30px "Inter"')])}catch(e){}
  const back=b.type==='scene'?await loadImg('/live/thumbs/'+b.id+'.jpg'):b.type==='image'?await loadImg(b.url):await videoFrame(b.url),face=await loadImg(c.photo.url);if(!solo&&run!==pvRun)return false;
  x.save();x.fillStyle='#0f172a';x.fillRect(0,0,W,H);
  if(back){x.save();if(b.type==='scene'&&'filter' in x)x.filter='blur(10px)';cover(x,back,-40,-40,W+80,H+80);x.restore()}
  let g=x.createLinearGradient(0,0,W,0);g.addColorStop(0,'rgba(6,11,30,.9)');g.addColorStop(.62,'rgba(6,11,30,.62)');g.addColorStop(1,'rgba(6,11,30,.3)');x.fillStyle=g;x.fillRect(0,0,W,H);
  let left=84;if(face){const r=128,cx=left+r,cy=H/2;x.save();x.beginPath();x.arc(cx,cy,r+6,0,7);x.fillStyle='#fff';x.shadowColor='rgba(0,0,0,.5)';x.shadowBlur=40;x.shadowOffsetY=14;x.fill();x.restore();
    x.save();x.beginPath();x.arc(cx,cy,r,0,7);x.clip();cover(x,face,cx-r,cy-r,r*2,r*2);x.restore();left+=r*2+60}
  const max=W-left-84;
  let size=88;x.font='800 '+size+'px '+D;while(size>56&&x.measureText(c.name).width>max){size-=4;x.font='800 '+size+'px '+D}const nameL=lines(x,c.name,max,2);
  x.font='400 30px '+B;const tagL=c.tagline?lines(x,c.tagline,max,2):[];
  const hgt=nameL.length*size*1.06+(c.role?54:0)+tagL.length*40+(tagL.length?10:0);let y=Math.round((H-hgt)/2);
  x.textBaseline='top';x.fillStyle=c.accent;x.fillRect(left,y-30,72,8);
  x.fillStyle='#fff';x.font='800 '+size+'px '+D;for(const l of nameL){x.fillText(l,left,y);y+=size*1.06}
  if(c.role){x.font='600 34px '+B;x.fillText(lines(x,c.role,max,1)[0],left,y+10);y+=54}
  if(tagL.length){y+=10;x.font='400 30px '+B;x.fillStyle='#dbe5f5';for(const l of tagL){x.fillText(l,left,y);y+=40}}
  x.restore();return true}
const previewBlob=()=>new Promise(async res=>{const cv=document.createElement('canvas');cv.width=1200;cv.height=630;try{if(!(await drawPreview(cv,true)))return res(null);cv.toBlob(b=>res(b),'image/jpeg',.86)}catch(e){res(null)}});
function linkView(){const c=V.normalize(draft.data);$('pv-title').textContent=c.name+(c.company?' | '+c.company:'');$('pv-site').textContent=(A.config.site||location.origin).replace(/^https?:\/\//,'');drawPreview($('pv-img')).catch(()=>{})}
function pubView(){readyView();dirtyView();linkView();const on=A.enabled,user=A.auth.user,show=(id,v)=>{$(id).hidden=!v};
  show('pub-off',!on);show('pub-email',on&&!user&&!pendingEmail);show('pub-code',on&&!user&&!!pendingEmail);show('pub-go',on&&!!user&&!draft.published);show('pub-done',on&&!!user&&draft.published);show('acct',on&&!!user);show('team',book.cards.length>1);$('f-same').checked=book.same;planView();
  if(user)$('acct-who').textContent='Signed in as '+user.email;$('site-prefix').textContent=(A.config.site||location.origin).replace(/^https?:\/\//,'')+'/c/';
  if(on&&user&&draft.published){$('pub-link').textContent=cardLink();window.QRCode.toCanvas($('pub-qr'),cardLink(),{width:200,margin:1,errorCorrectionLevel:'M'},()=>{});$('pub-share').hidden=!navigator.share}}
const busy=(btn,on,label)=>{btn.disabled=on;if(label)btn.textContent=label};
$('pub-email').addEventListener('submit',async e=>{e.preventDefault();const b=e.target.querySelector('button'),em=$('f-acct').value.trim();busy(b,true);try{if(humanOn&&!humanToken){toast('Please complete the check above the button first.');busy(b,false);return}await A.auth.sendCode(em,humanToken);humanToken='';if(humanOn&&window.turnstile)try{window.turnstile.reset(humanId)}catch(_){}pendingEmail=em;pubView();$('f-code').focus()}catch(err){toast(err.status===429?'Too many tries. Wait a minute and try again.':err.message)}busy(b,false)});
$('code-back').addEventListener('click',()=>{pendingEmail='';pubView()});
$('pub-code').addEventListener('submit',async e=>{e.preventDefault();const b=e.target.querySelector('button');busy(b,true);
  try{await A.auth.verify(pendingEmail,$('f-code').value);pendingEmail='';$('f-code').value='';await adopt();pubView()}catch(err){toast(err.status===401||err.status===403||err.status===400?'That code did not work. Check it or ask for a new one.':err.message)}busy(b,false)});
// After sign-in: bring in every card this account has. A card started on this device before signing in takes the place of the account's first card, as before.
async function adopt(){try{const mine=await A.cards.mine()||[];let grew=false;for(const m of mine){if(book.cards.some(c=>c.cardId===m.id))continue;grew=true;
      const loose=book.cards.find(c=>!c.cardId);if(loose){loose.cardId=m.id;loose.slug=m.slug;loose.published=m.published;if(!(loose.data.name||'').trim()){loose.data=m.data;loose.bgBlob=loose.logoBlob=loose.photoBlob=loose.photoSrc=null}}
      else{const c=blank();c.data=m.data;c.cardId=m.id;c.slug=m.slug;c.published=m.published;book.cards.push(c)}}
    draft=book.cards[book.at]||book.cards[0];if(grew){fill();lastBg='';changed()}}catch(e){}
  try{teamPlan=A.auth.user?await A.billing.plan():''}catch(e){teamPlan=''}whoView()}
$('f-slug').addEventListener('input',e=>{const v=e.target.value.toLowerCase().replace(/[^a-z0-9-]/g,'-').replace(/-+/g,'-');if(v!==e.target.value)e.target.value=v;$('slug-note').textContent='Lowercase letters, numbers and dashes.'});
async function publish(e){e.preventDefault();const again=!!(draft.published&&draft.cardId),b=again?$('pub-update'):$('pub-btn'),label=again?'Update my live card':'Publish my card',slug=again?draft.slug:$('f-slug').value.trim();
  if(!SLUG.test(slug)){$('slug-note').textContent='Use 3 to 40 lowercase letters, numbers or dashes, starting and ending with a letter or number.';return}
  if(!draft.data.name.trim()){toast('Add your name on the Details tab first.');return}
  busy(b,true,'Publishing…');
  try{if(slug!==draft.slug||!draft.cardId){if(!(await A.cards.slugFree(slug))){$('slug-note').textContent='That link is taken. Try another.';busy(b,false,label);return}}
    {let live=[];try{live=(await A.cards.mine()||[]).flatMap(m=>filesOf(m.data))}catch(e){}await A.cards.tidy(live.concat(allFiles()))} // clear leftovers, keep what any card uses
    const shot=await previewBlob(); // drawn before the uploads, while the pictures are still on this device
    if(draft.bgBlob){const was=draft.bgBlob,u=await A.cards.upload(was,'bg');for(const c of book.cards)if(c.bgBlob===was){c.data.background.url=u;c.bgBlob=null}blobUrl('bg',null)}
    if(draft.logoBlob){const was=draft.logoBlob,u=await A.cards.upload(was,'logo');for(const c of book.cards)if(c.logoBlob===was){c.data.logo.url=u;c.logoBlob=null}blobUrl('logo',null)}
    if(draft.photoBlob){draft.data.photo={url:await A.cards.upload(draft.photoBlob,'photo')};draft.photoBlob=null;blobUrl('photo',null)}
    if(shot)try{draft.data.preview={url:await A.cards.upload(shot,'og')}}catch(e){} // the card still publishes if the preview picture cannot be saved
    await keep();
    const row=await A.cards.save(draft.cardId,slug,V.normalize(draft.data),true);draft.cardId=row.id;draft.slug=row.slug;draft.published=true;draft.dirty=false;
    if(row.data&&typeof row.data==='object')draft.data=row.data; // keep exactly what the service accepted
    await keep();A.cards.tidy(allFiles());fill();lastBg='';paint();state('Published');whoView();pubView()}
  catch(err){toast(err.code==='23505'?'That link is taken. Try another.':err.message)}busy(b,false,label)}
$('pub-go').addEventListener('submit',publish);$('pub-update').addEventListener('click',publish);
// ---------- take it with you: files made on this device from the card and its link
const saveFile=(blob,name)=>{const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),4000)};
const qrCanvas=size=>new Promise((res,rej)=>{const c=document.createElement('canvas');window.QRCode.toCanvas(c,cardLink(),{width:size,margin:2,errorCorrectionLevel:'M'},e=>e?rej(e):res(c))});
const said=m=>{$('dl-note').textContent=m},blobOf=(c,type,q)=>new Promise(r=>c.toBlob(r,type,q)),html=s=>String(s).replace(/[&<>"']/g,ch=>'&#'+ch.charCodeAt(0)+';');
/** A phone lock-screen picture: the card's background with its QR code. The top third is left clear for the clock and the bottom for the phone's own buttons. */
async function lockScreen(){const W=1290,H=2796,cv=document.createElement('canvas'),x=cv.getContext('2d'),c=V.normalize(viewData()),b=c.background,D='"Hanken Grotesk","Helvetica Neue",Arial,sans-serif',B='"Inter",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif';cv.width=W;cv.height=H;
  try{await Promise.all([document.fonts.load('800 80px "Hanken Grotesk"'),document.fonts.load('600 30px "Inter"')])}catch(e){}
  const back=b.type==='scene'?await loadImg('/live/thumbs/'+b.id+'.jpg'):b.type==='image'?await loadImg(b.url):await videoFrame(b.url),qr=await qrCanvas(640);
  x.fillStyle='#0f172a';x.fillRect(0,0,W,H);if(back){x.save();if(b.type==='scene'&&'filter' in x)x.filter='blur(6px)';cover(x,back,-30,-30,W+60,H+60);x.restore()}
  const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'rgba(6,11,30,.45)');g.addColorStop(1,'rgba(6,11,30,.7)');x.fillStyle=g;x.fillRect(0,0,W,H);
  const cw=840,ch=1040,cx=(W-cw)/2,cy=1170;x.save();x.shadowColor='rgba(0,0,0,.45)';x.shadowBlur=60;x.shadowOffsetY=24;x.fillStyle='#fff';x.beginPath();if(x.roundRect)x.roundRect(cx,cy,cw,ch,64);else x.rect(cx,cy,cw,ch);x.fill();x.restore();
  x.drawImage(qr,cx+(cw-640)/2,cy+70,640,640);x.textAlign='center';x.textBaseline='top';x.fillStyle='#0f172a';
  let size=68;x.font='800 '+size+'px '+D;while(size>40&&x.measureText(c.name).width>cw-100){size-=4;x.font='800 '+size+'px '+D}x.fillText(lines(x,c.name,cw-100,1)[0],W/2,cy+740);
  const sub=[c.role,c.company].filter(Boolean).join(', ');if(sub){x.font='500 36px '+B;x.fillStyle='#475569';x.fillText(lines(x,sub,cw-100,1)[0],W/2,cy+830)}
  x.font='600 36px '+B;x.fillStyle=c.accent;x.fillText('Scan to open my card',W/2,cy+925);return cv}
function signature(){const c=V.normalize(draft.data),a=c.actions,sub=[c.role,c.company].filter(Boolean).join(', '),rows=[a.phone,a.email].filter(Boolean);
  // Old-style attributes instead of style="": every email app understands them, and the page's own security policy forbids inline styles.
  const F='<font face="Arial,Helvetica,sans-serif" ';
  return {html:'<table cellpadding="0" cellspacing="0" border="0"><tr><td>'+F+'color="#0f172a" size="3"><b>'+html(c.name)+'</b></font>'+(sub?'<br>'+F+'color="#475569" size="2">'+html(sub)+'</font>':'')+'</td><td width="14"></td><td width="3" bgcolor="'+c.accent+'"></td><td width="14"></td>'
      +'<td>'+F+'color="#0f172a" size="2">'+rows.map(r=>html(r)+'<br>').join('')+'<a href="'+html(cardLink())+'">'+F+'color="'+c.accent+'"><b>Open my digital card</b></font></a></font></td></tr></table>',
    text:[c.name,sub].concat(rows,['My digital card: '+cardLink()]).filter(Boolean).join('\n')}}
$('dl-qr').addEventListener('click',async()=>{try{saveFile(await blobOf(await qrCanvas(1600),'image/png'),draft.slug+'-qr.png');said('Saved. This size prints sharp on flyers, signs and paper cards.')}catch(e){said('The QR code could not be made. Try again.')}});
$('dl-lock').addEventListener('click',async()=>{try{saveFile(await blobOf(await lockScreen(),'image/jpeg',.9),draft.slug+'-lock-screen.jpg');said('Saved. Set it as your lock screen in your phone\'s wallpaper settings, then just show your phone.')}catch(e){said('The picture could not be made. Try again.')}});
$('dl-sig').addEventListener('click',async()=>{const s=signature();try{await navigator.clipboard.write([new ClipboardItem({'text/html':new Blob([s.html],{type:'text/html'}),'text/plain':new Blob([s.text],{type:'text/plain'})})]);said('Copied. Paste it into the signature box in your email settings.')}
  catch(e){try{await navigator.clipboard.writeText(s.text);said('Copied as plain text. Paste it into the signature box in your email settings.')}catch(e2){said(s.text)}}});
// A tap card (NFC): a blank card or sticker that opens this link when touched to a phone. Only some phones can write one, so the button only shows there.
if('NDEFReader' in window){$('dl-nfc').hidden=false;$('dl-nfc').addEventListener('click',async()=>{said('Hold a blank tap card or sticker to the back of your phone.');try{await new window.NDEFReader().write({records:[{recordType:'url',data:cardLink()}]});said('Done. Touch that card to any phone and yours opens.')}catch(e){said('The tap card was not written. Check that NFC is on, then try again.')}})}
$('pub-copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(cardLink());toast('Link copied')}catch(e){toast(cardLink())}});
$('pub-share').addEventListener('click',()=>{navigator.share({title:draft.data.name,text:'My digital business card',url:cardLink()}).catch(()=>{})});
$('pub-unpub').addEventListener('click',async()=>{try{await A.cards.save(draft.cardId,draft.slug,V.normalize(draft.data),false);draft.published=false;await keep();state('Saved on this device');pubView();toast('Your card is offline. Publish again any time.')}catch(err){toast(err.message)}});
$('acct-out').addEventListener('click',async()=>{await A.auth.signOut();plan='';teamPlan='';whoView();pubView()});
let delArmed=0;$('acct-del').addEventListener('click',async e=>{if(Date.now()-delArmed>6000){delArmed=Date.now();e.target.textContent='Tap again to delete everything';setTimeout(()=>{e.target.textContent='Delete my account and card'},6000);return}
  try{await A.auth.deleteAccount();plan='';teamPlan='';draft.cardId=null;draft.slug='';draft.published=false;book.cards=[draft];book.at=0;await keep();whoView();pubView();toast('Your account and public card were deleted.')}catch(err){toast(err.message)}});
// ---------- team: several cards in one account that share one look
const BRAND=['company','accent','hours','actions.address','actions.website','actions.facebook','actions.instagram','actions.linkedin','actions.tiktok','actions.youtube','actions.review','actions.cashapp','actions.venmo','actions.zelle'];
const look=c=>JSON.stringify([BRAND.map(k=>get(c.data,k)||''),c.data.logo,c.data.background]);
function wear(c,src){for(const k of BRAND)put(c.data,k,get(src.data,k)||'');c.data.logo=JSON.parse(JSON.stringify(src.data.logo||{}));c.data.background=JSON.parse(JSON.stringify(src.data.background));c.logoBlob=src.logoBlob;c.bgBlob=src.bgBlob}
/** Copies the shared look from the card being edited to the others. A published card that changed is marked as needing an update. */
function spread(){for(const c of book.cards){if(c===draft)continue;const was=look(c),l=c.logoBlob,g=c.bgBlob;wear(c,draft);if(c.published&&(was!==look(c)||l!==c.logoBlob||g!==c.bgBlob))c.dirty=true}}
function whoView(){const can=A.enabled&&!!A.auth.user&&teamPlan==='pro'&&book.cards.length<5,sel=$('f-who');$('who').hidden=!(book.cards.length>1||can);sel.textContent='';
  book.cards.forEach((c,i)=>{const o=document.createElement('option');o.value=String(i);o.textContent=((c.data.name||'').trim()||'New card')+(c.published?(c.dirty?' (changes not live)':''):' (not published)');sel.appendChild(o)});
  if(can){const o=document.createElement('option');o.value='add';o.textContent='Add a team member';sel.appendChild(o)}sel.value=String(book.at)}
function openCard(i){clearTimeout(saveT);book.cards[book.at]=draft;book.at=Math.max(0,Math.min(book.cards.length-1,i));draft=book.cards[book.at];faceIm=faceOf=null;if(draft.photoSrc){const src=draft.photoSrc;loadImg(blobUrl('psrc',src)).then(im=>{if(draft.photoSrc===src){faceIm=im;faceOf=src}})}
  fill();lastBg='';paint();keep();whoView();state(draft.published?'Published':'Saved on this device');if(!$('p-publish').hidden)pubView();if(!$('p-activity').hidden)actView()}
$('f-who').addEventListener('change',e=>{if(e.target.value==='add'){book.cards[book.at]=draft;const c=blank();wear(c,draft);book.cards.push(c);openCard(book.cards.length-1);$('t-details').click();$('f-name').focus();toast('New card added. Add their name, photo, phone and email.')}else openCard(+e.target.value||0)});
$('f-same').addEventListener('change',e=>{book.same=e.target.checked;if(book.same)spread();dirtyView();whoView();keep()});
let rmArmed=0;$('team-remove').addEventListener('click',async e=>{const btn=e.currentTarget;if(book.cards.length<2)return;if(Date.now()-rmArmed>6000){rmArmed=Date.now();btn.textContent='Tap again to remove this card';setTimeout(()=>{btn.textContent='Remove this card'},6000);return}
  rmArmed=0;btn.textContent='Remove this card';try{if(draft.cardId&&A.enabled)await A.cards.remove(draft.cardId);book.cards.splice(book.at,1);draft=book.cards[0];book.at=0;openCard(0);if(A.enabled&&A.auth.user)A.cards.tidy(allFiles());toast('That card was removed.')}catch(err){toast(err.message)}});
$('team-update').addEventListener('click',async e=>{const btn=e.currentTarget,back=book.at;busy(btn,true);for(let i=0;i<book.cards.length;i++){const c=book.cards[i];if(c.published&&c.dirty&&c.cardId){openCard(i);await publish({preventDefault(){}})}}openCard(back);busy(btn,false);pubView()});
// ---------- activity (only when switched on): counts of opens and taps, and the people who sent their info
const TAP_NAMES={call:'Tapped Call',text:'Tapped Text',email:'Tapped Email',book:'Tapped your booking button',web:'Opened your website',map:'Got directions',save:'Saved your contact',review:'Opened your review link',pay:'Tapped a pay button',social:'Opened a social link',info:'Sent you their info'};
async function actView(){const ready=A.activity.enabled&&!!A.auth.user&&draft.published;$('act-off').hidden=ready;$('act-stats').hidden=$('act-people').hidden=!ready;if(!ready)return;
  try{const s=await A.activity.stats()||{},opens=Math.max(0,s.opens|0),rows=Object.keys(TAP_NAMES).map(k=>[k,Math.max(0,(s.taps||{})[k]|0)]).filter(r=>r[1]>0).sort((a,b)=>b[1]-a[1]),top=rows.length?rows[0][1]:1,ul=$('st-bars');
    $('st-opens').textContent=opens.toLocaleString();$('st-opens-l').textContent=opens===1?'open':'opens';ul.textContent='';
    for(const [k,n] of rows){const li=document.createElement('li'),nm=document.createElement('span'),v=document.createElement('b'),bar=document.createElement('i');nm.textContent=TAP_NAMES[k];v.textContent=n.toLocaleString();bar.style.setProperty('--w',String(Math.round(n/top*100)));li.append(nm,v,bar);ul.appendChild(li)}
    $('st-note').textContent=opens?(rows.length?'':'Nobody has tapped a button yet.'):'No opens yet. Share your link or show your QR code.'}
  catch(e){$('st-note').textContent='The numbers could not load. Check your connection and open this tab again.'}
  try{const list=await A.activity.people()||[],ul=$('people');ul.textContent='';
    for(const p of list){const li=document.createElement('li'),nm=document.createElement('b'),who=document.createElement('p'),when=document.createElement('time'),rm=document.createElement('button'),ct=String(p.contact||'');
      // a phone number or an email becomes a link; anything else is shown as plain text
      const href=/^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+$/.test(ct)?'mailto:'+ct:/^\+?[0-9]{7,15}$/.test(ct)?'tel:'+ct:'';
      nm.textContent=String(p.name||'');if(href){const a=document.createElement('a'),m=ct.match(/^(?:\+?1)?(\d{3})(\d{3})(\d{4})$/);a.href=href;a.textContent=m?'('+m[1]+') '+m[2]+'-'+m[3]:ct;who.appendChild(a)}else who.textContent=ct;
      const d=new Date(p.created_at);when.textContent=isNaN(d)?'':d.toLocaleDateString(undefined,{month:'short',day:'numeric'});rm.type='button';rm.className='ghost small';rm.textContent='Remove';rm.setAttribute('aria-label','Remove '+nm.textContent);
      rm.addEventListener('click',async()=>{rm.disabled=true;try{await A.activity.forget(p.id);li.remove();if(!ul.children.length)$('people-note').textContent='Nobody yet.'}catch(e){rm.disabled=false;toast('That could not be removed. Try again.')}});
      li.append(nm,rm,who);if(p.note){const n=document.createElement('p');n.textContent=String(p.note);li.appendChild(n)}li.appendChild(when);ul.appendChild(li)}
    $('people-note').textContent=list.length?'':draft.data.actions&&draft.data.actions.leads?'Nobody yet. When someone taps "Send me your info" on your card, they show up here.':'Turn on "Send me your info" on the Buttons tab and people can leave you their name and number.'}
  catch(e){$('people-note').textContent='The list could not load. Check your connection and open this tab again.'}}
// ---------- plan (only when plans are switched on). The price is shown on Stripe's page, never here.
async function planView(){const on=A.billing.enabled&&!!A.auth.user;$('plan').hidden=!on;if(!on)return;
  if(!plan&&!planBusy){planBusy=true;try{plan=await A.billing.plan()}catch(e){plan=''}planBusy=false}
  const pro=plan==='pro';$('plan-note').textContent=!plan?'Your plan could not be checked just now.':pro?'You are on the paid plan.':'You are on the free plan. Your card shows a small "Made with Meridian Live Cards" line.';
  $('plan-up').hidden=!plan||pro;$('plan-manage').hidden=!pro;$('plan-made').hidden=!pro;$('f-made').checked=draft.data.showMade===false}
async function planOpen(action,btn){busy(btn,true);try{location.assign(await A.billing.open(action))}catch(err){toast(err.status===409?'This account already has the paid plan.':err.message);busy(btn,false)}}
$('plan-up').addEventListener('click',e=>planOpen('checkout',e.currentTarget));$('plan-manage').addEventListener('click',e=>planOpen('portal',e.currentTarget));
$('f-made').addEventListener('change',e=>{draft.data.showMade=!e.target.checked;changed()});
{const q=new URLSearchParams(location.search),back=q.get('plan');if(back==='thanks'||back==='cancelled'){history.replaceState(null,'',location.pathname);
  // Arriving back here proves nothing: the plan only changes when the payment service confirms it to the server. So ask the server, a few times.
  if(back==='cancelled')setTimeout(()=>toast('No payment was taken.'),600);
  else{setTimeout(()=>toast('Thank you. Your plan updates here within a minute.'),600);let tries=0;const again=async()=>{plan='';await planView();if(plan!=='pro'&&++tries<8)setTimeout(again,5000)};setTimeout(again,2500)}}}
// ---------- human check on sign-in (only when a key is set in config)
if(humanOn){$('human').hidden=false;const s=document.createElement('script');s.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';s.async=true;
  s.onload=()=>{try{humanId=window.turnstile.render($('human'),{sitekey:A.config.humanCheck,callback:t=>{humanToken=t},'expired-callback':()=>{humanToken=''},'error-callback':()=>{humanToken=''}})}catch(e){$('human').textContent='The human check could not start. Reload the page.'}};
  s.onerror=()=>{$('human').textContent='The human check could not load. Check your connection and reload.'};document.head.appendChild(s)}
// ---------- install
let installEvt=null;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installEvt=e;$('install').hidden=false;$('install-btn').hidden=false;$('install-how').hidden=true});
$('install-btn').addEventListener('click',async()=>{if(!installEvt)return;installEvt.prompt();await installEvt.userChoice.catch(()=>{});installEvt=null;$('install-btn').hidden=true});
{const ua=navigator.userAgent,ios=/iPhone|iPad|iPod/.test(ua)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1),android=/Android/.test(ua);
  $('install-how').textContent=ios?'Tap the Share button in your browser, then "Add to Home Screen".':android?'Open the browser menu, then tap "Install app".':'';
  if((!ios&&!android)||window.matchMedia('(display-mode: standalone)').matches||navigator.standalone)$('install').hidden=true}
if('serviceWorker' in navigator&&location.protocol==='https:')navigator.serviceWorker.register('/studio/sw.js').catch(()=>{});
// ---------- start
const mend=c=>{c.data=c.data||blank().data;c.data.logo=c.data.logo||{};c.data.actions=c.data.actions||{};c.data.background=c.data.background||{type:'scene',id:'ocean'};c.photoPos=c.photoPos||{x:.5,y:.5,z:1};c.data.photo=c.data.photo||{url:''};c.data.preview=c.data.preview||{url:''};
  const l=c.data.logo;if(!l.mark&&(l.line1||l.line2)){if(!c.data.company)c.data.company=[l.line1,l.line2].filter(Boolean).join(' ');l.line1=l.line2=''}return c}; // an older draft's logo text becomes the business name
Promise.all([A.local.get('draft'),A.local.get('book')]).then(async([d,bk])=>{
  if(bk&&Array.isArray(bk.cards)&&bk.cards.length){book={cards:bk.cards.slice(0,5).map(c=>mend(Object.assign(blank(),c))),at:0,same:bk.same!==false};book.at=Math.max(0,Math.min(book.cards.length-1,bk.at|0));draft=book.cards[book.at]}
  else if(d&&d.data){draft=mend(Object.assign(draft,d));book.cards=[draft]}
  whoView();if(draft.photoSrc)loadImg(blobUrl('psrc',draft.photoSrc)).then(im=>{faceIm=im;faceOf=draft.photoSrc});fill();paint();if(A.enabled&&A.auth.user)await adopt()});
})();
