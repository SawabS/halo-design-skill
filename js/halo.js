/* =====================================================================
   halo.js — the behaviour layer of Halo. No dependencies.
   Built only on web-platform APIs (all Baseline):
     IntersectionObserver · ResizeObserver · <dialog>.showModal()
     Pointer Events · localStorage · Intl · matchMedia · Vibration API
   Each module is opt-in; Halo.init() wires the common set.
   If your stack already ships a production library for a module, use it
   instead (docs/16-libraries.md has the one-to-one map).
   ===================================================================== */
(function(){
'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const RM=matchMedia('(prefers-reduced-motion: reduce)');
const FINE=matchMedia('(hover: hover) and (pointer: fine)');
const H=window.Halo=window.Halo||{};
H.$=$;H.$$=$$;
H.esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
H.sfx=name=>{try{H.sound&&H.sound.play&&H.sound.play(name)}catch(e){}};   // optional, see halo-sound.js

/* ---------- store: namespaced, never throws (private mode, quota, sandbox) ---------- */
H.store={ns:'halo:',
  get(k,d){try{const v=localStorage.getItem(this.ns+k);return v==null?d:JSON.parse(v)}catch(e){return d}},
  set(k,v){try{localStorage.setItem(this.ns+k,JSON.stringify(v))}catch(e){}},
  del(k){try{localStorage.removeItem(this.ns+k)}catch(e){}}};

/* ---------- i18n: dictionary per language, RTL-aware, Sorani dates ---------- */
const RTL=['ckb','ar','fa','he','ur'];
const SORANI={months:['کانوونی دووەم','شوبات','ئازار','نیسان','ئایار','حوزەیران','تەممووز','ئاب','ئەیلوول','تشرینی یەکەم','تشرینی دووەم','کانوونی یەکەم'],
  days:['یەکشەممە','دووشەممە','سێشەممە','چوارشەممە','پێنجشەممە','هەینی','شەممە']};
H.i18n={dict:{},lang:'en',listeners:[],
  init({dict,lang,fallback='en'}={}){this.dict=dict||{};this.fallback=fallback;
    this.lang=H.store.get('lang',lang||((navigator.language||'').toLowerCase().startsWith('ckb')||(navigator.language||'').toLowerCase().startsWith('ku')?'ckb':fallback));
    this.apply();return this},
  t(k,vars){let s=(this.dict[this.lang]&&this.dict[this.lang][k])??(this.dict[this.fallback]&&this.dict[this.fallback][k])??k;
    if(vars)for(const x in vars)s=s.split('{'+x+'}').join(vars[x]);return s},
  isRTL(){return RTL.includes(this.lang)},
  set(l){this.lang=l;H.store.set('lang',l);this.apply();this.listeners.forEach(f=>f(l))},
  onChange(f){this.listeners.push(f)},
  apply(){const r=document.documentElement;r.lang=this.lang;r.dir=this.isRTL()?'rtl':'ltr';
    $$('[data-i18n]').forEach(e=>e.textContent=this.t(e.dataset.i18n));
    $$('[data-i18n-label]').forEach(e=>e.setAttribute('aria-label',this.t(e.dataset.i18nLabel)))},
  /* Intl has no complete Sorani calendar names, so ckb uses an explicit table */
  date(d,o={weekday:'long',day:'numeric',month:'long'}){
    if(this.lang!=='ckb')return new Intl.DateTimeFormat(this.lang==='en'?'en-GB':this.lang,o).format(d);
    const p=[];if(o.weekday)p.push(SORANI.days[d.getDay()]);const dm=[];if(o.day)dm.push(d.getDate());if(o.month)dm.push(SORANI.months[d.getMonth()]);if(o.year)dm.push(d.getFullYear());
    if(dm.length)p.push(dm.join(' '));return p.join('، ')},
  /* Digits stay Latin (0-9) in Sorani UI by default: readable, matches PDFs, avoids mixed-digit bugs */
  num(n,d=0){return Number(n).toLocaleString('en-US',{maximumFractionDigits:d,minimumFractionDigits:d})}};
H.t=(k,v)=>H.i18n.t(k,v);

/* ---------- theme: OS default, user override persisted ---------- */
H.theme={init(btn){const s=H.store.get('theme',null);if(s==='dark'||s==='light')document.documentElement.dataset.theme=s;this.btn=btn;this.icon();
    btn&&btn.addEventListener('click',()=>this.toggle());return this},
  current(){return document.documentElement.dataset.theme||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')},
  toggle(){const n=this.current()==='dark'?'light':'dark';document.documentElement.dataset.theme=n;H.store.set('theme',n);this.icon();H.sfx('theme')},
  icon(){if(!this.btn)return;const dark=this.current()==='dark';this.btn.innerHTML=dark?H.icons.sun:H.icons.moon;this.btn.setAttribute('aria-label',H.t(dark?'toLight':'toDark'))}};

/* ---------- nav: menu, scroll spy, scrolled state, progress hairline ---------- */
H.nav={init({nav=$('.nav'),btn=$('[data-menu-btn]'),menu=$('.menu'),sections=$$('main section[id]')}={}){
    this.nav=nav;this.btn=btn;this.menu=menu;
    if(btn&&menu){btn.addEventListener('click',()=>this.set(!menu.classList.contains('open')));
      menu.addEventListener('click',e=>{if(e.target.closest('a'))this.set(false)});
      document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.classList.contains('open')){this.set(false);btn.focus()}});
      /* composedPath(): the click target may be an SVG that re-rendered and left the DOM */
      document.addEventListener('click',e=>{if(menu.classList.contains('open')&&!e.composedPath().some(n=>n===menu||n===btn))this.set(false)});
      this.set(false)}
    if(nav&&!$('.scroll-progress',nav)){const p=document.createElement('div');p.className='scroll-progress';p.setAttribute('aria-hidden','true');nav.appendChild(p)}
    const spy=new IntersectionObserver(es=>{for(const e of es)if(e.isIntersecting)$$('.links a,.menu a').forEach(a=>a.setAttribute('aria-current',String(a.getAttribute('href')==='#'+e.target.id)))},{rootMargin:'-45% 0px -50% 0px'});
    sections.forEach(s=>spy.observe(s));
    let tk=false;const frame=()=>{tk=false;const y=scrollY,max=document.documentElement.scrollHeight-innerHeight;
      nav&&nav.classList.toggle('scrolled',y>8);nav&&nav.style.setProperty('--p',max>0?(y/max).toFixed(4):0);H.drift&&H.drift.frame(y)};
    addEventListener('scroll',()=>{if(!tk){tk=true;requestAnimationFrame(frame)}},{passive:true});addEventListener('resize',frame,{passive:true});frame();return this},
  set(open){this.menu.classList.toggle('open',open);this.btn.setAttribute('aria-expanded',String(open));this.btn.innerHTML=open?H.icons.x:H.icons.menu;this.btn.setAttribute('aria-label',H.t(open?'close':'menu'))}};

/* ---------- light: pointer-tracked rim light + gentle tilt (desktop), glint (touch) ----------
   Same idea as Magic UI's MagicCard and vanilla-tilt's glare, in ~20 lines.  */
H.light={init(sel='.card',{tiltMax=5,tiltBelow=520}={}){let lit=null;
    const aim=(c,x,y)=>{const r=c.getBoundingClientRect(),px=x-r.left,py=y-r.top;c.style.setProperty('--mx',px+'px');c.style.setProperty('--my',py+'px');
      if(c.classList.contains('tilt')&&!RM.matches){c.style.setProperty('--ry',((px/r.width-.5)*tiltMax).toFixed(2)+'deg');c.style.setProperty('--rx',(-(py/r.height-.5)*tiltMax).toFixed(2)+'deg')}};
    const off=c=>{if(!c)return;c.classList.remove('lit');c.style.removeProperty('--rx');c.style.removeProperty('--ry')};
    document.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;const c=e.target.closest&&e.target.closest(sel);
      if(c!==lit){off(lit);lit=c;if(c){c.classList.toggle('tilt',c.offsetWidth<tiltBelow);c.classList.add('lit')}}if(c)aim(c,e.clientX,e.clientY)},{passive:true});
    document.addEventListener('pointerleave',()=>{off(lit);lit=null});
    addEventListener('scroll',()=>{if(lit&&!lit.matches(':hover')){off(lit);lit=null}},{passive:true});
    document.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse')return;const c=e.target.closest&&e.target.closest(sel);if(!c)return;
      aim(c,e.clientX,e.clientY);c.classList.add('lit');clearTimeout(c._halo);c._halo=setTimeout(()=>c.classList.remove('lit'),650)},{passive:true});
    return this}};

/* ---------- reveal: fade-rise-unblur on first view, staggered per row ----------
   Call again after re-rendering; anything already on screen appears instantly. */
H.reveal={first:true,init(sel='main h2, main .kicker, main .lede, main .card'){this.sel=sel;return this.refresh()},
  refresh(){if(this.io)this.io.disconnect();if(RM.matches)return this;
    this.io=new IntersectionObserver(es=>{for(const e of es)if(e.isIntersecting){e.target.classList.add('in');this.io.unobserve(e.target)}},{rootMargin:'0px 0px -8% 0px',threshold:.06});
    const vh=innerHeight;
    $$(this.sel).forEach(el=>{if(el.closest('dialog'))return;
      if(!this.first&&el.getBoundingClientRect().top<vh){el.classList.add('rv','in','now');requestAnimationFrame(()=>el.classList.remove('now'));return}
      const sib=el.parentElement?[...el.parentElement.children].filter(n=>n.classList&&n.classList.contains('card')):[];
      el.style.setProperty('--d',Math.min(Math.max(0,sib.indexOf(el)),5)*70+'ms');el.classList.add('rv');this.io.observe(el)});
    this.first=false;return this}};

/* ---------- drift: hero text eases up and fades as the page scrolls past ---------- */
H.drift={el:null,init(el){this.el=el;return this},frame(y){const h=this.el;if(!h||RM.matches||y>900)return;h.style.transform=`translateY(${(y*.12).toFixed(1)}px)`;h.style.opacity=Math.max(.25,1-y/1100).toFixed(3)}};

/* ---------- haptics + swipe (phones) ---------- */
H.haptic=p=>{try{navigator.vibrate&&navigator.vibrate(p)}catch(e){}};      /* Android only; iOS Safari has no Vibration API */
H.swipe=(el,{next,prev,min=60})=>{let sx=0,sy=0,st=0;
  el.addEventListener('touchstart',e=>{const t=e.touches[0];sx=t.clientX;sy=t.clientY;st=Date.now()},{passive:true});
  el.addEventListener('touchend',e=>{const t=e.changedTouches[0],dx=t.clientX-sx,dy=t.clientY-sy;
    if(Date.now()-st>700||Math.abs(dx)<min||Math.abs(dy)>Math.abs(dx)*.6||e.target.closest('input,select,textarea'))return;
    let dir=dx<0?1:-1;if(H.i18n.isRTL())dir=-dir;H.haptic(8);(dir>0?next:prev)&&(dir>0?next:prev)()},{passive:true})};

/* ---------- dialog: native <dialog>; floating layers follow it into the top layer ---------- */
H.dialog={open(d){if(!d.open){try{d.showModal()}catch(e){d.setAttribute('open','')}}const p=$('.pill'),t=$('.toast');p&&d.append(p);t&&d.append(t);document.body.style.overflow='hidden';H.sfx('open')},
  close(d){try{d.close()}catch(e){d.removeAttribute('open')}const p=$('.pill',d),t=$('.toast',d);p&&document.body.append(p);t&&document.body.append(t);document.body.style.overflow='';H.sfx('close')}};
document.addEventListener('click',e=>{const c=e.target.closest('[data-close]');if(c){const d=c.closest('dialog');d&&H.dialog.close(d)}});
document.addEventListener('close',e=>{if(e.target.matches&&e.target.matches('dialog')){document.body.style.overflow=''}},true);

/* ---------- toast with optional undo ---------- */
let tt;H.toast=(msg,{undo,ms}={})=>{let t=$('.toast');if(!t){t=document.createElement('div');t.className='toast';t.setAttribute('role','status');t.hidden=true;document.body.append(t)}
  t.innerHTML=`<span>${H.esc(msg)}</span>${undo?`<button type="button">${H.esc(H.t('undo'))}</button>`:''}`;t.hidden=false;clearTimeout(tt);tt=setTimeout(()=>t.hidden=true,ms||(undo?6000:2800));
  if(undo)$('button',t).onclick=()=>{undo();t.hidden=true}};

/* ---------- timer pill: countdown with ±15 s, pause, skip, ring ---------- */
const fmt=s=>Math.floor(s/60)+':'+String(Math.max(0,s%60)).padStart(2,'0');
H.timer={end:0,dur:90,left:0,paused:false,id:0,last:0,
  start(sec,{label,onEnd}={}){Object.assign(this,{dur:sec,end:Date.now()+sec*1000,paused:false,left:sec,label:label||H.t('rest'),onEnd,last:sec});clearInterval(this.id);this.id=setInterval(()=>this.tick(),250);this.render();this.tick();H.sfx('start')},
  render(){let p=$('.pill');if(!p){p=document.createElement('div');p.className='pill';p.setAttribute('role','timer');document.body.append(p);
      p.addEventListener('click',e=>{const b=e.target.closest('button');b&&this.cmd(b.dataset.t)})}
    p.hidden=false;p.innerHTML=`<svg class="ring" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" stroke-opacity=".2" stroke-width="5"/><circle class="arc" cx="20" cy="20" r="16" fill="none" style="stroke:var(--green)" stroke-width="5" stroke-linecap="round" stroke-dasharray="100.5" transform="rotate(-90 20 20)"/></svg><span class="lbl">${H.esc(this.label)}</span><output aria-live="off" dir="ltr"></output>
      <button type="button" data-t="-15" aria-label="−15 s" dir="ltr">−15</button><button type="button" data-t="15" aria-label="+15 s" dir="ltr">+15</button><button type="button" data-t="pause" aria-label="${H.esc(H.t(this.paused?'resume':'pause'))}">${this.paused?H.icons.play:H.icons.pause}</button><button type="button" data-t="skip">${H.esc(H.t('skip'))}</button>`},
  tick(){if(this.paused)return;this.left=Math.max(0,(this.end-Date.now())/1000);const p=$('.pill');if(!p)return;const c=Math.ceil(this.left);
    $('output',p).textContent=fmt(c);$('.arc',p).setAttribute('stroke-dashoffset',(100.5*(1-this.left/this.dur)).toFixed(1));
    if(c!==this.last){this.last=c;if(c>0&&c<=3)H.sfx('count')}
    if(this.left<=0){clearInterval(this.id);p.hidden=true;H.haptic([120,60,120]);H.sfx('done');this.onEnd&&this.onEnd()}},
  cmd(c){const p=$('.pill');if(c==='skip'){clearInterval(this.id);p.hidden=true;return}
    if(c==='pause'){if(this.paused){this.end=Date.now()+this.left*1000;this.paused=false}else{this.left=Math.max(0,(this.end-Date.now())/1000);this.paused=true}this.render();$('output',$('.pill')).textContent=fmt(Math.ceil(this.left));this.tick();return}
    const d=+c;if(this.paused)this.left=Math.max(1,this.left+d);else this.end=Math.max(Date.now()+1000,this.end+d*1000);
    this.dur=Math.max(this.dur,this.paused?this.left:(this.end-Date.now())/1000);this.tick();if(this.paused)$('output',p).textContent=fmt(Math.ceil(this.left))}};

/* ---------- activity rings (SVG stroke-dasharray) ----------
   specs: [{k:'move',r:100,w:26,c:'red',track:'R',p:.6}] ; c = accent name, track = G|C|R */
let gid=0;
H.rings=(specs,size)=>{const c=size/2;let defs='',o='';
  for(const r of specs){const id='halo-rg'+(++gid),C=2*Math.PI*r.r,p=Math.max(0,Math.min(1,r.p||0));
    defs+=`<linearGradient id="${id}" x1="0" y1="1" x2="1" y2="0"><stop offset="0" style="stop-color:var(--${r.c}2)"/><stop offset="1" style="stop-color:var(--${r.c})"/></linearGradient>`;
    o+=`<circle cx="${c}" cy="${c}" r="${r.r}" fill="none" style="stroke:var(--track${r.track})" stroke-width="${r.w}"/><circle class="arc" data-k="${r.k||''}" cx="${c}" cy="${c}" r="${r.r}" fill="none" stroke="url(#${id})" stroke-width="${r.w}" stroke-linecap="round" stroke-dasharray="${C.toFixed(2)}" stroke-dashoffset="${(C*(1-(p>=.999?.9999:p))).toFixed(2)}" transform="rotate(-90 ${c} ${c})" ${p<=0?'opacity="0"':''}/>`}
  return `<svg class="rings" viewBox="0 0 ${size} ${size}" aria-hidden="true"><defs>${defs}</defs>${o}</svg>`};
H.setRing=(svg,k,p)=>{const a=svg&&svg.querySelector(`.arc[data-k="${k}"]`);if(!a)return;p=Math.max(0,Math.min(1,p));const C=2*Math.PI*a.r.baseVal.value;
  a.setAttribute('opacity',p<=0?'0':'1');a.setAttribute('stroke-dashoffset',(C*(1-(p>=.999?.9999:p))).toFixed(2))};

/* ---------- sparkline: a tiny trend line with a soft area, mirrored in RTL ----------
   Halo.spark([3,5,4,8,7], {accent:'cyan', w:120, h:36})  → SVG string (scales to its box) */
let sid=0;
H.spark=(vals,{accent='cyan',w=120,h=36,area=true,label=''}={})=>{if(!vals||vals.length<2)return'';const R=H.i18n.isRTL(),mn=Math.min(...vals),mx=Math.max(...vals),pad=3;
  const X=i=>{const x=pad+i/(vals.length-1)*(w-2*pad);return R?w-x:x},Y=v=>h-pad-(mx===mn?.5:(v-mn)/(mx-mn))*(h-2*pad);
  const pts=vals.map((v,i)=>X(i).toFixed(1)+','+Y(v).toFixed(1)).join(' '),id='halo-sp'+(++sid),last=vals.length-1;
  return `<svg class="spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" role="img" aria-label="${H.esc(label)}"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--${accent});stop-opacity:.28"/><stop offset="1" style="stop-color:var(--${accent});stop-opacity:0"/></linearGradient></defs>`+
    (area?`<polygon points="${X(0).toFixed(1)},${h} ${pts} ${X(last).toFixed(1)},${h}" fill="url(#${id})"/>`:'')+
    `<polyline points="${pts}" fill="none" style="stroke:var(--${accent})" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/><circle cx="${X(last).toFixed(1)}" cy="${Y(vals[last]).toFixed(1)}" r="2.6" style="fill:var(--${accent})"/></svg>`};

/* ---------- UI icons (Lucide-compatible 24px, 2px stroke) ---------- */
H.icons={
  sun:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/></svg>',
  moon:'<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>',
  menu:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  x:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  play:'<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg>',
  pause:'<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4.5" height="14" rx="1.5"/><rect x="13.5" y="5" width="4.5" height="14" rx="1.5"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  prev:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-flip-rtl><path d="M15 6l-6 6 6 6"/></svg>',
  next:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-flip-rtl><path d="M9 6l6 6-6 6"/></svg>',
  github:'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.4-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"/></svg>',
  sound:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg>',
  mute:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5z"/><path d="M22 9l-6 6M16 9l6 6"/></svg>'};

/* ---------- one-call setup ---------- */
H.init=(o={})=>{H.i18n.init({dict:o.dict,lang:o.lang});H.theme.init($('[data-theme-btn]'));H.nav.init();H.light.init();H.reveal.init(o.reveal);
  const hero=$('[data-drift]');hero&&H.drift.init(hero);
  const lb=$('[data-lang-btn]');lb&&lb.addEventListener('click',()=>{const y=scrollY;H.i18n.set(H.i18n.lang==='en'?(o.altLang||'ckb'):'en');scrollTo(0,y);H.sfx('tap')});
  return H};
})();
