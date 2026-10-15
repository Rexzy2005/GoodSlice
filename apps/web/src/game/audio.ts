import { safeVolume, type SoundCue } from './effects';
/** Original synthesized sounds. Context creation/resume requires an explicit user gesture. */
export function createGameAudio() {
  let context: AudioContext | null = null;
  let master: GainNode | null = null;
  let noise: AudioBuffer | null = null;
  let enabled = false, disposed = false, volume = 0.35;
  const voices = new Set<AudioScheduledSourceNode>();
  const lastPlayed = new Map<SoundCue, number>();
  function stopVoices() { for (const voice of voices) { try { voice.stop(); } catch { /* Already ended. */ } } voices.clear(); }
  function level() { if (master && context) master.gain.setValueAtTime(enabled && !document.hidden ? volume : 0, context.currentTime); }
  async function enable(): Promise<boolean> {
    if (disposed || typeof AudioContext === 'undefined') return false;
    try {
      if (!context) {
        context = new AudioContext(); master = context.createGain();
        const limiter = context.createDynamicsCompressor(); limiter.threshold.value = -12; limiter.ratio.value = 12;
        master.connect(limiter); limiter.connect(context.destination);
        noise = context.createBuffer(1, context.sampleRate, context.sampleRate);
        const data = noise.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      }
      await context.resume();
      if (disposed) return false;
      enabled = context.state === 'running'; level(); return enabled;
    } catch { enabled = false; return false; }
  }
  function voice(frequency: number, end: number, duration: number, delay: number, noisy = false) {
    if (!context || !master || voices.size >= 16) return;
    const start = context.currentTime + delay;
    const gain = context.createGain(); gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(noisy ? 0.22 : 0.16, start + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
    const filter = context.createBiquadFilter(); filter.type = noisy ? 'bandpass' : 'lowpass'; filter.frequency.value = noisy ? frequency : 5000;
    let source: AudioScheduledSourceNode;
    if (noisy && noise) { const buffer = context.createBufferSource(); buffer.buffer = noise; source = buffer; }
    else { const oscillator = context.createOscillator(); oscillator.type = 'triangle'; oscillator.frequency.setValueAtTime(frequency, start); oscillator.frequency.exponentialRampToValueAtTime(Math.max(25, end), start + duration); source = oscillator; }
    source.connect(filter); filter.connect(gain); gain.connect(master); voices.add(source);
    source.onended = () => { voices.delete(source); source.disconnect(); filter.disconnect(); gain.disconnect(); };
    source.start(start); source.stop(start + duration + 0.02);
  }
  function play(cue: SoundCue) {
    if (!enabled || disposed || !context || context.state !== 'running' || document.hidden) return;
    const now = context.currentTime;
    if (now - (lastPlayed.get(cue) ?? -1) < (cue === 'swipe' ? 0.12 : 0.045)) return;
    lastPlayed.set(cue, now);
    switch (cue) {
      case 'click': voice(700, 400, 0.055, 0); break;
      case 'swipe': voice(3500, 900, 0.12, 0, true); break;
      case 'cut': voice(1800, 140, 0.085, 0); voice(2600, 500, 0.09, 0, true); break;
      case 'splash': voice(650, 90, 0.18, 0, true); voice(230, 70, 0.1, 0.01); break;
      case 'boom': voice(110, 28, 0.48, 0); voice(190, 60, 0.4, 0, true); break;
      case 'fail': voice(330, 220, 0.18, 0); voice(220, 90, 0.3, 0.16); break;
      case 'success': [523, 659, 784].forEach((note, i) => voice(note, note, 0.23, i * 0.09)); break;
      case 'combo': [660, 880, 1320].forEach((note, i) => voice(note, note * 1.1, 0.15, i * 0.055)); break;
    }
  }
  function visibility() { if (document.hidden) { stopVoices(); level(); } else level(); }
  document.addEventListener('visibilitychange', visibility);
  return {
    enable, play,
    mute() { enabled = false; stopVoices(); level(); },
    setVolume(value: number) { volume = safeVolume(value); level(); },
    stop: stopVoices,
    dispose() { disposed = true; enabled = false; stopVoices(); document.removeEventListener('visibilitychange', visibility); if (context) void context.close().catch(() => {}); context = null; master = null; noise = null; },
  };
}
export type GameAudio = ReturnType<typeof createGameAudio>;
