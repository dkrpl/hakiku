/**
 * Musik latar dan suasana petualangan HAKIKU.
 * Semua suara dibuat langsung oleh browser (Web Audio), jadi tidak ada file musik
 * yang perlu diunduh dan tidak ada masalah hak cipta.
 *
 * - Musik "jelajah": tenang dan megah untuk slide Canva (seruling, harpa, gendang lembut).
 * - Musik "tantangan": lebih cepat dan bersemangat saat siswa mengerjakan tantangan.
 * - Suasana: angin sepoi dan kicau burung sesekali.
 * - Efek: halaman berganti, gembok terkunci, pintu terbuka, peta, mulai tantangan, coba lagi, finale.
 */

let ctx = null;
let noiseBuffer = null;

function audioContext() {
  if (typeof window === 'undefined') return null;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;
  if (!ctx) {
    try {
      ctx = new AudioCtx();
    } catch {
      return null;
    }
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

function getNoise(c) {
  if (noiseBuffer) return noiseBuffer;
  const len = c.sampleRate * 2;
  noiseBuffer = c.createBuffer(1, len, c.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < len; i += 1) data[i] = Math.random() * 2 - 1;
  return noiseBuffer;
}

const midi = (n) => 440 * 2 ** ((n - 69) / 12);

// ---------- Bunyi dasar ----------

function tone(c, out, { freq, time, dur, type = 'sine', gain = 0.1, attack = 0.01, glideTo = null, vibrato = 0 }) {
  const osc = c.createOscillator();
  const amp = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, time);
  if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, time + dur);
  if (vibrato) {
    const lfo = c.createOscillator();
    const depth = c.createGain();
    lfo.frequency.value = 5.2;
    depth.gain.value = vibrato;
    lfo.connect(depth);
    depth.connect(osc.frequency);
    lfo.start(time);
    lfo.stop(time + dur + 0.1);
  }
  amp.gain.setValueAtTime(0.0001, time);
  amp.gain.exponentialRampToValueAtTime(gain, time + attack);
  amp.gain.exponentialRampToValueAtTime(0.0001, time + dur);
  osc.connect(amp);
  amp.connect(out);
  osc.start(time);
  osc.stop(time + dur + 0.05);
}

function noise(c, out, { time, dur, gain = 0.05, type = 'highpass', freq = 6000, freqTo = null, q = 0.8 }) {
  const src = c.createBufferSource();
  src.buffer = getNoise(c);
  const filter = c.createBiquadFilter();
  filter.type = type;
  filter.frequency.setValueAtTime(freq, time);
  if (freqTo) filter.frequency.exponentialRampToValueAtTime(freqTo, time + dur);
  filter.Q.value = q;
  const amp = c.createGain();
  amp.gain.setValueAtTime(0.0001, time);
  amp.gain.exponentialRampToValueAtTime(gain, time + Math.min(0.02, dur / 3));
  amp.gain.exponentialRampToValueAtTime(0.0001, time + dur);
  src.connect(filter);
  filter.connect(amp);
  amp.connect(out);
  src.start(time, Math.random());
  src.stop(time + dur + 0.05);
}

// ---------- Lagu ----------

// Akor epik: Dm – Bb – F – C (masing-masing 2 birama, 8 ketukan seperdelapan per birama)
const CHORDS = [
  { bass: 38, pad: [62, 65, 69] },
  { bass: 34, pad: [58, 62, 65] },
  { bass: 41, pad: [60, 65, 69] },
  { bass: 36, pad: [60, 64, 67] },
];
// [langkah, nada, panjang langkah]
const MELODY = [
  [0, 69, 3], [3, 72, 1], [4, 74, 4], [8, 72, 2], [10, 69, 2], [12, 67, 4],
  [16, 65, 3], [19, 67, 1], [20, 69, 4], [24, 65, 2], [26, 62, 6],
  [32, 69, 3], [35, 72, 1], [36, 77, 4], [40, 76, 2], [42, 74, 2], [44, 72, 4],
  [48, 72, 3], [51, 74, 1], [52, 76, 4], [56, 74, 2], [58, 72, 2], [60, 69, 4],
];
const LOOP_STEPS = 64;
const ARP = [0, 1, 2, 1, 0, 2, 1, 2];

const MOODS = {
  explore: { bpm: 92, melody: 0.075, harp: 0.03, pad: 0.018, bass: 0.07, drum: 0.09, shaker: 0.012, snare: 0, melodyEvery: 1 },
  challenge: { bpm: 120, melody: 0.06, harp: 0.035, pad: 0.014, bass: 0.08, drum: 0.11, shaker: 0.016, snare: 0.035, melodyEvery: 2 },
};

class AdventureAudio {
  constructor() {
    this.mood = 'explore';
    this.musicOn = true;
    this.sfxOn = true;
    this.running = false;
    this.timer = null;
    this.birdTimer = null;
    this.step = 0;
    this.loop = 0;
    this.nextTime = 0;
  }

  graph() {
    const c = audioContext();
    if (!c) return null;
    if (!this.master) {
      this.master = c.createDynamicsCompressor();
      this.master.connect(c.destination);
      this.musicGain = c.createGain();
      this.musicGain.gain.value = 0;
      this.musicGain.connect(this.master);
      this.sfxGain = c.createGain();
      this.sfxGain.gain.value = 1;
      this.sfxGain.connect(this.master);
    }
    return c;
  }

  /** Mulai musik latar (harus dipanggil dari ketukan pengguna agar browser mengizinkan suara). */
  start() {
    const c = this.graph();
    if (!c || this.running) return;
    this.running = true;
    this.step = 0;
    this.loop = 0;
    this.nextTime = c.currentTime + 0.15;
    this.timer = setInterval(() => this.tick(), 60);
    this.startAmbience(c);
    this.applyMusicLevel();
  }

  stop() {
    this.running = false;
    clearInterval(this.timer);
    clearTimeout(this.birdTimer);
    this.timer = null;
    try {
      this.wind?.stop();
    } catch {
      // sudah berhenti
    }
    this.wind = null;
    if (this.musicGain && ctx) this.musicGain.gain.setTargetAtTime(0, ctx.currentTime, 0.2);
  }

  setMood(mood) {
    if (MOODS[mood]) this.mood = mood;
  }

  setMusicOn(on) {
    this.musicOn = on;
    this.applyMusicLevel();
  }

  setSfxOn(on) {
    this.sfxOn = on;
  }

  applyMusicLevel() {
    if (!this.musicGain || !ctx) return;
    const target = this.musicOn && this.running ? 1.3 : 0;
    this.musicGain.gain.setTargetAtTime(target, ctx.currentTime, 0.4);
  }

  tick() {
    const c = ctx;
    if (!c || !this.running) return;
    const m = MOODS[this.mood];
    const stepDur = 60 / m.bpm / 2;
    while (this.nextTime < c.currentTime + 0.3) {
      if (this.musicOn) this.scheduleStep(c, this.step, this.nextTime, m, stepDur);
      this.nextTime += stepDur;
      this.step = (this.step + 1) % LOOP_STEPS;
      if (this.step === 0) this.loop += 1;
    }
  }

  scheduleStep(c, step, t, m, stepDur) {
    const out = this.musicGain;
    const bar = Math.floor(step / 8);
    const inBar = step % 8;
    const chord = CHORDS[Math.floor(bar / 2) % CHORDS.length];

    // Pad hangat setiap ganti akor
    if (step % 16 === 0) {
      chord.pad.forEach((n) =>
        tone(c, out, { freq: midi(n), time: t, dur: stepDur * 16, type: 'sine', gain: m.pad, attack: 0.6 })
      );
    }
    // Bas
    if (inBar === 0 || inBar === 4) {
      tone(c, out, { freq: midi(chord.bass), time: t, dur: stepDur * 3.5, type: 'triangle', gain: m.bass, attack: 0.02 });
    }
    // Harpa berpetik
    const harpNote = chord.pad[ARP[inBar]] + 12;
    tone(c, out, { freq: midi(harpNote), time: t, dur: 0.55, type: 'triangle', gain: m.harp, attack: 0.005 });
    // Seruling (melodi), di musik tantangan berselang satu putaran
    if (this.loop % m.melodyEvery === 0) {
      MELODY.filter(([s]) => s === step).forEach(([, n, len]) =>
        tone(c, out, { freq: midi(n), time: t, dur: stepDur * len * 0.95, type: 'sine', gain: m.melody, attack: 0.07, vibrato: 3 })
      );
    }
    // Gendang lembut: dum . . da dum . . .
    if ([0, 3, 4].includes(inBar) || (m.snare && inBar === 7)) {
      tone(c, out, { freq: 140, glideTo: 55, time: t, dur: 0.28, type: 'sine', gain: inBar === 0 ? m.drum : m.drum * 0.7, attack: 0.004 });
    }
    if (m.snare && (inBar === 2 || inBar === 6)) {
      noise(c, out, { time: t, dur: 0.12, gain: m.snare, type: 'bandpass', freq: 1800, q: 0.7 });
    }
    if (inBar % 2 === 1) noise(c, out, { time: t, dur: 0.05, gain: m.shaker, type: 'highpass', freq: 7000 });
  }

  startAmbience(c) {
    // Angin sepoi
    try {
      const src = c.createBufferSource();
      src.buffer = getNoise(c);
      src.loop = true;
      const filter = c.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 420;
      filter.Q.value = 0.6;
      const amp = c.createGain();
      amp.gain.value = 0.012;
      const lfo = c.createOscillator();
      const depth = c.createGain();
      lfo.frequency.value = 0.08;
      depth.gain.value = 0.008;
      lfo.connect(depth);
      depth.connect(amp.gain);
      src.connect(filter);
      filter.connect(amp);
      amp.connect(this.musicGain);
      src.start();
      lfo.start();
      this.wind = src;
    } catch {
      // abaikan
    }
    // Kicau burung sesekali
    const chirp = () => {
      if (!this.running) return;
      if (this.musicOn && this.mood === 'explore' && ctx) {
        const t = ctx.currentTime + 0.05;
        const count = 2 + Math.floor(Math.random() * 3);
        const base = 2400 + Math.random() * 900;
        for (let i = 0; i < count; i += 1) {
          tone(ctx, this.musicGain, { freq: base, glideTo: base * 1.45, time: t + i * 0.13, dur: 0.09, type: 'sine', gain: 0.022, attack: 0.01 });
        }
      }
      this.birdTimer = setTimeout(chirp, 7000 + Math.random() * 9000);
    };
    this.birdTimer = setTimeout(chirp, 4000);
  }

  // ---------- Efek suasana ----------

  sfx(kind) {
    if (!this.sfxOn) return;
    const c = this.graph();
    if (!c) return;
    const out = this.sfxGain;
    const t = c.currentTime + 0.01;
    try {
      switch (kind) {
        case 'page': // halaman berganti (wus)
          noise(c, out, { time: t, dur: 0.38, gain: 0.09, type: 'bandpass', freq: 350, freqTo: 2200, q: 0.9 });
          break;
        case 'locked': // gembok berderak
          [0, 0.09, 0.2].forEach((d) => tone(c, out, { freq: 210, time: t + d, dur: 0.06, type: 'square', gain: 0.05, attack: 0.002 }));
          tone(c, out, { freq: 90, glideTo: 60, time: t + 0.28, dur: 0.25, type: 'sine', gain: 0.12 });
          break;
        case 'door': // pintu berderit lalu lonceng ajaib
          tone(c, out, { freq: 85, glideTo: 150, time: t, dur: 0.7, type: 'sawtooth', gain: 0.025, attack: 0.08 });
          [84, 88, 91, 96].forEach((n, i) => tone(c, out, { freq: midi(n), time: t + 0.55 + i * 0.1, dur: 0.6, type: 'sine', gain: 0.09 }));
          break;
        case 'map': // terompet penjelajah
          [[62, 0, 0.22], [69, 0.2, 0.22], [74, 0.4, 0.55]].forEach(([n, d, len]) =>
            tone(c, out, { freq: midi(n), time: t + d, dur: len, type: 'sawtooth', gain: 0.04, attack: 0.04 })
          );
          break;
        case 'challenge': // tabuhan genderang + terompet
          for (let i = 0; i < 10; i += 1) noise(c, out, { time: t + i * 0.045, dur: 0.05, gain: 0.03 + i * 0.006, type: 'bandpass', freq: 1500 });
          [[67, 0.48, 0.18], [72, 0.64, 0.5]].forEach(([n, d, len]) =>
            tone(c, out, { freq: midi(n), time: t + d, dur: len, type: 'sawtooth', gain: 0.045, attack: 0.03 })
          );
          break;
        case 'retry': // "wa-wa"
          tone(c, out, { freq: 392, glideTo: 330, time: t, dur: 0.3, type: 'triangle', gain: 0.09 });
          tone(c, out, { freq: 330, glideTo: 247, time: t + 0.3, dur: 0.5, type: 'triangle', gain: 0.09 });
          break;
        case 'finale':
          [[72, 0], [76, 0.15], [79, 0.3], [84, 0.45], [79, 0.7], [84, 0.85]].forEach(([n, d]) =>
            tone(c, out, { freq: midi(n), time: t + d, dur: d > 0.8 ? 0.9 : 0.25, type: 'triangle', gain: 0.1 })
          );
          break;
        default:
          break;
      }
    } catch {
      // abaikan kegagalan audio
    }
  }
}

export const adventureAudio = new AdventureAudio();

const MAP_PAGES = [3, 9, 15, 21, 27];
const DOOR_OPEN_PAGES = [8, 14, 20, 26, 32];
const RETRY_PAGES = [34, 35, 36, 37, 38];

/** Efek suara yang cocok untuk slide Canva tujuan. */
export function soundForPage(page) {
  if (page === 33) return 'finale';
  if (MAP_PAGES.includes(page)) return 'map';
  if (DOOR_OPEN_PAGES.includes(page)) return 'door';
  if (RETRY_PAGES.includes(page)) return 'retry';
  return 'page';
}
