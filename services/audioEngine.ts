class AudioEngine {
  private audioCtx: AudioContext | null = null;
  private currentSource: AudioBufferSourceNode | null = null;
  private tagSource: AudioBufferSourceNode | null = null;
  private gainNode: GainNode | null = null;
  
  private mainBuffer: AudioBuffer | null = null;
  private tagBuffer: AudioBuffer | null = null;
  
  private isPlaying: boolean = false;
  private startTime: number = 0;
  private pauseOffset: number = 0;
  private playbackRate: number = 1.0;
  private volume: number = 1.0;
  
  private tagIntervalTimer: NodeJS.Timeout | null = null;
  private tagIntervalSeconds: number = 30;
  private isGhostProtected: boolean = true;

  constructor() {}

  private initContext() {
    if (typeof window === 'undefined') return;

    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioContextClass();
      this.gainNode = this.audioCtx.createGain();
      this.gainNode.connect(this.audioCtx.destination);
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  async loadTrack(url: string, tagUrl?: string) {
    this.initContext();
    if (!this.audioCtx) return;

    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      this.mainBuffer = await this.audioCtx.decodeAudioData(arrayBuffer);

      if (tagUrl && this.isGhostProtected) {
        const tagResponse = await fetch(tagUrl);
        const tagArrayBuffer = await tagResponse.arrayBuffer();
        this.tagBuffer = await this.audioCtx.decodeAudioData(tagArrayBuffer);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des buffers audio:", error);
    }
  }

  play(offset: number = 0, crossfadeDuration: number = 0.5) {
    if (!this.audioCtx || !this.mainBuffer) return;
    this.initContext();
    if (!this.audioCtx) return;

    if (this.isPlaying) {
      this.stop(crossfadeDuration);
    }

    const now = this.audioCtx.currentTime;
    this.currentSource = this.audioCtx.createBufferSource();
    this.currentSource.buffer = this.mainBuffer;
    this.currentSource.playbackRate.value = this.playbackRate;

    const trackGain = this.audioCtx.createGain();
    trackGain.gain.setValueAtTime(0, now);
    trackGain.gain.linearRampToValueAtTime(this.volume, now + crossfadeDuration);

    this.currentSource.connect(trackGain);
    if (this.gainNode) {
      trackGain.connect(this.gainNode);
    }

    this.currentSource.start(0, offset);
    this.startTime = now - offset;
    this.isPlaying = true;
    this.pauseOffset = offset;

    if (this.isGhostProtected && this.tagBuffer) {
      this.startGhostTagInterval();
    }
  }

  pause() {
    if (!this.isPlaying || !this.audioCtx) return;
    this.pauseOffset = this.audioCtx.currentTime - this.startTime;
    this.stop(0.2);
    this.isPlaying = false;
    this.stopGhostTagInterval();
  }

  stop(fadeDuration: number = 0.2) {
    if (!this.currentSource || !this.audioCtx) return;
    try {
      const now = this.audioCtx.currentTime;
      if (this.gainNode) {
        const stopGain = this.audioCtx.createGain();
        stopGain.gain.setValueAtTime(this.volume, now);
        stopGain.gain.linearRampToValueAtTime(0, now + fadeDuration);
      }
      this.currentSource.stop(now + fadeDuration);
      this.currentSource.disconnect();
      this.currentSource = null;
    } catch {
      // Ignorer si déjà arrêté
    }
    this.isPlaying = false;
    this.stopGhostTagInterval();
  }

  seek(positionInSeconds: number) {
    const wasPlaying = this.isPlaying;
    this.stop(0.1);
    this.pauseOffset = positionInSeconds;
    if (wasPlaying) {
      this.play(this.pauseOffset, 0.1);
    }
  }

  setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.gainNode && this.audioCtx) {
      this.gainNode.gain.setValueAtTime(this.volume, this.audioCtx.currentTime);
    }
  }

  setPlaybackRate(rate: number) {
    this.playbackRate = rate;
    if (this.currentSource && this.audioCtx) {
      this.currentSource.playbackRate.setValueAtTime(rate, this.audioCtx.currentTime);
    }
  }

  private startGhostTagInterval() {
    this.stopGhostTagInterval();
    this.tagIntervalTimer = setInterval(() => {
      // Vérification stricte de l'existence du buffer tag pour satisfaire TypeScript
      if (this.isPlaying && this.audioCtx && this.tagBuffer && this.isGhostProtected) {
        try {
          const tagSrc = this.audioCtx.createBufferSource();
          tagSrc.buffer = this.tagBuffer;
          
          const tagGain = this.audioCtx.createGain();
          tagGain.gain.setValueAtTime(0.7, this.audioCtx.currentTime);

          tagSrc.connect(tagGain);
          tagGain.connect(this.audioCtx.destination);
          tagSrc.start(0);
          this.tagSource = tagSrc;
        } catch (err) {
          console.error("Erreur lecture tag fantôme:", err);
        }
      }
    }, this.tagIntervalSeconds * 1000);
  }

  private stopGhostTagInterval() {
    if (this.tagIntervalTimer) {
      clearInterval(this.tagIntervalTimer);
      this.tagIntervalTimer = null;
    }
  }

  disableGhostProtection() {
    this.isGhostProtected = false;
    this.stopGhostTagInterval();
  }

  getIsPlaying() {
    return this.isPlaying;
  }
}

export const audioEngine = new AudioEngine();