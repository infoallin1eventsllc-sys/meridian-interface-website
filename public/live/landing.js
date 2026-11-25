/* Live Cards landing: a working sample card and a picker that swaps its background. */
(function(){'use strict';
const phone=document.getElementById('lc'),engine=window.LiveCard.init(phone),hint=document.getElementById('hint'),seg=document.getElementById('seg');
const SAMPLE={name:'Otis Williams',company:'Meridian Interface',role:'AI Architect',tagline:'Commercial ads and websites for your business',logo:{url:'/brand/meridian-mark.png',mark:true,line1:'MERIDIAN',line2:'INTERFACE'},
  actions:{phone:'+12818829198',text:true,email:'otis@meridianinterface.com',booking:'https://meridianinterface.com/?book=web_design',bookingLabel:'Book a 1-on-1 appointment',website:'https://meridianinterface.com/',facebook:'https://www.facebook.com/profile.php?id=61596523703192',instagram:'https://www.instagram.com/meridianinterface/'},showMade:false};
const VIDEOS=[{id:'v-ad',name:'Animated ad',col:'Your own video',hint:'This background is a video. Yours can be your own ad or footage. Tap the speaker at the top right of the card to hear it.',bg:{type:'video',url:'/live/samples/bg-pcflat.mp4',fit:'band',bg:'#2c344c'}},
  {id:'v-reel',name:'Product reel',col:'Your own video',hint:'A product video playing behind the card. Yours can show your own product. Tap the speaker to hear it.',bg:{type:'video',url:'/live/samples/bg-laptop.mp4',fit:'band',bg:'#000000'}}];
const sig=engine.scenes.filter(s=>s.col==='Signature'),rest=engine.scenes.filter(s=>s.col!=='Signature'),list=[...sig,...VIDEOS,...rest];
function pick(item,scroll){window.LiveCardView.render(phone,Object.assign({},SAMPLE,{background:item.bg||{type:'scene',id:item.id}}),{engine});hint.textContent=item.hint||'';
  seg.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.id===item.id)));
  if(scroll){const r=phone.getBoundingClientRect();if(r.top<-240||r.bottom>innerHeight+240)phone.scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})}}
for(const it of list){const b=document.createElement('button'),im=document.createElement('img');b.type='button';b.dataset.id=it.id;b.title=it.col;
  im.src='/live/thumbs/'+it.id+'.jpg';im.alt='';im.width=76;im.height=96;im.loading='lazy';im.decoding='async';b.append(im,it.name);b.addEventListener('click',()=>pick(it,true));seg.appendChild(b)}
pick(list.find(x=>x.id===(engine.glOK?'ocean':'sunrise'))||list[0],false);
})();
