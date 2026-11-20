/* =====================================================================
   halo-sound.js — calm, synthesized UI sound. No audio files.
   Native Web Audio API only (AudioContext, OscillatorNode, GainNode,
   BiquadFilterNode, ConvolverNode, StereoPannerNode).
   Character: music-box notes, singing-bowl chimes, water drops, a soft
   breathing pad. Everything sits in one pentatonic key (D major
   pentatonic) so any two sounds that overlap stay consonant.
   For a library-based build use Tone.js (MIT): PolySynth + Reverb map
   one-to-one onto the voices below (docs/14-sound.md).
   Loudness: every voice peaks well under -12 dBFS, through a gentle
   compressor. Sound is OPT-OUT: a visible toggle is mandatory.
   ===================================================================== */
(function(){
'use strict';
const H=window.Halo=window.Halo||{};
const store=H.store||{get:(k,d)=>d,set(){}};
let ac=null,master,verb,amb=null,on=store.get('sound',true);

/* D major pentatonic, D4..D6 */
const SCALE=[293.66,329.63,369.99,440,493.88,587.33,659.25,739.99,880,987.77,1174.66];

function ctx(){
  if(!on)return null;
  if(!ac){const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;
    ac=new C();master=ac.createGain();master.gain.value=.8;
    const comp=ac.createDynamicsCompressor();comp.threshold.value=-20;comp.ratio.value=3;comp.attack.value=.01;comp.release.value=.3;
    master.connect(comp).connect(ac.destination);
    verb=ac.createConvolver();verb.buffer=impulse(3.4,2.8);const wet=ac.createGain();wet.gain.value=.42;verb.connect(wet).connect(master)}
  if(ac.state==='suspended')ac.resume();
  return ac}

/* Reverb impulse: stereo decaying noise (same technique as Tone.Reverb) */
function impulse(sec,decay){const r=ac.sampleRate,n=Math.floor(r*sec),b=ac.createBuffer(2,n,r);
  for(let c=0;c<2;c++){const d=b.getChannelData(c);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/n,decay)}return b}

/* One voice: oscillator → envelope → (pan) → dry + reverb send */
function voice({f,t=0,dur=1.6,vol=.12,type='sine',att=.006,send=.55,detune=0,pan=0,glide=0}){
  const a=ctx();if(!a)return;const t0=a.currentTime+t+.01;
  const o=a.createOscillator();o.type=type;o.frequency.setValueAtTime(f,t0);if(glide)o.frequency.exponentialRampToValueAtTime(f*glide,t0+Math.min(.12,dur));
  o.detune.value=detune;
  const g=a.createGain();g.gain.setValueAtTime(0,t0);g.gain.linearRampToValueAtTime(vol,t0+att);g.gain.exponentialRampToValueAtTime(.0001,t0+dur);
  let out=o.connect(g);if(a.createStereoPanner){const p=a.createStereoPanner();p.pan.value=pan;out=g.connect(p)}
  out.connect(master);const s=a.createGain();s.gain.value=send;out.connect(s).connect(verb);
  o.start(t0);o.stop(t0+dur+.05)}

/* Music-box note: sine fundamental + quiet inharmonic tine partials + tiny tape wobble */
function box(f,t=0,vol=.1,pan=0){const w=(Math.random()-.5)*8;
  voice({f,t,dur:1.9,vol,detune:w,pan});
  voice({f:f*3.01,t,dur:.7,vol:vol*.12,detune:w,pan});
  voice({f:f*4.2,t,dur:.35,vol:vol*.06,pan})}

/* Singing bowl: inharmonic partials, each a slowly beating pair */
function bowl(f=293.66,t=0,vol=.09,len=6){
  [[1,1],[2.71,.45],[5.33,.2],[8.74,.08]].forEach(([r,a],i)=>{
    voice({f:f*r,t,dur:len*(1-i*.18),vol:vol*a,att:.02,detune:-3,send:.7,pan:-.15});
    voice({f:f*r,t,dur:len*(1-i*.18),vol:vol*a*.8,att:.02,detune:+3,send:.7,pan:.15})})}

/* Water drop: fast downward glide, very short */
function drop(t=0,f=1400,vol=.05){voice({f,t,dur:.22,vol,glide:.5,att:.003,send:.6})}

/* Soft air: filtered noise swell for opening/closing sheets */
function air(up=true,vol=.04){const a=ctx();if(!a)return;const n=a.createBufferSource(),len=.6,b=a.createBuffer(1,a.sampleRate*len,a.sampleRate),d=b.getChannelData(0);
  for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;n.buffer=b;
  const f=a.createBiquadFilter();f.type='bandpass';f.Q.value=.8;const t0=a.currentTime;
  f.frequency.setValueAtTime(up?500:1800,t0);f.frequency.exponentialRampToValueAtTime(up?1800:500,t0+len);
  const g=a.createGain();g.gain.setValueAtTime(0,t0);g.gain.linearRampToValueAtTime(vol,t0+len*.4);g.gain.linearRampToValueAtTime(0,t0+len);
  n.connect(f).connect(g).connect(master);n.start(t0);n.stop(t0+len)}

/* Ambient breathing bed for guided sessions: drone in D + slow 10 s breath swell */
function ambient(start){const a=ctx();
  if(!start){if(amb&&a){const t=a.currentTime;amb.g.gain.cancelScheduledValues(t);amb.g.gain.setValueAtTime(amb.g.gain.value,t);amb.g.gain.linearRampToValueAtTime(0,t+1.5);
      const old=amb;setTimeout(()=>{old.nodes.forEach(n=>{try{n.stop()}catch(e){}})},1700);amb=null}return}
  if(!a||amb)return;const t=a.currentTime;
  const g=a.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.055,t+3);
  const lp=a.createBiquadFilter();lp.type='lowpass';lp.frequency.value=900;lp.Q.value=.3;g.connect(lp).connect(master);
  const sv=a.createGain();sv.gain.value=.5;lp.connect(sv).connect(verb);
  const breath=a.createGain();breath.gain.value=.65;breath.connect(g);
  const lfo=a.createOscillator();lfo.frequency.value=.1;const ld=a.createGain();ld.gain.value=.35;lfo.connect(ld).connect(breath.gain);
  const nodes=[lfo];[[146.83,-4],[146.83,4],[220,-2],[293.66,3],[369.99,0]].forEach(([f,dt],i)=>{const o=a.createOscillator();o.type=i<2?'triangle':'sine';o.frequency.value=f;o.detune.value=dt;
    const og=a.createGain();og.gain.value=i<2?.5:.22;o.connect(og).connect(breath);o.start(t);nodes.push(o)});
  lfo.start(t);amb={g,nodes}}

/* ---------- the palette: name → sound ----------
   Keep this list short. Every interaction that gets a sound is listed in docs/14-sound.md. */
let step=0;
const PLAY={
  tap:   ()=>voice({f:SCALE[7],dur:.18,vol:.035,att:.002,send:.3}),
  on:    ()=>{box(SCALE[Math.min(step,SCALE.length-1)],0,.09);step=(step+1)%SCALE.length},   /* ticking items climbs the scale */
  off:   ()=>box(SCALE[0]/2*1.5,0,.05),
  up:    ()=>drop(0,1200,.04),
  down:  ()=>drop(0,800,.035),
  theme: ()=>{box(SCALE[8],0,.05,-.3);box(SCALE[10],.09,.04,.3)},
  open:  ()=>air(true),
  close: ()=>air(false,.03),
  start: ()=>box(SCALE[2],0,.06),
  count: ()=>drop(0,1000,.045),                                            /* last 3 seconds */
  done:  ()=>{box(SCALE[4],0,.08,-.2);box(SCALE[5],.16,.08);box(SCALE[7],.32,.08,.2);bowl(293.66,.45,.08,6)},
  chime: ()=>bowl(392,0,.07,4),                                            /* next segment */
  complete:()=>{[5,6,7,8,7,9,10].forEach((n,i)=>box(SCALE[n],i*.22,.075,(i%2?.25:-.25)));bowl(293.66,1.7,.08,7)},
  calmOn:()=>ambient(true), calmOff:()=>ambient(false)
};

H.sound={
  play(name){if(!on)return;const f=PLAY[name];f&&f()},
  get on(){return on},
  set(v){on=!!v;store.set('sound',on);if(!on){ambient(false)}else{ctx();PLAY.tap()}document.dispatchEvent(new CustomEvent('halo:sound',{detail:on}))},
  toggle(){this.set(!on)},
  resetScale(){step=0},
  names:Object.keys(PLAY)};

/* Browsers only start audio after a user gesture: unlock on the first one */
const unlock=()=>{if(on)ctx();removeEventListener('pointerdown',unlock,true);removeEventListener('keydown',unlock,true)};
addEventListener('pointerdown',unlock,true);addEventListener('keydown',unlock,true);
/* Pause the ambient bed when the tab is hidden */
document.addEventListener('visibilitychange',()=>{if(!ac)return;document.hidden?ac.suspend():(on&&ac.resume())});
})();
