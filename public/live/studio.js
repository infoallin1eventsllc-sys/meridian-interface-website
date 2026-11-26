/* Live Cards Studio. The draft lives on the device and saves as you type; signing in and publishing are only used when the service is switched on. */
(function(){'use strict';
const A=window.LiveCardsAPI,V=window.LiveCardView,$=id=>document.getElementById(id),phone=$('lc'),engine=window.LiveCard.init(phone);
const ACCENTS=['#2563eb','#0f766e','#b45309','#be123c','#6d28d9','#111827'],SLUG=/^[a-z0-9](?:[a-z0-9-]{1,38}[a-z0-9])$/;
let draft={data:{name:'',company:'',role:'',tagline:'',accent:'#2563eb',logo:{url:'',line1:'',line2:''},photo:{url:''},preview:{url:''},hours:'',actions:{},background:{type:'scene',id:engine.glOK?'ocean':'sunrise',fit:'fill',sound:true}},bgBlob:null,logoBlob:null,photoBlob:null,photoSrc:null,photoPos:{x:.5,y:.5,z:1},cardId:null,slug:'',published:false};
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
let saveT;let linkT;function changed(){if(draft.published){draft.dirty=true;dirtyView()}paint();if(!$('p-publish').hidden){clearTimeout(linkT);linkT=setTimeout(linkView,500)}clearTimeout(saveT);state('Saving…');saveT=setTimeout(async()=>{await A.local.set('draft',draft);state(draft.published?'Saved here. On the Share tab, tap Update my live card.':'Saved on this device')},350)}
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
const TABS=[...document.querySelectorAll('.tabs button')];
TABS.forEach((t,n)=>{t.addEventListener('click',()=>{TABS.forEach(x=>{const on=x===t;x.setAttribute('aria-selected',String(on));x.tabIndex=on?0:-1;$(x.getAttribute('aria-controls')).hidden=!on});if(t.id==='t-publish')pubView();
    const top=document.querySelector('.panel').getBoundingClientRect().top+scrollY-(document.querySelector('.preview').offsetHeight+document.querySelector('.top').offsetHeight);if(scrollY>top&&matchMedia('(max-width:899px)').matches)scrollTo(0,Math.max(0,top))});
  t.tabIndex=t.getAttribute('aria-selected')==='true'?0:-1;t.addEventListener('keydown',e=>{const d=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0;if(!d)return;e.preventDefault();const nx=TABS[(n+d+TABS.length)%TABS.length];nx.focus();nx.click()})});
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
const filesOf=d=>d?[d.background&&d.background.url,d.logo&&d.logo.url,d.photo&&d.photo.url,d.preview&&d.preview.url]:[];
const cardLink=()=>(A.config.site||location.origin)+'/c/'+draft.slug;let pendingEmail='';
function dirtyView(){const d=!!(draft.published&&draft.dirty);$('pub-update').hidden=!d;$('pub-dirty').hidden=!d}
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
  show('pub-off',!on);show('pub-email',on&&!user&&!pendingEmail);show('pub-code',on&&!user&&!!pendingEmail);show('pub-go',on&&!!user&&!draft.published);show('pub-done',on&&!!user&&draft.published);show('acct',on&&!!user);planView();
  if(user)$('acct-who').textContent='Signed in as '+user.email;$('site-prefix').textContent=(A.config.site||location.origin).replace(/^https?:\/\//,'')+'/c/';
  if(on&&user&&draft.published){$('pub-link').textContent=cardLink();window.QRCode.toCanvas($('pub-qr'),cardLink(),{width:200,margin:1,errorCorrectionLevel:'M'},()=>{});$('pub-share').hidden=!navigator.share}}
const busy=(btn,on,label)=>{btn.disabled=on;if(label)btn.textContent=label};
$('pub-email').addEventListener('submit',async e=>{e.preventDefault();const b=e.target.querySelector('button'),em=$('f-acct').value.trim();busy(b,true);try{if(humanOn&&!humanToken){toast('Please complete the check above the button first.');busy(b,false);return}await A.auth.sendCode(em,humanToken);humanToken='';if(humanOn&&window.turnstile)try{window.turnstile.reset(humanId)}catch(_){}pendingEmail=em;pubView();$('f-code').focus()}catch(err){toast(err.status===429?'Too many tries. Wait a minute and try again.':err.message)}busy(b,false)});
$('code-back').addEventListener('click',()=>{pendingEmail='';pubView()});
$('pub-code').addEventListener('submit',async e=>{e.preventDefault();const b=e.target.querySelector('button');busy(b,true);
  try{await A.auth.verify(pendingEmail,$('f-code').value);pendingEmail='';$('f-code').value='';await adopt();pubView()}catch(err){toast(err.status===401||err.status===403||err.status===400?'That code did not work. Check it or ask for a new one.':err.message)}busy(b,false)});
async function adopt(){if(draft.cardId)return;try{const mine=await A.cards.mine();if(mine&&mine[0]){const m=mine[0];draft.cardId=m.id;draft.slug=m.slug;draft.published=m.published;if(!draft.data.name){draft.data=m.data;draft.bgBlob=draft.logoBlob=draft.photoBlob=draft.photoSrc=null}fill();lastBg='';changed()}}catch(e){}}
$('f-slug').addEventListener('input',e=>{const v=e.target.value.toLowerCase().replace(/[^a-z0-9-]/g,'-').replace(/-+/g,'-');if(v!==e.target.value)e.target.value=v;$('slug-note').textContent='Lowercase letters, numbers and dashes.'});
async function publish(e){e.preventDefault();const again=!!(draft.published&&draft.cardId),b=again?$('pub-update'):$('pub-btn'),label=again?'Update my live card':'Publish my card',slug=again?draft.slug:$('f-slug').value.trim();
  if(!SLUG.test(slug)){$('slug-note').textContent='Use 3 to 40 lowercase letters, numbers or dashes, starting and ending with a letter or number.';return}
  if(!draft.data.name.trim()){toast('Add your name on the Details tab first.');return}
  busy(b,true,'Publishing…');
  try{if(slug!==draft.slug||!draft.cardId){if(!(await A.cards.slugFree(slug))){$('slug-note').textContent='That link is taken. Try another.';busy(b,false,label);return}}
    {let live=[];try{const m=(await A.cards.mine())[0];if(m)live=filesOf(m.data)}catch(e){}await A.cards.tidy(live)} // clear leftovers, keep what the live card uses
    const shot=await previewBlob(); // drawn before the uploads, while the pictures are still on this device
    if(draft.bgBlob){draft.data.background.url=await A.cards.upload(draft.bgBlob,'bg');draft.bgBlob=null;blobUrl('bg',null)}
    if(draft.logoBlob){draft.data.logo.url=await A.cards.upload(draft.logoBlob,'logo');draft.logoBlob=null;blobUrl('logo',null)}
    if(draft.photoBlob){draft.data.photo={url:await A.cards.upload(draft.photoBlob,'photo')};draft.photoBlob=null;blobUrl('photo',null)}
    if(shot)try{draft.data.preview={url:await A.cards.upload(shot,'og')}}catch(e){} // the card still publishes if the preview picture cannot be saved
    await A.local.set('draft',draft);
    const row=await A.cards.save(draft.cardId,slug,V.normalize(draft.data),true);draft.cardId=row.id;draft.slug=row.slug;draft.published=true;draft.dirty=false;
    if(row.data&&typeof row.data==='object')draft.data=row.data; // keep exactly what the service accepted
    await A.local.set('draft',draft);A.cards.tidy(filesOf(draft.data));fill();lastBg='';paint();state('Published');pubView()}
  catch(err){toast(err.code==='23505'?'That link is taken. Try another.':err.message)}busy(b,false,label)}
$('pub-go').addEventListener('submit',publish);$('pub-update').addEventListener('click',publish);
$('pub-copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(cardLink());toast('Link copied')}catch(e){toast(cardLink())}});
$('pub-share').addEventListener('click',()=>{navigator.share({title:draft.data.name,text:'My digital business card',url:cardLink()}).catch(()=>{})});
$('pub-unpub').addEventListener('click',async()=>{try{await A.cards.save(draft.cardId,draft.slug,V.normalize(draft.data),false);draft.published=false;await A.local.set('draft',draft);state('Saved on this device');pubView();toast('Your card is offline. Publish again any time.')}catch(err){toast(err.message)}});
$('acct-out').addEventListener('click',async()=>{await A.auth.signOut();plan='';pubView()});
let delArmed=0;$('acct-del').addEventListener('click',async e=>{if(Date.now()-delArmed>6000){delArmed=Date.now();e.target.textContent='Tap again to delete everything';setTimeout(()=>{e.target.textContent='Delete my account and card'},6000);return}
  try{await A.auth.deleteAccount();plan='';draft.cardId=null;draft.slug='';draft.published=false;await A.local.set('draft',draft);pubView();toast('Your account and public card were deleted.')}catch(err){toast(err.message)}});
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
A.local.get('draft').then(async d=>{if(d&&d.data){draft=Object.assign(draft,d);draft.data.logo=draft.data.logo||{};draft.data.actions=draft.data.actions||{};draft.data.background=draft.data.background||{type:'scene',id:'ocean'};draft.photoPos=draft.photoPos||{x:.5,y:.5,z:1};draft.data.photo=draft.data.photo||{url:''};draft.data.preview=draft.data.preview||{url:''};{const l=draft.data.logo;if(!l.mark&&(l.line1||l.line2)){if(!draft.data.company)draft.data.company=[l.line1,l.line2].filter(Boolean).join(' ');l.line1=l.line2=''}}}if(draft.photoSrc)loadImg(blobUrl('psrc',draft.photoSrc)).then(im=>{faceIm=im;faceOf=draft.photoSrc});fill();paint();if(A.enabled&&A.auth.user)await adopt()});
})();
