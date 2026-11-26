/* Meridian Live Cards: builds a card's content from its saved details and hands the background to the engine.
   Every value is written as text or passed through a strict link check; nothing from a card is ever treated as HTML. */
(function(){'use strict';
const ICON={call:'<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
 email:'<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',book:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
 text:'<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',web:'<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/>',
 save:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M22 11h-6"/>',
 facebook:'<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',instagram:'<rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.4A4 4 0 1 1 12.6 8 4 4 0 0 1 16 11.4z"/><path d="M17.5 6.5h.01"/>',
 linkedin:'<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
 tiktok:'<path d="M9 12a4 4 0 1 0 4 4V3a5 5 0 0 0 5 5"/>',youtube:'<rect x="2" y="5" width="20" height="14" rx="4"/><path d="m10 9 5 3-5 3z"/>',
 pin:'<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',star:'<path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5-5.9-3.2-5.9 3.2 1.2-6.5-4.8-4.6 6.6-.9z"/>',
 clock:'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>'};
const svg=n=>`<svg viewBox="0 0 24 24" aria-hidden="true">${ICON[n]}</svg>`;
const clean=(s,max)=>String(s==null?'':s).replace(/[\u0000-\u001f\u007f]/g,' ').trim().slice(0,max);
/** Only http and https links are allowed; a bare domain gets https. Anything else (javascript:, data:) is dropped. */
function link(u){u=clean(u,500);if(!u)return'';if(!/^[a-z][a-z0-9+.-]*:/i.test(u))u='https://'+u;try{const x=new URL(u);return x.protocol==='https:'||x.protocol==='http:'?x.href:''}catch(e){return''}}
const phoneNum=p=>{p=clean(p,40);const d=p.replace(/[^\d+]/g,'');return d.replace(/\D/g,'').length>=7?d:''};
const emailOk=e=>{e=clean(e,200);return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)?e:''};
const color=c=>/^#[0-9a-f]{6}$/i.test(c||'')?c:'#2563eb';
/** A payment name: letters, numbers, dash and underscore only. A pasted profile link, a leading $ or @ are trimmed off first. */
const handle=(v,re)=>{v=clean(v,120).replace(/^https?:\/\/(?:www\.|account\.)?(?:venmo\.com\/(?:u\/)?|cash\.app\/)/i,'').replace(/^[@$]/,'').replace(/[\/?#].*$/,'');return re.test(v)?v:''};
/** With no logo, the business name stands in for it, set on one or two balanced lines. */
function wordmark(name){const w=name.split(/\s+/).filter(Boolean);if(w.length<2)return[name,''];let best=1,gap=1e9;for(let i=1;i<w.length;i++){const g=Math.abs(w.slice(0,i).join(' ').length-w.slice(i).join(' ').length);if(g<gap){gap=g;best=i}}return[w.slice(0,best).join(' '),w.slice(best).join(' ')]}
const mapLink=a=>'https://www.google.com/maps/dir/?api=1&destination='+encodeURIComponent(a);
/** A picture or video may only come from three places: this device (blob:), this site's own sample and brand folders, or a client's own folder in the Live Cards file store. Anything else is dropped. */
const CFG=window.LIVE_CARDS_CONFIG||{},STORE=((/^https:\/\/[a-z0-9.-]+$/.test(CFG.url||'')?CFG.url:'https://glzodwhyavexpuusbqjy.supabase.co')+'/storage/v1/object/public/'+(/^[a-z0-9-]{3,40}$/.test(CFG.bucket||'')?CFG.bucket:'live-cards')+'/').replace(/[.]/g,'\\.');
const MEDIA=new RegExp('^'+STORE+'[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/((bg|logo|photo|og)-[a-z0-9]{1,16}\\.(jpg|mp4|mov|webm)|logo-[a-z0-9]{1,16}\\.png)$');
function media(u){if(typeof u!=='string'||u.length>400)return'';if(/^blob:https?:\/\/[\w.:-]+\/[0-9a-f-]{36}$/i.test(u))return u;if(/^\/(brand|live\/samples)\/[\w-]+(\.[\w-]+)*$/.test(u))return u;return MEDIA.test(u)?u:''}
function vcard(c){const esc=s=>String(s).replace(/[\r\n]+/g,' ').replace(/([\\;,])/g,'\\$1'),parts=c.name.split(' '),last=parts.length>1?parts.pop():'',first=parts.join(' ');
  const L=['BEGIN:VCARD','VERSION:3.0',`N:${esc(last)};${esc(first)};;;`,`FN:${esc(c.name)}`];if(c.company)L.push(`ORG:${esc(c.company)}`);if(c.role)L.push(`TITLE:${esc(c.role)}`);
  if(c.phone)L.push(`TEL;TYPE=CELL,VOICE:${c.phone}`);if(c.email)L.push(`EMAIL;TYPE=INTERNET,WORK:${c.email}`);if(c.website)L.push(`URL:${c.website}`);if(c.address)L.push(`ADR;TYPE=WORK:;;${esc(c.address)};;;;`);
  if(c.photo&&/^[A-Za-z0-9+\/=]+$/.test(c.photo))L.push(('PHOTO;ENCODING=b;TYPE=JPEG:'+c.photo).replace(/(.{74})(?=.)/g,'$1\r\n '));
  if(c.cardUrl)L.push(`NOTE:${esc('My card: '+c.cardUrl)}`);L.push('END:VCARD');return L.join('\r\n')}
/** The headshot as text for the contact file, so the saved contact has a face. Only for a published picture, only when small, and never required. */
async function photoText(u){if(!/^https:\/\//.test(u))return'';try{const ac=new AbortController(),t=setTimeout(()=>ac.abort(),4000),r=await fetch(u,{signal:ac.signal});clearTimeout(t);if(!r.ok)return'';const b=await r.blob();if(b.type!=='image/jpeg'||b.size>400000)return'';
    const a=new Uint8Array(await b.arrayBuffer());let s='';for(let i=0;i<a.length;i+=8192)s+=String.fromCharCode.apply(null,a.subarray(i,i+8192));return btoa(s)}catch(e){return''}}
/** Normalises anything saved or typed into the shape the card draws from. */
function normalize(d){d=d||{};const a=d.actions||{},bg=d.background||{},lg=d.logo||{},ph=d.photo||{},pv=d.preview||{};
  const out={name:clean(d.name,60)||'Your Name',company:clean(d.company,60),role:clean(d.role,60),tagline:clean(d.tagline,90),accent:color(d.accent),
    logo:{url:media(lg.url),mark:!!lg.mark,line1:clean(lg.line1,24),line2:clean(lg.line2,24)},
    photo:{url:media(ph.url)},preview:{url:media(pv.url)},hours:clean(d.hours,60),
    actions:{phone:phoneNum(a.phone),text:!!a.text,email:emailOk(a.email),booking:link(a.booking),bookingLabel:clean(a.bookingLabel,34)||'Book an appointment',website:link(a.website),
      facebook:link(a.facebook),instagram:link(a.instagram),linkedin:link(a.linkedin),tiktok:link(a.tiktok),youtube:link(a.youtube),
      address:clean(a.address,140),review:link(a.review),cashapp:handle(a.cashapp,/^[A-Za-z0-9_]{1,20}$/),venmo:handle(a.venmo,/^[A-Za-z0-9_-]{5,30}$/),zelle:emailOk(a.zelle)||phoneNum(a.zelle)},
    background:{type:['scene','image','video'].includes(bg.type)&&(bg.type==='scene'||media(bg.url))?bg.type:'scene',id:/^[a-z]{2,12}$/.test(bg.id||'')?bg.id:'ocean',url:media(bg.url),fit:bg.fit==='band'?'band':'fill',bg:/^#[0-9a-f]{6}$/i.test(bg.bg||'')?bg.bg:'#000000',sound:bg.sound!==false},
    showMade:d.showMade!==false};
  return out}
function render(phone,data,opts){opts=opts||{};const c=normalize(data);let card=phone.querySelector('.lc-card');if(!card){card=document.createElement('div');card.className='lc-card';phone.appendChild(card)}
  phone.style.setProperty('--lc-acc',c.accent);card.textContent='';
  const E=(tag,cls,txt)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;return e};
  const head=E('header','lc-content'),logo=E('div','lc-logo');
  if(c.logo.url){const im=E('img',c.logo.mark?'mark':'');im.src=c.logo.url;im.alt=c.company?c.company+' logo':'';logo.appendChild(im)}
  {const [l1,l2]=c.logo.line1?[c.logo.line1,c.logo.line2]:c.logo.url?['','']:wordmark(c.company);if(l1){const wm=E('div');wm.append(E('b','',l1));if(l2)wm.append(E('span','',l2));if(Math.max(l1.length,l2.length)>16)logo.classList.add('long');logo.appendChild(wm)}}
  head.append(logo);if(c.photo.url){const f=E('img','lc-face');f.src=c.photo.url;f.alt='Photo of '+c.name;f.width=f.height=112;head.classList.add('has-face');head.append(f)}
  head.append(E('h1','lc-name',c.name));if(c.role)head.append(E('div','lc-role',c.role));if(c.tagline)head.append(E('div','lc-tag',c.tagline));
  if(c.hours){const h=E('div','lc-hours');h.innerHTML=svg('clock');h.append(c.hours);head.append(h)}
  const pills=E('nav','lc-pills');pills.setAttribute('aria-label','Contact '+c.name);
  const pill=(href,icon,label,cls)=>{const a=E('a','lc-pill'+(cls?' '+cls:''));a.href=href;a.innerHTML=svg(icon);a.append(label);if(/^https?:/.test(href)){a.target='_blank';a.rel='noopener noreferrer'}pills.appendChild(a)};
  if(c.actions.phone)pill('tel:'+c.actions.phone,'call','Call');if(c.actions.email)pill('mailto:'+c.actions.email,'email','Email');if(c.actions.booking)pill(c.actions.booking,'book',c.actions.bookingLabel,'book');
  if(pills.children.length)head.appendChild(pills);
  const art=E('div','lc-art'),dots=E('div','lc-dots');
  const dot=(href,icon,label)=>{const a=E('a','lc-dot');a.href=href;a.innerHTML=svg(icon);a.setAttribute('aria-label',label);if(/^https?:/.test(href)){a.target='_blank';a.rel='noopener noreferrer'}dots.appendChild(a)};
  if(c.actions.phone&&c.actions.text)dot('sms:'+c.actions.phone,'text','Text '+c.name);if(c.actions.website)dot(c.actions.website,'web','Website');
  if(c.actions.address)dot(mapLink(c.actions.address),'pin','Directions to '+c.actions.address);
  if(c.actions.phone||c.actions.email){const b=E('button','lc-dot');b.type='button';b.innerHTML=svg('save');b.setAttribute('aria-label','Save to contacts');
    let face='';if(opts.cardUrl)photoText(c.photo.url).then(t=>{face=t}); // only on the public card, never while editing
    b.addEventListener('click',()=>{const blob=new Blob([vcard({name:c.name,company:c.company,role:c.role,phone:c.actions.phone,email:c.actions.email,website:c.actions.website,address:c.actions.address,photo:face,cardUrl:opts.cardUrl})],{type:'text/vcard'}),u=URL.createObjectURL(blob),a=document.createElement('a');
      a.href=u;a.download=c.name.replace(/[^\w -]/g,'')+'.vcf';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),4000)});dots.appendChild(b)}
  for(const k of ['facebook','instagram','linkedin','tiktok','youtube'])if(c.actions[k])dot(c.actions[k],k,(c.company||c.name)+' on '+k[0].toUpperCase()+k.slice(1));
  art.appendChild(dots);
  // labelled buttons: a review link, and ways to pay
  const out=(a)=>{a.target='_blank';a.rel='noopener noreferrer';return a};
  if(c.actions.review){const row=E('div','lc-chips'),a=out(E('a','lc-chip'));a.href=c.actions.review;a.innerHTML=svg('star');a.append('Leave a review');row.appendChild(a);art.appendChild(row)}
  if(c.actions.cashapp||c.actions.venmo||c.actions.zelle){const row=E('div','lc-chips lc-pay'),note=E('p','lc-note');note.setAttribute('role','status');note.hidden=true;row.setAttribute('role','group');row.setAttribute('aria-label','Pay '+(c.company||c.name));row.append(E('span','lc-pay-l','Pay with'));
    if(c.actions.cashapp){const a=out(E('a','lc-chip','Cash App'));a.href='https://cash.app/$'+c.actions.cashapp;row.appendChild(a)}
    if(c.actions.venmo){const a=out(E('a','lc-chip','Venmo'));a.href='https://venmo.com/u/'+c.actions.venmo;row.appendChild(a)}
    if(c.actions.zelle){const b=E('button','lc-chip','Zelle');b.type='button';b.setAttribute('aria-label','Zelle: show where to send');
      // Zelle has no payment link: it is sent from the payer's own bank app to a phone number or email. So show it and copy it.
      b.addEventListener('click',async()=>{let copied=false;try{await navigator.clipboard.writeText(c.actions.zelle);copied=true}catch(e){}note.textContent='Zelle to '+c.actions.zelle+(copied?' (copied). ':'. ')+'Send it from your bank app.';note.hidden=false});row.appendChild(b)}
    art.append(row,note)}
  if(c.showMade&&opts.madeLink){const m=E('div','lc-made'),a=E('a','','Made with Meridian Live Cards');a.href=opts.madeLink;m.appendChild(a);art.appendChild(m)}
  card.append(head,art);
  if(opts.engine){const b=c.background;opts.engine.setBackground(b.type==='scene'?{type:'scene',id:b.id}:b)}
  return c}
window.LiveCardView={render,normalize,link,media,vcard,mapLink};
})();
