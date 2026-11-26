// Live Cards demo mode: the whole journey with the service switched off, everything kept in the browser, nothing sent anywhere.
// Run: build the site, serve it on port 4799 (npx vite preview --port 4799), then: node tools/live-cards-demo-test.cjs
// (set CHROMIUM_PATH if Playwright's own browser is missing).
const {chromium}=require('playwright');const fs=require('fs');const {SITE,B,headersFor}=require('./lc-test-kit.cjs');
const out=[];const T=(ok,name,extra)=>{out.push((ok?'PASS ':'FAIL ')+name+(extra&&!ok?' :: '+String(extra).slice(0,300):''));};
(async()=>{const b=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const ctx=await b.newContext({viewport:{width:390,height:844},acceptDownloads:true});const outside=[],errs=[];
// the real site, under the real headers, with the real (switched off) settings; any request that leaves the site is recorded and refused
await ctx.route('**/*',async r=>{const u=new URL(r.request().url());if(u.origin!==B){outside.push(u.href);return r.abort()}
  // a card link: with the service off, the page function sends the plain card page (tested in live-cards-preview-test.cjs)
  const res=/^\/c\/[^/]+$/.test(u.pathname)?await r.fetch({url:B+'/c/index.html'}):await r.fetch(),h={...res.headers(),...headersFor(u.pathname)};if(h['content-security-policy'])h['content-security-policy']=h['content-security-policy'].replace(/;\s*upgrade-insecure-requests/,'');await r.fulfill({response:res,headers:h})});
const page=async u=>{const p=await ctx.newPage();p.on('pageerror',e=>errs.push(u+' '+e.message));p.on('console',m=>{if(m.type()==='error'&&!/Failed to load resource/.test(m.text()))errs.push(u+' '+m.text().slice(0,200))});await p.goto(B+u);await p.waitForTimeout(1200);return p};
let p=await page('/studio/');T(await p.evaluate(()=>!window.LiveCardsAPI.demo&&!document.getElementById('lc-demo')),'without ?demo=1 the Studio is the normal, switched-off Studio');
T(await p.evaluate(()=>{const f=window.LiveCardsDemoAllowed;return f('localhost')&&f('meridian-interface-website-abc.vercel.app')&&!f('meridianinterface.com')&&!f('cards.meridianinterface.com')&&!f('vercel.app.evil.example')}),'demo mode can only start on a test copy, never on meridianinterface.com');await p.close();
p=await page('/studio/?demo=1');T(await p.$eval('#lc-demo',e=>/stays on this phone/.test(e.textContent)),'demo mode shows a plain bar saying nothing leaves the phone');
const set=(id,v)=>p.fill('#'+id,v);await set('f-name','Jordan Rivers');await set('f-company','Rivers Realty');await p.click('#starts button[data-id=realtor]');await p.setInputFiles('#f-photo',SITE+'/public/card/bg/houston-skyline.jpg');await p.waitForTimeout(600);
await p.click('#t-buttons');await set('f-phone','281-555-0142');await set('f-email','jordan@riversrealty.example');await p.check('#f-leads');await set('f-review','https://g.page/r/rivers/review');await p.waitForTimeout(400);
await p.click('#t-publish');await p.waitForTimeout(500);T(await p.$eval('#pub-email',e=>!e.hidden),'the Share tab asks to sign in, as it will for real');
await set('f-acct','jordan@riversrealty.example');await p.click('#pub-email button');await p.waitForTimeout(400);await set('f-code','111111');await p.click('#pub-code button');await p.waitForTimeout(700);
await set('f-slug','jordan-rivers');await p.$eval('#f-rights',e=>e.checked=true);await p.click('#pub-btn');await p.waitForTimeout(2500);
T(await p.$eval('#pub-done',e=>!e.hidden)&&/\/c\/jordan-rivers$/.test(await p.$eval('#pub-link',e=>e.textContent)),'any email and any 6 digits sign in, and the card publishes',await p.$eval('#pub-link',e=>e.textContent));
const [dl]=await Promise.all([p.waitForEvent('download'),p.click('#dl-qr')]);T(dl.suggestedFilename()==='jordan-rivers-qr.png','downloads work in the demo');
// the card, opened in the same browser
const c=await page('/c/jordan-rivers');T(await c.$eval('.lc-name',e=>e.textContent)==='Jordan Rivers'&&await c.$eval('.lc-face',im=>im.complete&&im.naturalWidth>0),'the published card opens, with its photo, after a fresh page load');
await c.$eval('.lc-pill',a=>{a.addEventListener('click',e=>e.preventDefault(),{once:true,capture:false});a.click()});await c.waitForTimeout(300); // count a Call tap without leaving the page
  T((await c.$$eval('.lc-chip',x=>x.map(e=>e.textContent))).includes('Send me your info'),'the card shows Send me your info',(await c.$$eval('.lc-chip',x=>x.map(e=>e.textContent))).join('|'));
await c.click('.lc-chip:has-text("Send me your info")');await c.fill('.lc-form input >> nth=0','Sam Carter');await c.fill('.lc-form input >> nth=1','281-555-0199');await c.click('.lc-form button[type=submit]');await c.waitForTimeout(600);
T(await c.$eval('.lc-form h2',e=>e.textContent)==='Sent','a visitor can send their info');await c.close();
await p.reload();await p.waitForTimeout(1500);await p.click('#t-activity');await p.waitForTimeout(800);
T(await p.$eval('#st-opens',e=>e.textContent)==='1'&&(await p.$$eval('#st-bars li span',s=>s.map(x=>x.textContent))).includes('Sent you their info')&&(await p.$$eval('#people li b',s=>s.map(x=>x.textContent))).join()==='Sam Carter','Activity shows the open, the taps and the person, after a reload');
T(await p.$eval('#who',e=>!e.hidden)&&(await p.$$eval('#f-who option',o=>o.map(x=>x.textContent))).includes('Add a team member'),'team cards can be tried (the demo acts as the paid plan)');
T(outside.length===0,'nothing at all was sent outside the site',outside.slice(0,5).join(' '));
await p.goto(B+'/studio/?demo=0');await p.waitForTimeout(900);T(await p.evaluate(()=>!window.LiveCardsAPI.demo&&!document.getElementById('lc-demo')),'Leave demo turns it off');
T(errs.length===0,'no page errors and nothing blocked by the policy',errs.slice(0,5).join(' | '));
console.log(out.join('\n'));console.log(out.filter(x=>x.startsWith('FAIL')).length+' FAIL of '+out.length);await b.close()})().catch(e=>{console.log(out.join('\n'));console.error('CRASH',e.stack);process.exit(1)});
