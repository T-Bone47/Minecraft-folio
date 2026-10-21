// Procedural Web Audio API Sound Generator for Asish Oliver M Engineering World
// Completely autonomous with 0 external sound files, 0 network dependencies, and browser autoplay safety.

class WorldSoundManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private windGain: GainNode | null = null;
  private engineGain: GainNode | null = null;
  private serverGain: GainNode | null = null;
  private isMuted: boolean = true;
  private isInitialized: boolean = false;

  constructor() {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("asish_world_audio_enabled");
      this.isMuted = saved !== "true";
    }
  }

  public init(): void {
    if (this.isInitialized || typeof window === "undefined") return;

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.45, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // 1. Procedural Ambient Wind (Pink Noise Generator)
      this.setupWindAmbience();

      // 2. Distant Circuit Engine Rumble (Low Frequency Filtered Oscillator)
      this.setupEngineRumble();

      // 3. Technical Electronics / Server Lab Hum
      this.setupServerHum();

      this.isInitialized = true;
    } catch {
      // Graceful fallback on audio context restriction
    }
  }

  private setupWindAmbience(): void {
    if (!this.ctx || !this.masterGain) return;

    // Generate 2 seconds of pink noise buffer
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      output[i] = (b0 + b1 + b2) * 0.12;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Bandpass filter for gentle wind whistle
    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(320, this.ctx.currentTime);
    filter.Q.setValueAtTime(0.8, this.ctx.currentTime);

    this.windGain = this.ctx.createGain();
    this.windGain.gain.setValueAtTime(0.18, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(this.windGain);
    this.windGain.connect(this.masterGain);

    whiteNoise.start(0);
  }

  private setupEngineRumble(): void {
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(38, this.ctx.currentTime); // Low engine idle rumble (38 Hz)

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(110, this.ctx.currentTime);

    this.engineGain = this.ctx.createGain();
    this.engineGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

    osc.connect(filter);
    filter.connect(this.engineGain);
    this.engineGain.connect(this.masterGain);

    osc.start(0);
  }

  private setupServerHum(): void {
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(120, this.ctx.currentTime); // 120Hz power hum

    this.serverGain = this.ctx.createGain();
    this.serverGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

    osc.connect(this.serverGain);
    this.serverGain.connect(this.masterGain);

    osc.start(0);
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (typeof window !== "undefined") {
      localStorage.setItem("asish_world_audio_enabled", muted ? "false" : "true");
    }

    if (!this.isInitialized && !muted) {
      this.init();
    }

    if (this.ctx && this.masterGain) {
      if (this.ctx.state === "suspended" && !muted) {
        this.ctx.resume();
      }
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 0.45, this.ctx.currentTime, 0.05);
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public playClick(): void {
    if (this.isMuted || !this.ctx || !this.masterGain) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(240, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(this.ctx.currentTime);
      osc.stop(this.ctx.currentTime + 0.045);
    } catch {
      // Ignored if audio context is blocked
    }
  }

  public playInspect(): void {
    this.playInspectChime();
  }

  public toggleMute(): boolean {
    const next = !this.isMuted;
    this.setMuted(next);
    return next;
  }

  public playInspectChime(): void {
    if (this.isMuted || !this.ctx || !this.masterGain) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, this.ctx.currentTime); // D5 note
      osc.frequency.setValueAtTime(880.0, this.ctx.currentTime + 0.08); // A5 note

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(this.ctx.currentTime);
      osc.stop(this.ctx.currentTime + 0.26);
    } catch {
      // Ignored
    }
  }

  public playRadioChirp(): void {
    if (this.isMuted || !this.ctx || !this.masterGain) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Dual frequency F1 team radio blip: 1800Hz to 2400Hz
      osc.type = "sine";
      osc.frequency.setValueAtTime(1760, this.ctx.currentTime);
      osc.frequency.setValueAtTime(2349, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(this.ctx.currentTime);
      osc.stop(this.ctx.currentTime + 0.13);
    } catch {
      // Ignored
    }
  }

  public playF1Rev(): void {
    if (this.isMuted || !this.ctx || !this.masterGain) return;

    try {
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // F1 V6 turbo-hybrid upshift rev spool
      osc1.type = "sawtooth";
      osc2.type = "triangle";

      osc1.frequency.setValueAtTime(160, this.ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(540, this.ctx.currentTime + 0.35);

      osc2.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(1080, this.ctx.currentTime + 0.35);

      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.45);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.masterGain);

      osc1.start(this.ctx.currentTime);
      osc2.start(this.ctx.currentTime);
      osc1.stop(this.ctx.currentTime + 0.46);
      osc2.stop(this.ctx.currentTime + 0.46);
    } catch {
      // Ignored
    }
  }

  public playBallKick(): void {
    if (this.isMuted || !this.ctx || !this.masterGain) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Deep leather boot thump: 140Hz rapid pitch drop to 35Hz
      osc.type = "triangle";
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(35, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.45, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(this.ctx.currentTime);
      osc.stop(this.ctx.currentTime + 0.19);
    } catch {
      // Ignored
    }
  }

  public updateSpatialDistance(playerX: number, playerZ: number): void {
    if (this.isMuted || !this.ctx) return;

    // Distant engine louder near circuit pit straight (x: -18 to -10, z: -15 to 15)
    if (this.engineGain) {
      const distToTrack = Math.abs(playerX - -15);
      const engineVol = Math.max(0.02, Math.min(0.22, 0.22 - distToTrack * 0.008));
      this.engineGain.gain.setTargetAtTime(engineVol, this.ctx.currentTime, 0.2);
    }

    // Server hum louder near AI / Simulation labs (x: 0 to 22, z: 8 to 24)
    if (this.serverGain) {
      const distToServer = Math.hypot(playerX - 10, playerZ - 16);
      const serverVol = Math.max(0.01, Math.min(0.12, 0.12 - distToServer * 0.006));
      this.serverGain.gain.setTargetAtTime(serverVol, this.ctx.currentTime, 0.2);
    }
  }

  public dispose(): void {
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
      this.masterGain = null;
      this.isInitialized = false;
    }
  }
}

export const worldSound = new WorldSoundManager();
