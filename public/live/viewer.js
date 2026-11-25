/* Public card page: /c/<name>. Loads one card and shows it full screen. /c/?preview=1 shows the draft saved on this device. */
(function(){'use strict';
const A=window.LiveCardsAPI,phone=document.getElementById('lc'),msg=document.getElementById('lc-msg'),q=new URLSearchParams(location.search);
const slug=(q.get('id')||location.pathname.replace(/^\/c\/?/,'').replace(/\/$/,'')).toLowerCase().replace(/[^a-z0-9-]/g,'');
const say=(title,body)=>{msg.hidden=false;msg.querySelector('h1').textContent=title;msg.querySelector('p').textContent=body};
const SAMPLE={name:'Otis Williams',company:'Meridian Interface',role:'AI Architect',tagline:'Commercial ads and websites for your business',logo:{url:'/brand/meridian-mark.png',mark:true,line1:'MERIDIAN',line2:'INTERFACE'},
  actions:{phone:'+12818829198',text:true,email:'otis@meridianinterface.com',booking:'https://meridianinterface.com/?book=web_design',bookingLabel:'Book a 1-on-1 appointment',website:'https://meridianinterface.com/',facebook:'https://www.facebook.com/profile.php?id=61596523703192',instagram:'https://www.instagram.com/meridianinterface/'},background:{type:'scene',id:'ocean'}};
async function load(){
  if(q.get('preview')){const d=await A.local.get('draft');if(!d)return say('No draft on this device','Open the Studio to start your card.');
    const data=JSON.parse(JSON.stringify(d.data));for(const k of ['bgBlob','logoBlob','photoBlob'])if(d[k]){const u=URL.createObjectURL(d[k]);if(k==='bgBlob')data.background.url=u;else if(k==='logoBlob')data.logo.url=u;else data.photo={url:u}}return data}
  if(!slug||slug==='sample')return SAMPLE;
  if(!A.enabled)return say('This card is not available yet','Live Cards links are being set up. Please check back soon.');
  try{const row=await A.cards.bySlug(slug);if(!row)return say('Card not found','Check the link, or ask the owner for a new one.');return row.data}
  catch(e){return say('The card could not load',e.code==='offline'?'Check your internet connection and try again.':'Please try again in a moment.')}}
load().then(data=>{if(!data)return;const engine=window.LiveCard.init(phone);
  const c=window.LiveCardView.render(phone,data,{engine,cardUrl:location.origin+'/c/'+slug,madeLink:'/live-cards/'});
  document.title=c.name+(c.company?' | '+c.company:'');phone.hidden=false;
  const rep=document.getElementById('lc-report');if(rep&&A.enabled&&slug&&slug!=='sample'&&!q.get('preview')){rep.hidden=false;rep.addEventListener('click',async()=>{const why=window.prompt('What is wrong with this card?');if(!why)return;try{await A.cards.report(slug,why);rep.textContent='Thank you. We will review it.'}catch(e){rep.textContent='Could not send. Please try again later.'}})}});
})();
