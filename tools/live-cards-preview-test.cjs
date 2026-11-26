// Live Cards: headshot, the extra buttons (directions, hours, review, pay) and the link preview.
// Part 1 runs the real page function for a card's link (api/lc-card.js) against hostile and broken answers, with no browser.
// Part 2 is an end-to-end run in a browser under the exact headers in vercel.json, with the service stand-in from tools/lc-test-kit.cjs.
// Run: build the site, serve it on port 4799 (npx vite preview --port 4799), then: node tools/live-cards-preview-test.cjs
// (needs Playwright; if its own browser is missing, set CHROMIUM_PATH to a Chromium binary). Nothing real is contacted.
const {chromium}=require('playwright');const fs=require('fs');
const {SITE,B,SB,UID,headersFor,configOn,cardPage,standIn}=require('./lc-test-kit.cjs');
const out=[];const T=(ok,name,extra)=>{out.push((ok?'PASS ':'FAIL ')+name+(extra&&!ok?' :: '+String(extra).slice(0,300):''));};
const meta=(html,prop)=>{const m=html.match(new RegExp('<meta (?:property|name)="'+prop+'" content="([^"]*)"'));return m?m[1]:null};
(async()=>{
// ---------- Part 1: the page function on its own
const run=cardPage(),PLAIN=fs.readFileSync(SITE+'/public/c/index.html','utf8'),OG=SB+'/storage/v1/object/public/live-cards/'+UID+'/og-abc123.jpg';
const good={name:'Jordan Rivers',company:'Rivers Realty',role:'Realtor',tagline:'Homes in Katy and West Houston',preview:{url:OG}};
let seen=[];const svc=(cfg,answer)=>async(url,init)=>{seen.push({url:String(url),init});const u=new URL(String(url));
  if(u.pathname==='/live/config.js')return new Response(cfg,{status:200});if(u.origin===SB)return answer(u,init);return new Response('no',{status:500})};
const json=d=>()=>new Response(JSON.stringify(d),{status:200,headers:{'content-type':'application/json'}});
const get=async(path,f,origin)=>{seen=[];const r=await run((origin||'https://site.test')+path,f);return {r,html:await r.text()}};
{const {r,html}=await get('/c/jordan-rivers',svc(configOn(),json(good)));
  T(r.status===200&&/<title>Jordan Rivers \| Rivers Realty<\/title>/.test(html)&&meta(html,'og:title')==='Jordan Rivers | Rivers Realty','a card link carries the name and business as its title',html.slice(100,400));
  T(meta(html,'og:image')===OG&&meta(html,'og:image:width')==='1200'&&meta(html,'twitter:card')==='summary_large_image','a card link carries its own preview picture');
  T(/Realtor\. Homes in Katy and West Houston/.test(meta(html,'og:description')||'')&&meta(html,'og:url')==='https://meridianinterface.com/c/jordan-rivers','a card link carries the title line and its own address');
  const call=seen.find(s=>s.url.startsWith(SB));T(seen.length===2&&!!call&&call.url===SB+'/rest/v1/rpc/lc_get_card'&&call.init.method==='POST'&&call.init.body==='{"p_slug":"jordan-rivers"}','the function asks the service one public question and nothing else',JSON.stringify(seen.map(s=>s.url)));
  T(html.replace(/<!--share-->.*<!--\/share-->/s,'')===PLAIN.replace(/<!--share-->.*<!--\/share-->/s,'')&&(html.match(/<script/g)||[]).length===5,'the rest of the page is exactly the card page');
  const want=headersFor('/c/jordan-rivers');T(['content-security-policy','permissions-policy','cross-origin-opener-policy','x-content-type-options','x-frame-options','referrer-policy'].every(k=>r.headers.get(k)===want[k]),'the function sends the same security headers as vercel.json',JSON.stringify([...r.headers]).slice(0,200))}
{const {html}=await get('/c/sample',svc(configOn(),json(good)));T(html===PLAIN&&seen.length===0,'the sample link gets the plain page and asks nothing')}
for(const bad of ['/c/..%2F..%2Fetc','/c/UPPER','/c/a','/c/'+'x'.repeat(60),'/c/has%20space','/c/x"><script>alert(1)</script>']){const {r,html}=await get(bad,svc(configOn(),json(good)));T(r.status===200&&html===PLAIN&&seen.length===0,'an odd link name gets the plain page and asks nothing: '+bad.slice(0,22))}
// (the function remembers the switch for a minute per address, so this case uses its own address)
{const {html}=await get('/c/jordan-rivers',svc(fs.readFileSync(SITE+'/public/live/config.js','utf8'),json(good)),'https://off.test');T(html===PLAIN&&seen.length===1&&!seen.some(s=>s.url.startsWith(SB)),'while the service is switched off the function never contacts it',JSON.stringify(seen.map(s=>s.url)))}
{const {html}=await get('/c/jordan-rivers',svc('not found',json(good)),'https://nocfg.test');T(html===PLAIN&&!seen.some(s=>s.url.startsWith(SB)),'with no readable switch the function stays off')}
{const {html}=await get('/c/jordan-rivers',svc(configOn(),json(null)));T(html===PLAIN,'a missing, offline or taken-down card gets the plain page')}
{const {r,html}=await get('/c/jordan-rivers',svc(configOn(),()=>new Response('boom',{status:500})));T(r.status===200&&html===PLAIN,'a service error still serves the page')}
{const {r,html}=await get('/c/jordan-rivers',svc(configOn(),()=>new Response('<html>not json',{status:200})));T(r.status===200&&html===PLAIN,'a broken answer still serves the page')}
{const t=Date.now(),{r,html}=await get('/c/jordan-rivers',svc(configOn(),(u,init)=>new Promise((res,rej)=>{init.signal.addEventListener('abort',()=>rej(new Error('aborted')))})));T(r.status===200&&html===PLAIN&&Date.now()-t<4000,'a slow service is given up on and the page is still served',Date.now()-t)}
{const {r,html}=await get('/c/jordan-rivers',async()=>{throw new Error('network down')});T(r.status===200&&html===PLAIN,'no connection at all still serves the page')}
{const evil={name:'"><script>alert(1)</script>',company:'</title><script>alert(2)</script>',role:"' onload='alert(3)",tagline:'<img src=x onerror=alert(4)>‮`',preview:{url:'https://evil.example/og-abc123.jpg'}};
  const {html}=await get('/c/jordan-rivers',svc(configOn(),json(evil))),head=html.slice(html.indexOf('<!--share-->'),html.indexOf('<!--/share-->'));
  T((html.match(/<script/g)||[]).length===5&&!/<img/.test(head)&&!/onload='/.test(head)&&(head.match(/<title>/g)||[]).length===1&&!/‮/.test(head),'hostile card details are written as text, never as code',head.slice(0,300));
  T(meta(html,'og:image')==='https://meridianinterface.com/live/og-default.jpg','a preview picture from anywhere else is replaced by the standard one')}
for(const pic of [OG.replace('/og-','/bg-'),OG.replace(UID,'../'+UID),OG+'?x=1',OG.replace('.jpg','.svg'),OG.replace('supabase.co','supabase.co.evil.example'),{url:OG},12]){const {html}=await get('/c/jordan-rivers',svc(configOn(),json({...good,preview:{url:pic}})));T(meta(html,'og:image')==='https://meridianinterface.com/live/og-default.jpg','only a real link preview file is used as the picture: '+String(typeof pic==='string'?pic.slice(-40):typeof pic))}
{const {html}=await get('/c/jordan-rivers',svc(configOn(),json({name:'',company:'Only Company'})));T(html===PLAIN,'a card with no name gets the plain page')}
{const {html}=await get('/c/jordan-rivers',svc(configOn(),json([good])));T(html===PLAIN,'an answer of the wrong shape gets the plain page')}
{const r=await run('https://site.test/c/jordan-rivers',svc(configOn(),json(good)),{method:'POST',body:'x'});T(r.status===405,'the function only answers page requests (no POST)')}
{const V=JSON.parse(fs.readFileSync(SITE+'/vercel.json','utf8')),rw=V.rewrites.find(x=>x.source==='/c/:slug');T(!!rw&&rw.destination==='/api/lc-card?slug=:slug','vercel.json sends /c/<name> to the function');
  const src=fs.readFileSync(SITE+'/api/lc-card.js','utf8');T(!/process\.env|service_role|secret/i.test(src.replace(/\/\*[\s\S]*?\*\//,'')),'the function holds no secret and reads no private setting')}

// ---------- Part 2: in the browser
const b=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const ctx=await b.newContext({viewport:{width:390,height:844},acceptDownloads:true});await ctx.grantPermissions(['clipboard-read','clipboard-write'],{origin:B}).catch(()=>{});
const S=await standIn(ctx),{files}=S;
const errs=[];const page=async(url)=>{const p=await ctx.newPage();p.on('pageerror',e=>errs.push(url+' pageerror '+e.message));p.on('console',m=>{if(m.type()==='error'&&!/Failed to load resource/.test(m.text()))errs.push(url+' console '+m.text().slice(0,260))});await p.goto(B+url);await p.waitForTimeout(1300);return p};
const PHOTO=SITE+'/public/card/bg/houston-skyline.jpg';
// nothing said twice, nothing left to guess
{const p=await page('/studio/');await p.click('#t-publish');await p.waitForTimeout(400);
  T(await p.$eval('#todo',e=>!e.hidden)&&(await p.$$eval('#ready li',l=>l.map(x=>x.textContent))).join('|')==='Add your name|Add at least one way to reach you','an empty card is told exactly what is missing before sharing');
  await p.click('#ready li button');T(await p.$eval('#p-details',e=>!e.hidden),'tapping a missing item opens the tab where it is fixed');
  // starting points by trade
  await p.click('#starts button[data-id=barber]');await p.waitForTimeout(500);
  const st=()=>p.evaluate(()=>({role:document.getElementById('f-role').value,tag:document.getElementById('f-tagline').value,book:document.getElementById('f-blabel').value,scene:(document.querySelector('#scenes button[aria-pressed=true]')||{dataset:{}}).dataset.id,accent:(document.querySelector('#swatches button[aria-pressed=true]')||{dataset:{}}).dataset.c,on:[...document.querySelectorAll('#starts button[aria-pressed=true]')].map(b=>b.dataset.id).join()}));
  let v=await st();T(v.role==='Barber'&&v.tag==='Fresh cuts and sharp fades'&&v.book==='Book a cut'&&v.scene==='ribbon'&&v.accent==='#111827'&&v.on==='barber','a starting point fills the title, line, booking words, background and color',JSON.stringify(v));
  await p.fill('#f-tagline','Best fades in Katy');await p.click('#starts button[data-id=restaurant]');await p.waitForTimeout(500);v=await st();
  T(v.role==='Restaurant'&&v.tag==='Best fades in Katy'&&v.book==='Reserve a table'&&v.scene==='fire'&&v.on==='restaurant','switching starting points never overwrites what the client typed',JSON.stringify(v));
  await p.fill('#f-role','');await p.fill('#f-tagline','');
  await p.fill('#f-name','Jordan Rivers');await p.fill('#f-company','Rivers Realty');await p.waitForTimeout(400);
  T((await p.$eval('#lc .lc-logo',e=>[...e.querySelectorAll('b,span')].map(x=>x.textContent).join('/')))==='Rivers/Realty'&&!(await p.$('#f-l1')),'with no logo the business name stands in for it, typed once');
  await p.fill('#f-company','Katy Family Dental Care');await p.waitForTimeout(300);T((await p.$eval('#lc .lc-logo',e=>[...e.querySelectorAll('b,span')].map(x=>x.textContent).join('/')))==='Katy Family/Dental Care','a longer business name is set on two balanced lines');
  await p.setInputFiles('#f-logo',PHOTO);await p.waitForTimeout(800);T(await p.$eval('#lc .lc-logo',e=>!!e.querySelector('img')&&!e.querySelector('b')),'an uploaded logo replaces the business name on the card');
  // a see-through logo stays see-through (saved as PNG); a solid one is saved as JPG
  const kinds=await p.evaluate(async()=>{const A=window.LiveCardsAPI,mk=(clear)=>new Promise(r=>{const c=document.createElement('canvas');c.width=c.height=200;const x=c.getContext('2d');if(!clear){x.fillStyle='#fff';x.fillRect(0,0,200,200)}x.fillStyle='#c00';x.beginPath();x.arc(100,100,60,0,7);x.fill();c.toBlob(r,'image/png')});
    const a=await A.shrinkImage(await mk(true),{max:800,alpha:true}),b=await A.shrinkImage(await mk(false),{max:800,alpha:true}),c=await A.shrinkImage(await mk(true),{max:800});
    const im=await createImageBitmap(a),cv=document.createElement('canvas');cv.width=cv.height=200;const x=cv.getContext('2d');x.drawImage(im,0,0);return {a:a.type,b:b.type,c:c.type,corner:x.getImageData(2,2,1,1).data[3]}});
  T(kinds.a==='image/png'&&kinds.corner===0&&kinds.b==='image/jpeg'&&kinds.c==='image/jpeg','a see-through logo keeps its see-through background; everything else is saved as JPG',JSON.stringify(kinds));
  await p.click('#logo-clear');await p.fill('#f-company','Rivers Realty');await p.click('#t-buttons');await p.fill('#f-phone','281-555-0142');await p.click('#t-publish');await p.waitForTimeout(400);
  T(await p.$eval('#todo',e=>e.hidden),'once nothing is missing the list is gone');
  T(await p.$eval('#install',e=>e.hidden),'home screen steps are hidden on a computer (they show only the steps for the phone in hand)');
  T(await p.$$eval('#swatches button',b=>b.length===6)&&await p.$eval('#swatches',e=>!!e.closest('#p-buttons')),'the button color sits with the booking button it colors');await p.close()}
{const p=await page('/studio/');await p.fill('#f-name','Jordan Rivers');await p.fill('#f-company','Rivers Realty');await p.fill('#f-role','Realtor');await p.fill('#f-tagline','Homes in Katy and West Houston');
  T(await p.$eval('#lc',e=>!e.querySelector('.lc-face')),'no photo: the card has no empty photo circle');
  await p.setInputFiles('#f-photo',PHOTO);await p.waitForTimeout(900);
  const face=await p.$eval('#lc .lc-face',async im=>{await im.decode().catch(()=>{});return {w:im.naturalWidth,h:im.naturalHeight,src:im.src.slice(0,5),alt:im.alt,round:getComputedStyle(im).borderRadius}}).catch(()=>null);
  T(!!face&&face.w===face.h&&face.w>0&&face.w<=640&&face.src==='blob:'&&face.alt==='Photo of Jordan Rivers'&&face.round==='50%','a headshot is cut to a square on the device and shown in a circle with a description',JSON.stringify(face));
  T(await p.$eval('#photo-clear',e=>!e.hidden)&&await p.$eval('#face-pv',e=>!e.hidden),'the Details tab shows the photo with a way to remove it');
  // move and zoom the photo inside its circle
  const avg=()=>p.$eval('#lc .lc-face',async im=>{await im.decode().catch(()=>{});const c=document.createElement('canvas');c.width=c.height=32;const x=c.getContext('2d');x.drawImage(im,0,0,32,32);const d=x.getImageData(0,0,32,32).data;let s=0;for(let i=0;i<d.length;i+=4)s+=d[i]*3+d[i+1]*5+d[i+2]*7;return s});
  T(await p.$eval('#face-adj',e=>!e.hidden)&&await p.$eval('#face-pv',e=>e.classList.contains('drag')&&e.tabIndex===0),'a new photo can be moved and zoomed');
  await p.$eval('#face-pv',e=>{const r=e.getBoundingClientRect();scrollBy(0,r.top-innerHeight*.78)});await p.waitForTimeout(200);const a0=await avg(),box=await (await p.$('#face-pv')).boundingBox();await p.mouse.move(box.x+box.width/2,box.y+box.height/2);await p.mouse.down();await p.mouse.move(box.x+box.width/2-50,box.y+box.height/2-50,{steps:4});await p.mouse.up();await p.waitForTimeout(500);const a1=await avg();
  T(a1!==a0,'dragging the photo moves it inside the circle',a0+' '+a1);
  await p.$eval('#f-zoom',e=>{e.value='2';e.dispatchEvent(new Event('input',{bubbles:true}))});await p.waitForTimeout(500);const a2=await avg();T(a2!==a1&&await p.$eval('#lc .lc-face',im=>im.naturalWidth===im.naturalHeight),'zooming changes the cut and keeps it square',a1+' '+a2);
  await p.focus('#face-pv');await p.keyboard.press('ArrowLeft');await p.keyboard.press('ArrowDown');await p.waitForTimeout(400);T((await avg())!==a2,'arrow keys move the photo too (no mouse or finger needed)');
  // hostile values in the new boxes never become buttons
  await p.click('#t-buttons');await p.fill('#f-phone','281-555-0142');await p.fill('#f-email','jordan@riversrealty.example');
  await p.fill('#f-review','javascript:alert(1)');await p.fill('#f-cash','bad name"><script>');await p.fill('#f-venmo','x');await p.fill('#f-zelle','<script>alert(1)</script>');await p.fill('#f-addr','');await p.waitForTimeout(500);
  T(await p.$eval('#lc',e=>!e.querySelector('.lc-chip')&&!e.querySelector('script')),'bad review links and payment names never become buttons');
  await p.fill('#f-addr','123 Main St, Katy, TX 77494');await p.fill('#f-hours','Mon to Fri, 9 am to 5 pm');await p.fill('#f-review','https://g.page/r/riversrealty/review');
  await p.fill('#f-cash','$RiversRealty');await p.fill('#f-venmo','https://venmo.com/u/rivers-realty');await p.fill('#f-zelle','pay@riversrealty.example');await p.waitForTimeout(600);
  const links=await p.$$eval('#lc .lc-card a',as=>as.map(a=>a.getAttribute('href')));
  T(links.includes('https://www.google.com/maps/dir/?api=1&destination=123%20Main%20St%2C%20Katy%2C%20TX%2077494'),'an address becomes a Directions button to that address',links.join(' '));
  T(links.includes('https://g.page/r/riversrealty/review')&&links.includes('https://cash.app/$RiversRealty')&&links.includes('https://venmo.com/u/rivers-realty'),'review, Cash App and Venmo buttons go to the right places (a pasted profile link or a $ is tidied)',links.join(' '));
  T(await p.$eval('#lc .lc-hours',e=>e.textContent)==='Mon to Fri, 9 am to 5 pm','hours show on the card');
  T(await p.$$eval('#lc .lc-card a[target=_blank]',as=>as.length>0&&as.every(a=>a.rel==='noopener noreferrer')),'every outside button opens safely (noopener)');
  T(await p.$$eval('#lc .lc-card a, #lc .lc-card button',els=>els.every(e=>{const r=e.getBoundingClientRect(),k=e.closest('#lc').getBoundingClientRect().width/360;return r.height/k>=43.5})),'every button on the card is at least 44 pixels tall');
  // the card is taller than the preview frame: it must scroll inside it, nothing unreachable
  const sc=await p.$eval('#lc .lc-card',c=>{const before=c.scrollTop;c.scrollTop=9999;const moved=c.scrollTop>before,last=[...c.querySelectorAll('.lc-chip')].pop().getBoundingClientRect(),box=c.getBoundingClientRect();return {tall:c.scrollHeight>c.clientHeight,moved,inView:last.bottom<=box.bottom+1}});
  T(!sc.tall||(sc.moved&&sc.inView),'a full card scrolls inside the preview so the last button can be reached',JSON.stringify(sc));
  // Share tab: link preview drawn on the device
  await p.click('#t-publish');await p.waitForTimeout(1800);
  const pv=await p.evaluate(()=>{const c=document.getElementById('pv-img'),x=c.getContext('2d'),d=x.getImageData(0,0,c.width,c.height).data;let lit=0,white=0;for(let i=0;i<d.length;i+=4*97){if(d[i]+d[i+1]+d[i+2]>60)lit++;if(d[i]>235&&d[i+1]>235&&d[i+2]>235)white++}
    return {w:c.width,h:c.height,lit,white,title:document.getElementById('pv-title').textContent,site:document.getElementById('pv-site').textContent}});
  T(pv.w===1200&&pv.h===630&&pv.lit>500&&pv.white>20&&pv.title==='Jordan Rivers | Rivers Realty'&&pv.site==='meridianinterface.com','the Share tab shows how the link will look, with the name and a drawn picture',JSON.stringify(pv));
  // sign in and publish
  await p.fill('#f-acct','jordan@riversrealty.example');await p.click('#pub-email button');await p.waitForTimeout(600);await p.fill('#f-code','123456');await p.click('#pub-code button');await p.waitForTimeout(900);
  await p.fill('#f-slug','jordan-rivers');await p.$eval('#f-rights',e=>e.checked=true);await p.click('#pub-btn');await p.waitForTimeout(3000);
  const names=[...files.keys()].map(n=>n.split('/')[1]).sort();
  T(names.length===2&&/^og-[a-z0-9]{1,16}\.jpg$/.test(names[0])&&/^photo-[a-z0-9]{1,16}\.jpg$/.test(names[1]),'publishing saves the headshot and the link preview picture under safe generated names',names.join());
  const d=S.card&&S.card.data;T(!!d&&d.photo.url.endsWith('/'+names[1])&&d.preview.url.endsWith('/'+names[0])&&d.hours==='Mon to Fri, 9 am to 5 pm'&&d.actions.address==='123 Main St, Katy, TX 77494'&&d.actions.cashapp==='RiversRealty'&&d.actions.venmo==='rivers-realty'&&d.actions.zelle==='pay@riversrealty.example'&&d.actions.review==='https://g.page/r/riversrealty/review','the saved card holds the new details exactly as the service accepted them',JSON.stringify(d&&d.actions));
  const og=files.get(UID+'/'+names[0]),buf=og&&og.buf;let dim=null;if(buf){for(let i=2;i<buf.length-9;){if(buf[i]!==0xFF)break;const mk=buf[i+1],len=buf.readUInt16BE(i+2);if(mk>=0xC0&&mk<=0xC3){dim=[buf.readUInt16BE(i+7),buf.readUInt16BE(i+5)];break}i+=2+len}}
  T(!!og&&og.type==='image/jpeg'&&!!dim&&dim[0]===1200&&dim[1]===630&&buf.length>15000&&buf.length<600000,'the link preview picture is a 1200 by 630 JPEG of a sensible size',JSON.stringify({dim,bytes:buf&&buf.length}));
  await p.close()}
// the public link: served by the real function, with this card's own title and picture
{const p=await page('/c/jordan-rivers');const html=(S.pages.find(x=>x.path==='/c/jordan-rivers')||{}).html||'';
  T(meta(html,'og:title')==='Jordan Rivers | Rivers Realty'&&/\/og-[a-z0-9]{1,16}\.jpg$/.test(meta(html,'og:image')||'')&&meta(html,'og:image')===S.card.data.preview.url,'the public link is served with this card\'s own title and preview picture',html.slice(120,420));
  T(await p.title()==='Jordan Rivers | Rivers Realty'&&await p.$eval('.lc-name',e=>e.textContent)==='Jordan Rivers','the card itself opens from that page');
  const face=await p.$eval('.lc-face',async im=>{await im.decode().catch(()=>{});return {ok:im.naturalWidth>0,src:im.src}}).catch(()=>null);T(!!face&&face.ok&&face.src===S.card.data.photo.url,'the published headshot loads from the client folder',JSON.stringify(face));
  // Zelle: no payment link exists, so the card shows and copies where to send
  await p.click('.lc-chip:has-text("Zelle")');await p.waitForTimeout(400);const note=await p.$eval('.lc-note',e=>e.hidden?'':e.textContent);const clip=await p.evaluate(()=>navigator.clipboard.readText()).catch(()=>'(clipboard not readable here)');
  T(/^Zelle to pay@riversrealty\.example/.test(note)&&/bank app/.test(note)&&(clip==='pay@riversrealty.example'||clip==='(clipboard not readable here)'),'Zelle shows where to send and copies it',note+' / '+clip);
  // Save to contacts: the contact file carries the address and the face
  await p.waitForTimeout(1200);const [dl]=await Promise.all([p.waitForEvent('download',{timeout:8000}),p.click('button[aria-label="Save to contacts"]')]);const vcf=fs.readFileSync(await dl.path(),'utf8');
  T(/^BEGIN:VCARD\r\n/.test(vcf)&&/\r\nFN:Jordan Rivers\r\n/.test(vcf)&&/\r\nADR;TYPE=WORK:;;123 Main St\\, Katy\\, TX 77494;;;;\r\n/.test(vcf),'the saved contact includes the address',vcf.slice(0,300));
  const ph=(vcf.match(/\r\nPHOTO;ENCODING=b;TYPE=JPEG:([\s\S]*?)\r\n(?! )/)||[])[1]||'',bytes=Buffer.from(ph.replace(/\r\n /g,''),'base64');
  T(bytes.length>2000&&bytes[0]===0xFF&&bytes[1]===0xD8&&vcf.split('\r\n').every(l=>l.length<=76)&&bytes.equals(files.get(S.card.data.photo.url.split('/live-cards/')[1]).buf),'the saved contact includes the headshot, byte for byte, in folded lines',bytes.length);
  const hrefs=await p.$$eval('.lc-card a',as=>as.map(a=>a.getAttribute('href')));T(hrefs.every(h=>/^(tel:|mailto:|sms:|https:\/\/|\/live-cards\/)/.test(h)),'every button on the public card is a safe link',hrefs.join(' '));
  // on a phone the page itself grows, so nothing is cut off
  const fit=await p.evaluate(()=>{const last=[...document.querySelectorAll('.lc-chip,.lc-made a')].map(e=>e.getBoundingClientRect().bottom+scrollY);return {doc:document.documentElement.scrollHeight,last:Math.max(...last),sideways:document.documentElement.scrollWidth>innerWidth+1}});
  T(fit.last<=fit.doc+1&&!fit.sideways,'on a phone the whole card can be reached and nothing scrolls sideways',JSON.stringify(fit));await p.close()}
// remove the photo and update: the old files go
{const p=await page('/studio/');const before=[...files.keys()];T(await p.$eval('#face-pv',e=>!e.hidden&&/\/photo-/.test(e.src)),'the Studio shows the published headshot when reopened');
  await p.click('#photo-clear');await p.waitForTimeout(500);T(await p.$eval('#lc',e=>!e.querySelector('.lc-face'))&&await p.$eval('#photo-word',e=>e.textContent)==='Add your photo','Remove takes the photo off the card');
  await p.click('#t-publish');await p.waitForTimeout(600);await p.click('#pub-update');await p.waitForTimeout(3000);const after=[...files.keys()];
  T(after.length===1&&/\/og-/.test(after[0])&&!before.includes(after[0])&&S.card.data.photo.url===''&&S.card.data.preview.url.endsWith(after[0].split('/')[1]),'updating without the photo deletes it from the store and redraws the link preview',after.join());await p.close()}
// the file limit: a full store still refuses the next upload (stand-in mirrors the 12 file rule)
{const p=await page('/studio/');const r=await p.evaluate(async()=>{const A=window.LiveCardsAPI,blob=new Blob([new Uint8Array(2000)],{type:'image/jpeg'});let ok=0,err='';for(let i=0;i<14;i++){try{await A.cards.upload(blob,'bg');ok++}catch(e){err=e.message}}
    let vid='';try{await A.cards.upload(new Blob([new Uint8Array(10)],{type:'video/mp4'}),'photo')}catch(e){vid=e.code}return {ok,err,vid}});
  T(r.ok===11&&/row-level security/.test(r.err),'the account file limit holds (12 files)',JSON.stringify(r));T(r.vid==='type','a video is refused as a headshot before it is sent');
  const png=await p.evaluate(async()=>{const A=window.LiveCardsAPI,b=new Blob([new Uint8Array(10)],{type:'image/png'}),o={};for(const k of ['bg','photo','og']){try{await A.cards.upload(b,k);o[k]='sent'}catch(e){o[k]=e.code}}return o});
  T(png.bg==='type'&&png.photo==='type'&&png.og==='type','a PNG is refused everywhere except as a logo',JSON.stringify(png));await p.close()}
T(errs.length===0,'no page errors and nothing blocked by the policy during normal use',errs.slice(0,6).join(' | '));
console.log(out.join('\n'));console.log(out.filter(x=>x.startsWith('FAIL')).length+' FAIL of '+out.length);await b.close()})().catch(e=>{console.log(out.join('\n'));console.error('CRASH',e.stack);process.exit(1)});
