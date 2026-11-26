// Shared by the Live Cards browser tests: a stand-in for the service that enforces the same rules as the database
// (system/supabase/migrations/0047_live_cards.sql in the work repo), the site served under the exact headers in vercel.json,
// and the real /c/<name> page function (api/lc-card.js) run in this process. Nothing real is contacted.
const fs=require('fs'),path=require('path'),os=require('os');
const SITE=path.resolve(__dirname,'..'),B='http://localhost:4799',SB='https://glzodwhyavexpuusbqjy.supabase.co',UID='11111111-2222-4333-8444-555555555555';
const V=JSON.parse(fs.readFileSync(SITE+'/vercel.json','utf8')),rules=V.headers.map(h=>({re:new RegExp('^'+h.source+'$'),headers:h.headers}));
const headersFor=p=>{const o={};for(const x of rules)if(x.re.test(p))for(const h of x.headers)o[h.key.toLowerCase()]=h.value;return o};
const configOn=()=>fs.readFileSync(SITE+'/public/live/config.js','utf8').replace('enabled:false','enabled:true').replace("key:''","key:'test-publishable-key-0123456789'").replace('activity:false','activity:true');
/** Bundles api/lc-card.js and returns run(url, fetchImpl): the function's Response for that address, with every outside request answered by fetchImpl. */
function cardPage(){const out=path.join(fs.mkdtempSync(path.join(os.tmpdir(),'lc-card-')),'lc-card.cjs');
  require(SITE+'/node_modules/esbuild').buildSync({entryPoints:[SITE+'/api/lc-card.js'],bundle:true,format:'cjs',platform:'neutral',target:'es2022',outfile:out,logLevel:'silent'});
  const mod=require(out);let chain=Promise.resolve();
  return (url,fetchImpl,init)=>{const go=async()=>{const real=globalThis.fetch;globalThis.fetch=fetchImpl;try{return await mod.default.fetch(new Request(url,init))}finally{globalThis.fetch=real}};const r=chain.then(go,go);chain=r.catch(()=>{});return r}}
// the same cleaning the database does to whatever a client sends
const fileOK=(u,kind)=>new RegExp('^'+SB.replace(/\./g,'\\.')+'/storage/v1/object/public/live-cards/'+UID+'/'+kind+'-[a-z0-9]{1,16}\\.'+(kind==='bg'?'(jpg|mp4|mov|webm)':kind==='logo'?'(jpg|png)':'jpg')+'$').test(u||'')?u:'';
const linkOK=u=>/^https?:\/\/[^\s<>"'`]{3,}$/.test(u||'')?u:'';
const txt=(s,n)=>String(s==null?'':s).replace(/[\u0000-\u001f\u007f]/g,' ').trim().slice(0,n);
const mailOK=e=>/^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+$/.test(e||'')?e:'',telOK=p=>{const d=String(p||'').replace(/[^0-9+]/g,'');return /^\+?[0-9]{7,15}$/.test(d)?d:''};
function cleanCard(p){p=p||{};const a=p.actions||{},g=p.background||{},l=p.logo||{},ph=p.photo||{},pv=p.preview||{};let type=['scene','image','video'].includes(g.type)?g.type:'scene';const url=fileOK(g.url,'bg');if(type!=='scene'&&!url)type='scene';
  return {v:1,lang:p.lang==='es'?'es':'en',name:txt(p.name,60),company:txt(p.company,60),role:txt(p.role,60),tagline:txt(p.tagline,90),accent:/^#[0-9a-f]{6}$/i.test(p.accent||'')?p.accent:'#2563eb',
    logo:{url:fileOK(l.url,'logo'),mark:false,line1:txt(l.line1,24),line2:txt(l.line2,24)},photo:{url:fileOK(ph.url,'photo')},preview:{url:fileOK(pv.url,'og')},hours:txt(p.hours,60),
    actions:{phone:telOK(a.phone),text:a.text===true,email:mailOK(txt(a.email,200)),booking:linkOK(a.booking),bookingLabel:txt(a.bookingLabel,34),website:linkOK(a.website),facebook:linkOK(a.facebook),instagram:linkOK(a.instagram),linkedin:linkOK(a.linkedin),tiktok:linkOK(a.tiktok),youtube:linkOK(a.youtube),
      address:txt(a.address,140),review:linkOK(a.review),cashapp:/^[A-Za-z0-9_]{1,20}$/.test(a.cashapp||'')?a.cashapp:'',venmo:/^[A-Za-z0-9_-]{5,30}$/.test(a.venmo||'')?a.venmo:'',zelle:mailOK(txt(a.zelle,200))||telOK(a.zelle),leads:a.leads===true},
    background:{type,id:/^[a-z]{2,12}$/.test(g.id||'')?g.id:'ocean',url:type==='scene'?'':url,fit:g.fit==='band'?'band':'fill',bg:/^#[0-9a-f]{6}$/i.test(g.bg||'')?g.bg:'#000000',sound:g.sound!==false},showMade:true}}
/** Wires the stand-in service and the site into a browser context. Returns the state the tests look at. */
async function standIn(ctx){const S={UID,B,SB,SITE,files:new Map(),reports:[],calls:[],cards:[],plan:'free',otpSent:0,pages:[],hits:{},leads:[]};
  Object.defineProperty(S,'card',{get(){return S.cards[0]||null},set(v){S.cards=v?[v]:[]}}); // most checks look at the first card
  const bySlug=sl=>S.cards.find(c=>c.slug===sl&&c.published)||null,limit=()=>S.plan==='pro'?5:1;
  S.tok='t.'+Buffer.from(JSON.stringify({sub:UID})).toString('base64')+'.s';
  const cors={'access-control-allow-origin':'*','access-control-allow-headers':'*','access-control-allow-methods':'GET,POST,PATCH,DELETE'};
  const J=(r,body,status=200)=>r.fulfill({status,headers:{...cors,'content-type':'application/json'},body:JSON.stringify(body)});
  await ctx.route(SB+'/**',async r=>{const q=r.request(),u=new URL(q.url()),m=q.method(),pth=u.pathname;S.calls.push(m+' '+pth);
    if(m==='OPTIONS')return r.fulfill({status:204,headers:cors});
    const authed=(q.headers()['authorization']||'')==='Bearer '+S.tok;let body=null;try{body=q.postDataJSON()}catch(e){}
    if(pth==='/auth/v1/otp'){S.otpSent++;return J(r,{})}
    if(pth==='/auth/v1/verify')return body&&body.token==='123456'?J(r,{access_token:S.tok,refresh_token:'r1',expires_in:3600,user:{id:UID,email:body.email}}):J(r,{msg:'Token has expired or is invalid'},403);
    if(pth==='/auth/v1/logout')return J(r,{});
    if(pth==='/rest/v1/rpc/lc_slug_available')return J(r,!S.cards.some(c=>c.slug===body.p_slug)&&!['admin','studio'].includes(body.p_slug));
    if(pth==='/rest/v1/lc_accounts')return authed?J(r,[{plan:S.plan}]):J(r,{message:'no'},401);
    if(pth==='/rest/v1/rpc/lc_get_card'){const c=bySlug(body.p_slug);return J(r,c?c.data:null)}
    // activity: counts by event for a published card; a visitor may leave a name and one phone number or email; only the owner reads or removes them
    if(pth==='/rest/v1/rpc/lc_hit'){if(bySlug(body.p_slug)&&/^(open|call|text|email|book|web|map|save|review|pay|social)$/.test(body.p_event))S.hits[body.p_event]=(S.hits[body.p_event]||0)+1;return r.fulfill({status:204,headers:cors})}
    if(pth==='/rest/v1/rpc/lc_send_info'){const n=txt(body.p_name,60),c=mailOK(txt(body.p_contact,200))||telOK(body.p_contact);if(!(bySlug(body.p_slug)&&bySlug(body.p_slug).data.actions.leads)||n.length<2||!c)return J(r,{message:'not accepted'},400);
      if(S.leads.length>=5)return J(r,{message:'too many'},429);S.leads.unshift({id:'d0000000-0000-4000-8000-00000000000'+S.leads.length,name:n,contact:c,note:txt(body.p_note,200),created_at:new Date().toISOString()});S.hits.info=(S.hits.info||0)+1;return r.fulfill({status:204,headers:cors})}
    if(pth==='/rest/v1/rpc/lc_card_stats'){if(!authed)return J(r,{message:'no'},401);const {open,...taps}=S.hits;return J(r,{days:30,opens:open||0,taps})}
    if(pth==='/rest/v1/lc_leads'){if(!authed)return J(r,{message:'permission denied for table lc_leads',code:'42501'},401);if(m==='DELETE'){const id=(u.searchParams.get('id')||'').replace('eq.','');S.leads=S.leads.filter(l=>l.id!==id);return r.fulfill({status:204,headers:cors})}return J(r,S.leads)}
    if(pth==='/rest/v1/rpc/lc_report'){S.reports.push(body);return r.fulfill({status:204,headers:cors})}
    if(pth==='/rest/v1/rpc/lc_delete_account'){if(!authed)return J(r,{message:'no'},401);S.card=null;return r.fulfill({status:204,headers:cors})}
    if(pth==='/rest/v1/lc_cards'){if(m==='GET'&&!authed)return J(r,{message:'permission denied for table lc_cards',code:'42501'},401);
      if(m==='GET')return J(r,S.cards);if(!authed)return J(r,{message:'no'},401);const id=(u.searchParams.get('id')||'').replace('eq.','');
      if(m==='DELETE'){S.cards=S.cards.filter(c=>c.id!==id);return r.fulfill({status:204,headers:cors})}
      if(m==='POST'){if(S.cards.length>=limit())return J(r,{message:'Your plan allows '+limit()+' card'+(limit()>1?'s':'')+'.',code:'P0001'},400);if(S.cards.some(c=>c.slug===body.slug))return J(r,{message:'duplicate key',code:'23505'},409);
        const c={id:'c0000000-0000-4000-8000-00000000000'+(S.made=(S.made||0)+1),slug:body.slug,data:cleanCard(body.data),published:!!body.published,updated_at:new Date().toISOString()};S.cards.push(c);return J(r,[c],201)}
      if(m==='PATCH'){const c=S.cards.find(x=>x.id===id);if(!c)return J(r,[]);Object.assign(c,{slug:body.slug,data:cleanCard(body.data),published:!!body.published});return J(r,[c])}}
    if(pth.startsWith('/storage/v1/object/list/')){return J(r,[...S.files.keys()].map(n=>({name:n.split('/')[1]})))}
    if(pth.startsWith('/storage/v1/object/public/live-cards/')){const n=pth.split('/live-cards/')[1],f=S.files.get(n);return f?r.fulfill({status:200,headers:{...cors,'content-type':f.type},body:f.buf}):r.fulfill({status:404,headers:cors,body:''})}
    if(pth==='/storage/v1/object/live-cards'&&m==='DELETE'){for(const n of body.prefixes)S.files.delete(n);return J(r,[])}
    if(pth.startsWith('/storage/v1/object/live-cards/')&&m==='POST'){const n=pth.split('/live-cards/')[1],type=q.headers()['content-type'];
      const ok=authed&&new RegExp('^'+UID+'/(bg-[a-z0-9]{1,16}\\.(jpg|mp4|mov|webm)|logo-[a-z0-9]{1,16}\\.(jpg|png)|(photo|og)-[a-z0-9]{1,16}\\.jpg)$').test(n)&&['image/jpeg','image/png','video/mp4','video/quicktime','video/webm'].includes(type)&&S.files.size<12;
      if(!ok)return J(r,{message:'new row violates row-level security policy',statusCode:'403'},403);S.files.set(n,{type,buf:q.postDataBuffer()});return J(r,{Key:'live-cards/'+n})}
    return J(r,{message:'unexpected '+m+' '+pth},500)});
  // the site with the real headers; the service is switched on for the test only. A card's link goes through the real page function.
  const run=cardPage(),inner=async(url,init)=>{const u=new URL(String(url));
    if(u.origin===B&&u.pathname==='/live/config.js')return new Response(configOn(),{status:200});
    if(u.origin===SB&&u.pathname==='/rest/v1/rpc/lc_get_card'){const b=JSON.parse(init.body),c=bySlug(b.p_slug);return new Response(JSON.stringify(c?c.data:null),{status:200,headers:{'content-type':'application/json'}})}
    return new Response('unexpected',{status:500})};
  await ctx.route(B+'/**',async r=>{const u=new URL(r.request().url()),p=u.pathname;
    if(p==='/live/config.js')return r.fulfill({status:200,contentType:'text/javascript',body:configOn()});
    if(/^\/c\/[^/]+$/.test(p)){const res=await run(B+'/api/lc-card?slug='+encodeURIComponent(p.slice(3)),inner),h={};res.headers.forEach((v,k)=>{h[k.toLowerCase()]=v});Object.assign(h,headersFor(p));S.pages.push({path:p,html:await res.clone().text()});
      h['content-security-policy']=h['content-security-policy'].replace(/;\s*upgrade-insecure-requests/,'');return r.fulfill({status:res.status,headers:h,body:await res.text()})}
    const res=await r.fetch(),headers={...res.headers(),...headersFor(p)};
    if(headers['content-security-policy'])headers['content-security-policy']=headers['content-security-policy'].replace(/;\s*upgrade-insecure-requests/,'');
    await r.fulfill({response:res,headers})});
  return S}
module.exports={SITE,B,SB,UID,rules,headersFor,configOn,cardPage,cleanCard,standIn};
