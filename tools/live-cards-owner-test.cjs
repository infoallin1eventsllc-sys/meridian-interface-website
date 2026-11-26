// The owner portal's Live Cards tab, in a browser, under the site's real headers, against stand-in data. Nothing real is contacted.
// Run: build the site, serve it on port 4799 (npx vite preview --port 4799), then: node tools/live-cards-owner-test.cjs   (needs Playwright; if its own browser is missing, set CHROMIUM_PATH to a Chromium binary)
const {chromium}=require('playwright');const fs=require('fs');
const SITE=require('path').resolve(__dirname,'..'),B='http://localhost:4799',OUT=process.env.SHOTS||require('os').tmpdir();
const V=JSON.parse(fs.readFileSync(SITE+'/vercel.json','utf8'));const rules=V.headers.map(h=>({re:new RegExp('^'+h.source+'$'),headers:h.headers}));
const out=[];const T=(ok,n,x)=>out.push((ok?'PASS ':'FAIL ')+n+(!ok&&x?' :: '+x:''));
(async()=>{const b=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined});
for(const mode of ['on','off']){for(const [w,h] of mode==='on'?[[1280,900],[390,844]]:[[390,844]]){
const ctx=await b.newContext({viewport:{width:w,height:h}});const calls=[];
const U2='99999999-2222-4333-8444-555555555555',C2='c0000000-0000-4000-8000-000000000002';
const card={id:C2,slug:'fake-bank',name:'<img src=x onerror="window.__x=1">Totally A Bank',company:'First National',published:true,blocked:false,updated_at:'2026-11-22T10:00:00Z',account:{id:U2,email:'someone@example.com',plan:'free',pays_through_stripe:false}};
let reports=[{id:1,slug:'fake-bank',reason:'Pretends to be my bank <script>window.__x=1</script>',handled:false,created_at:'2026-11-23T10:00:00Z',card}];
await ctx.addInitScript(()=>{try{sessionStorage.setItem('meridian_owner_token','test.token')}catch(e){}});
await ctx.route(B+'/**',async r=>{const res=await r.fetch();const p=new URL(r.request().url()).pathname;const headers={...res.headers()};for(const x of rules)if(x.re.test(p))for(const hh of x.headers)headers[hh.key.toLowerCase()]=hh.value;
  if(headers['content-security-policy'])headers['content-security-policy']=headers['content-security-policy'].replace(/;\s*upgrade-insecure-requests/,'');await r.fulfill({response:res,headers})});
const cors={'access-control-allow-origin':'*','access-control-allow-headers':'*'};const J=(r,body,status=200)=>r.fulfill({status,headers:{...cors,'content-type':'application/json'},body:JSON.stringify(body)});
await ctx.route(/posthog/,r=>r.abort());
await ctx.route('**/functions/v1/**',async r=>{const q=r.request();if(q.method()==='OPTIONS')return r.fulfill({status:204,headers:{...cors,'access-control-allow-methods':'POST'}});const u=new URL(q.url());let body={};try{body=q.postDataJSON()||{}}catch(e){}
  if(u.pathname.endsWith('/lc-admin')){calls.push(body);if(mode==='off')return r.fulfill({status:404,headers:cors,contentType:'application/json',body:JSON.stringify({code:'NOT_FOUND',message:'Requested function was not found'})});
    if((q.headers()['authorization']||'')!=='Bearer test.token')return J(r,{ok:false,error:'unauthorized'},401);
    if(body.action==='overview')return J(r,{ok:true,cards:12,published:9,blocked_accounts:card.blocked?1:0,paid_accounts:3,open_reports:reports.filter(x=>!x.handled).length});
    if(body.action==='reports')return J(r,{ok:true,reports:reports.filter(x=>body.show==='all'||!x.handled)});
    if(body.action==='cards')return J(r,{ok:true,cards:[card]});
    if(body.action==='take_down'){card.blocked=true;return J(r,{ok:true,blocked:true})}
    if(body.action==='restore'){card.blocked=false;return J(r,{ok:true,blocked:false})}
    if(body.action==='set_plan'){card.account.plan=body.plan;return J(r,{ok:true,plan:body.plan,pays_through_stripe:false})}
    if(body.action==='report_done'){reports[0].handled=true;return J(r,{ok:true})}
    if(body.action==='remove_files')return J(r,{ok:true,removed:2});
    return J(r,{ok:false,error:'unknown action'},400)}
  if(u.pathname.endsWith('/owner'))return J(r,body.action==='list'?{invoices:[]}:body.action==='security_status'?{twoStep:false,events:[]}:{configured:true,twoStep:false,ok:true,invoices:[],catalogue:null});
  return J(r,{ok:true,overrides:{},leads:[],items:[]})});
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push('pageerror '+e.message));p.on('console',m=>{if(m.type()==='error'&&!/Failed to load resource/.test(m.text()))errs.push(m.text().slice(0,200))});
await p.goto(B+'/');await p.waitForTimeout(1200);await p.locator('footer button').filter({hasText:'Studio login'}).first().click();await p.waitForTimeout(1500);
const tab=p.locator('button').filter({hasText:/^\s*(badge)?\s*Live Cards\s*$/}).first();
if(!(await tab.count())){T(false,`[${mode} ${w}] Live Cards tab present`,(await p.locator('body').innerText()).slice(0,300));await ctx.close();continue}
await tab.click();await p.waitForTimeout(1200);const tag=`[${mode} ${w}px]`;
if(mode==='off'){T(await p.getByText('Live Cards is not switched on yet').count()===1,tag+' says plainly that the service is off when the function is absent');T(errs.length===0,tag+' no errors',errs.join(' | '));await p.screenshot({path:`${OUT}/owner-off.png`});await ctx.close();continue}
T(await p.getByText('Reports from visitors').count()===1&&await p.getByText('Open reports').count()===1,tag+' desk loads with the summary and reports');
T(await p.evaluate(()=>!window.__x&&!document.querySelector('main img[src="x"], section script')),tag+' client text is shown as plain text, not run');
const iconW=await tab.locator('.material-symbols-outlined').first().evaluate(e=>e.getBoundingClientRect().width).catch(()=>0);T(iconW>0&&iconW<=30,tag+' tab icon draws as an icon, not as a word',String(iconW));
await p.screenshot({path:`${OUT}/owner-${w}.png`,fullPage:true});
T(await p.evaluate(()=>{const t=[...document.querySelectorAll('section[aria-label="Live Cards at a glance"] > div')].map(d=>d.textContent);return /Open reports/.test(t[0]||'')}),tag+' open reports come first');
const down=p.getByRole('button',{name:'Take this card down'}).first();await down.click();await p.waitForTimeout(150);T(!calls.some(c=>c.action==='take_down'),tag+' one tap does not take a card down');
T(await p.getByText('This blocks the whole account').count()===1,tag+' before the second tap it says the whole account is blocked');
await p.getByRole('button',{name:'Tap again to take it down'}).first().click();await p.waitForTimeout(900);T(calls.some(c=>c.action==='take_down'&&c.card_id===C2)&&await p.getByText('Taken down').count()>=1,tag+' second tap takes it down and the screen shows it');
await p.getByRole('button',{name:'Put it back'}).first().click();await p.waitForTimeout(900);T(calls.some(c=>c.action==='restore')&&await p.getByText('Taken down').count()===0,tag+' put it back works');
await p.getByRole('button',{name:'Set to paid plan'}).first().click();await p.waitForTimeout(900);T(calls.some(c=>c.action==='set_plan'&&c.plan==='pro'&&c.user_id===U2)&&await p.getByText('Paid plan').count()>=1,tag+' plan can be set by hand');
await p.fill('#lc-find','bank');await p.getByRole('button',{name:'Search',exact:true}).click();await p.waitForTimeout(900);T(calls.some(c=>c.action==='cards'&&c.q==='bank'),tag+' search runs');
await p.getByRole('button',{name:'Mark as handled'}).first().click();await p.waitForTimeout(900);T(await p.getByText('No open reports.').count()===1,tag+' report can be marked handled');
const sw=await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth);T(sw<=1,tag+' no sideways scroll',String(sw));
T(errs.length===0,tag+' no page errors and nothing blocked by the site policy',errs.slice(0,4).join(' | '));
await ctx.close()}}
console.log(out.join('\n'));console.log(out.filter(x=>x.startsWith('FAIL')).length+' FAIL of '+out.length);await b.close()})().catch(e=>{console.log(out.join('\n'));console.error('CRASH',e.message);process.exit(1)});
