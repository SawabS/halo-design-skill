# 14 · Sound

Halo sound is calm, nostalgic and sparse: music-box notes, singing-bowl chimes, water drops and a soft breathing pad. It should make a timer ending feel like a small reward and make a guided session feel like stepping out of the room. It must never feel like a game.

`js/halo-sound.js` synthesises every sound live with the [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API). There are no files, nothing to license, and nothing to download.

## The palette
Everything is tuned to **D major pentatonic** (D E F♯ A B), so any two sounds that overlap are consonant.

| Name | When | Sound |
|---|---|---|
| `tap` | filter, language, small toggles | a very short, quiet high sine |
| `on` | ticking an item | a music-box note; each tick climbs one step of the scale, so finishing a list *plays a melody* |
| `off` | unticking | a lower, softer music-box note |
| `up` / `down` | +/− steppers | water drop, high or low |
| `theme` | theme toggle | two airy high notes |
| `open` / `close` | sheets | a filtered-noise breath that rises or falls |
| `start` | a timer starts | one soft note |
| `count` | last 3 seconds of a timer | a water drop each second |
| `done` | timer ends | a three-note music-box phrase, then a singing bowl (6 s tail) |
| `chime` | next segment of a guided routine | a short bowl |
| `complete` | routine or session finished | a seven-note music-box melody and a long bowl |
| `calmOn` / `calmOff` | a guided breathing or stretch session plays or stops | an ambient bed: a D drone with a slow 10 s breathing swell, fading in over 3 s and out over 1.5 s |

## Voices
- **Music box:** a sine fundamental, a ×3.01 partial at 12 % and a ×4.2 "tine" partial at 6 %, a 6 ms attack, a 1.9 s exponential decay, and ±4 cents of random detune per note (a tape-like wobble, which is where the nostalgia comes from).
- **Singing bowl:** four inharmonic partials (×1, ×2.71, ×5.33, ×8.74), each a ±3 cent detuned pair panned left and right. The slow beating between each pair is the bowl's shimmer.
- **Reverb:** a convolution reverb built from 3.4 s of decaying stereo noise (the same technique as `Tone.Reverb`), 42 % wet.
- **Master:** gain 0.8 into a gentle compressor (−20 dB threshold, 3 : 1). Every voice peaks well below −12 dBFS.

## Rules
- **Opt-out, visible:** a sound toggle is always reachable (in the nav on desktop and in the menu on phones), and its state persists.
- Browsers only start audio after a user gesture; Halo unlocks on the first `pointerdown` or `keydown`.
- Suspend the audio context when the tab is hidden.
- Sound is never the only signal (toast, haptic, visual state).
- Keep to this palette. Don't add new sounds per feature; reuse a name from the table.
- Respect the device: there is no way to read the iOS silent switch from the web, so keep volumes low enough to be polite.

## Library route
If the product already uses [Tone.js](https://tonejs.github.io) (MIT), the voices map directly:
```js
const verb = new Tone.Reverb({ decay: 3.4, wet: .42 }).toDestination();
const box  = new Tone.PolySynth(Tone.Synth, { oscillator:{type:'sine'}, envelope:{attack:.006, decay:1.9, sustain:0, release:.4} }).connect(verb);
box.triggerAttackRelease(['A4','B4','D5'], '8n', Tone.now(), .3);
```
Call `await Tone.start()` from a click first. For recorded UI sound sets, use CC0 packs (for example Kenney's interface sounds) and keep the pentatonic rule by choosing samples in D.
