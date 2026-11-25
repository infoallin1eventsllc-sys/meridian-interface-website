// Plans, the human check and the own-address switch in the Studio, in a browser, under the real headers, against stand-ins.
// Run: build the site, serve it on port 4799 (npx vite preview --port 4799), then: node tools/live-cards-plans-test.cjs   (needs Playwright; if its own browser is missing, set CHROMIUM_PATH to a Chromium binary)
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
const SITE=path.resolve(__dirname,'..'),B='http://localhost:4799',SB='https://glzodwhyavexpuusbqjy.supabase.co';
const V=JSON.parse(fs.readFileSync(SITE+'/vercel.json','utf8'));const rules=V.headers.map(h=>({re:new RegExp('^'+h.source+'$'),headers:h.headers}));
const out=[];const T=(ok,n,x)=>out.push((ok?'PASS ':'FAIL ')+n+(!ok&&x?' :: '+x:''));
const UID='11111111-2222-4333-8444-555555555555',tok='t.x.s';
const cors={'access-control-allow-origin':'*','access-control-allow-headers':'*','access-control-allow-methods':'GET,POST,PATCH,DELETE'};
const J=(r,body,status=200)=>r.fulfill({status,headers:{...cors,'content-type':'application/json'},body:JSON.stringify(body)});
async function world(b,{cfg={},csp=x=>x,base=B,signedIn=true}={}){const ctx=await b.newContext({viewport:{width:390,height:844}});
  const st={plan:'free',billingUrl:'https://checkout.stripe.com/c/pay/cs_test_1',billingCalls:[],otp:[],saved:null,nav:[]};
  if(signedIn)await ctx.addInitScript(([UID,tok])=>{try{if(location.hostname==='localhost')localStorage.setItem('lc_session',JSON.stringify({access_token:tok,refresh_token:'r',expires_at:Math.floor(Date.now()/1000)+3600,user:{id:UID,email:'a@example.com'}}))}catch(e){}},[UID,tok]);
  await ctx.route(SB+'/**',async r=>{const q=r.request(),u=new URL(q.url()),m=q.method();if(m==='OPTIONS')return r.fulfill({status:204,headers:cors});let body=null;try{body=q.postDataJSON()}catch(e){}
    if(u.pathname==='/auth/v1/otp'){st.otp.push(body);return J(r,{})}
    if(u.pathname==='/rest/v1/lc_accounts')return J(r,[{plan:st.plan}]);
    if(u.pathname==='/functions/v1/lc-billing'){st.billingCalls.push({body,auth:q.headers()['authorization']});return J(r,{ok:true,url:st.billingUrl})}
    if(u.pathname==='/rest/v1/lc_cards'){if(m==='GET')return J(r,st.saved?[st.saved]:[]);const d=body.data;d.showMade=st.plan==='pro'?d.showMade!==false:true;st.saved={id:'c0000000-0000-4000-8000-000000000001',slug:body.slug,data:d,published:!!body.published,updated_at:'x'};return J(r,[st.saved],m==='POST'?201:200)}
    if(u.pathname==='/rest/v1/rpc/lc_slug_available')return J(r,true);
    if(u.pathname.startsWith('/storage/v1/object/list/'))return J(r,[]);
    return J(r,{message:'unexpected '+u.pathname},500)});
  for(const host of ['https://checkout.stripe.com','https://billing.stripe.com','https://evil.example','https://cards.example.test'])await ctx.route(host+'/**',r=>{st.nav.push(r.request().url());return r.fulfill({status:200,contentType:'text/html',body:'<title>stand-in</title>ok'})});
  await ctx.route('https://challenges.cloudflare.com/**',r=>r.fulfill({status:200,contentType:'text/javascript',body:"window.turnstile={render:(el,o)=>{el.textContent='[human check]';setTimeout(()=>o.callback('human-token-123'),50);return 'w1'},reset:()=>{}};"}));
  await ctx.route(base+'/**',async r=>{const u=new URL(r.request().url());const p=u.pathname;
    if(p==='/live/config.js'){let c=fs.readFileSync(SITE+'/public/live/config.js','utf8').replace('enabled:false','enabled:true').replace("key:''","key:'test-publishable-key'");for(const [k,v] of Object.entries(cfg))c=c.replace(new RegExp(k+":(false|'')"),k+':'+JSON.stringify(v));return r.fulfill({status:200,contentType:'text/javascript',body:c})}
    let res;try{res=await r.fetch({url:B+p+u.search})}catch(e){return r.abort().catch(()=>{})}const headers={...res.headers()};for(const x of rules)if(x.re.test(p))for(const h of x.headers)headers[h.key.toLowerCase()]=h.value;
    if(headers['content-security-policy'])headers['content-security-policy']=csp(headers['content-security-policy'].replace(/;\s*upgrade-insecure-requests/,''));await r.fulfill({response:res,headers}).catch(()=>{})});
  const errs=[];const open=async url=>{const p=await ctx.newPage();p.on('pageerror',e=>errs.push('pageerror '+e.message));p.on('console',m=>{if(m.type()==='error'&&!/Failed to load resource/.test(m.text()))errs.push(m.text().slice(0,220))});await p.goto(base+url).catch(()=>{});await p.waitForTimeout(1300);return p};
  return {ctx,st,errs,open}}
(async()=>{const b=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--host-resolver-rules=MAP wrong.test 127.0.0.1']});
// 1. plans off (the default): nothing about plans is shown or asked
{const w=await world(b);const p=await w.open('/studio/');await p.click('#t-publish');await p.waitForTimeout(500);
  T(await p.$eval('#plan',e=>e.hidden)&&w.st.billingCalls.length===0,'with plans switched off, the Studio shows nothing about plans');T(w.errs.length===0,'plans off: no errors',w.errs.join(' | '));await w.ctx.close()}
// 2. plans on, free account
{const w=await world(b,{cfg:{billing:true}});const p=await w.open('/studio/');await p.fill('#f-name','Jordan Rivers');await p.click('#t-publish');await p.waitForTimeout(900);
  T(await p.$eval('#plan',e=>!e.hidden)&&await p.$eval('#plan-up',e=>!e.hidden)&&await p.$eval('#plan-manage',e=>e.hidden)&&await p.$eval('#plan-made',e=>e.hidden),'free account sees Upgrade, not Manage, and cannot hide the Made-with line');
  T(!/\$|USD|per month|\/mo/i.test(await p.$eval('#plan',e=>e.textContent)),'no price is shown in the Studio');
  w.st.billingUrl='https://evil.example/pay';await p.click('#plan-up');await p.waitForTimeout(900);
  T(!w.st.nav.some(u=>u.startsWith('https://evil.example'))&&p.url().startsWith(B),'a payment address that is not Stripe is refused: the Studio stays put');
  w.st.billingUrl='https://checkout.stripe.com.evil.example/pay';await p.click('#plan-up');await p.waitForTimeout(900);T(p.url().startsWith(B),'a look-alike Stripe address is refused too');
  w.st.billingUrl='https://checkout.stripe.com/c/pay/cs_test_1';await p.click('#plan-up');await p.waitForTimeout(1200);
  T(p.url().startsWith('https://checkout.stripe.com/'),'a real Stripe address opens Stripe\'s own payment page',p.url());
  const c=w.st.billingCalls.at(-1);T(JSON.stringify(c.body)==='{"action":"checkout"}'&&c.auth==='Bearer '+tok,'the Studio sends one word and the sign-in, no price or account');await w.ctx.close()}
// 3. coming back from Stripe proves nothing; the plan only shows once the service says so
{const w=await world(b,{cfg:{billing:true}});const p=await w.open('/studio/?plan=thanks');await p.click('#t-publish');await p.waitForTimeout(1200);
  T(await p.$eval('#plan-manage',e=>e.hidden)&&!p.url().includes('plan='),'returning with "thanks" in the address does not unlock anything by itself');
  w.st.plan='pro';await p.waitForTimeout(6500);T(await p.$eval('#plan-manage',e=>!e.hidden)&&await p.$eval('#plan-up',e=>e.hidden)&&await p.$eval('#plan-made',e=>!e.hidden),'once the service confirms payment, the paid controls appear');
  w.st.billingUrl='https://billing.stripe.com/p/session/x';await p.click('#plan-manage');await p.waitForTimeout(1200);T(p.url().startsWith('https://billing.stripe.com/')&&w.st.billingCalls.at(-1).body.action==='portal','Manage my plan opens Stripe\'s own page');
  T(w.errs.length===0,'plans on: no page errors and nothing blocked by the policy',w.errs.join(' | '));await w.ctx.close()}
// 4. human check: needs its key AND the policy line; with both, the token rides along with the sign-in request
{const KEY='0x4AAAAAAATESTKEY123';const w=await world(b,{cfg:{humanCheck:KEY},signedIn:false});const p=await w.open('/studio/');await p.click('#t-publish');await p.waitForTimeout(900);
  T(/could not load/.test(await p.$eval('#human',e=>e.textContent)),'human check with a key but without the policy change: blocked by the policy, and the Studio says so');
  await p.fill('#f-acct','a@example.com');await p.click('#pub-email button');await p.waitForTimeout(500);T(w.st.otp.length===0,'no sign-in code is requested while the human check has not passed');await w.ctx.close();
  const allow=c=>c.replace("script-src 'self'","script-src 'self' https://challenges.cloudflare.com").replace("frame-src 'none'","frame-src https://challenges.cloudflare.com");
  const w2=await world(b,{cfg:{humanCheck:KEY},signedIn:false,csp:allow});const p2=await w2.open('/studio/');await p2.click('#t-publish');await p2.waitForTimeout(900);
  await p2.fill('#f-acct','a@example.com');await p2.click('#pub-email button');await p2.waitForTimeout(700);
  T(w2.st.otp.length===1&&w2.st.otp[0].gotrue_meta_security&&w2.st.otp[0].gotrue_meta_security.captcha_token==='human-token-123','with the policy line added, the passed check is sent with the sign-in request',JSON.stringify(w2.st.otp));
  T(w2.errs.length===0,'human check on: no errors',w2.errs.join(' | '));await w2.ctx.close()}
// 5. own address: opened anywhere else, the app drops any sign-in kept there and moves to its own address
{const w=await world(b,{cfg:{appOrigin:'https://cards.example.test'},base:'http://wrong.test:4799',signedIn:false});
  await w.ctx.addInitScript(()=>{try{if(location.hostname==='wrong.test'&&!localStorage.getItem('seeded')){localStorage.setItem('seeded','1');localStorage.setItem('lc_session','{"access_token":"left-behind"}')}}catch(e){}});
  const p=await w.open('/studio/?x=1');T(p.url()==='https://cards.example.test/studio/?x=1','opened on the wrong address, the Studio moves to its own address',p.url());
  const p2=await w.ctx.newPage();await p2.goto('http://wrong.test:4799/live-cards/terms/').catch(()=>{});const left=await p2.evaluate(()=>localStorage.getItem('lc_session')).catch(()=>'?');T(left===null,'and the sign-in kept on the wrong address is removed',String(left));await w.ctx.close();
  const w3=await world(b,{cfg:{appOrigin:'https://cards.example.test'}});const p3=await w3.open('/studio/');T(p3.url().startsWith(B),'a developer copy on localhost still opens');await w3.ctx.close()}
console.log(out.join('\n'));console.log(out.filter(x=>x.startsWith('FAIL')).length+' FAIL of '+out.length);await b.close()})().catch(e=>{console.log(out.join('\n'));console.error('CRASH',e.message);process.exit(1)});
