class SoundManager {
  private audioContext: AudioContext | null = null;
  private enabled = true;

  constructor() {
    // Only initialize in browser environment
    if (typeof window !== 'undefined') {
      this.initAudioContext();
    }
  }

  private initAudioContext(): void {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  }

  // Create chess.com style move sound - short percussive click
  private createMoveSound(): void {
    if (!this.audioContext || !this.enabled) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      const filterNode = this.audioContext.createBiquadFilter();
      
      oscillator.connect(filterNode);
      filterNode.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      // Sharp, percussive sound similar to chess.com
      oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
      oscillator.type = 'square';
      filterNode.type = 'lowpass';
      filterNode.frequency.setValueAtTime(1200, this.audioContext.currentTime);
      
      const attackTime = 0.002;
      const decayTime = 0.08;
      
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.4, this.audioContext.currentTime + attackTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + decayTime);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + decayTime);
    } catch (error) {
      console.warn('Failed to create move sound:', error);
    }
  }

  // Create chess.com style capture sound - more pronounced with filter sweep
  private createCaptureSound(): void {
    if (!this.audioContext || !this.enabled) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      const filterNode = this.audioContext.createBiquadFilter();
      
      oscillator.connect(filterNode);
      filterNode.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      // More aggressive sound for captures
      oscillator.frequency.setValueAtTime(1000, this.audioContext.currentTime);
      oscillator.type = 'sawtooth';
      filterNode.type = 'lowpass';
      filterNode.frequency.setValueAtTime(2000, this.audioContext.currentTime);
      filterNode.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.15);
      
      const attackTime = 0.001;
      const decayTime = 0.15;
      
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.5, this.audioContext.currentTime + attackTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + decayTime);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + decayTime);
    } catch (error) {
      console.warn('Failed to create capture sound:', error);
    }
  }

  // Create chess.com style check sound - distinctive warning tone
  private createCheckSound(): void {
    if (!this.audioContext || !this.enabled) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      // Higher pitch warning sound
      oscillator.frequency.setValueAtTime(1400, this.audioContext.currentTime);
      oscillator.frequency.linearRampToValueAtTime(1200, this.audioContext.currentTime + 0.1);
      oscillator.type = 'sine';
      
      const attackTime = 0.01;
      const sustainTime = 0.08;
      const decayTime = 0.12;
      
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.4, this.audioContext.currentTime + attackTime);
      gainNode.gain.setValueAtTime(0.4, this.audioContext.currentTime + sustainTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + decayTime);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + decayTime);
    } catch (error) {
      console.warn('Failed to create check sound:', error);
    }
  }

  // Create chess.com style castle sound - distinctive two-part sound
  private createCastleSound(): void {
    if (!this.audioContext || !this.enabled) return;

    try {
      // First part - king move
      setTimeout(() => {
        if (!this.audioContext) return;
        const osc1 = this.audioContext.createOscillator();
        const gain1 = this.audioContext.createGain();
        
        osc1.connect(gain1);
        gain1.connect(this.audioContext.destination);
        
        osc1.frequency.setValueAtTime(600, this.audioContext.currentTime);
        osc1.type = 'square';
        
        gain1.gain.setValueAtTime(0, this.audioContext.currentTime);
        gain1.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.002);
        gain1.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.1);
        
        osc1.start(this.audioContext.currentTime);
        osc1.stop(this.audioContext.currentTime + 0.1);
      }, 0);

      // Second part - rook move
      setTimeout(() => {
        if (!this.audioContext) return;
        const osc2 = this.audioContext.createOscillator();
        const gain2 = this.audioContext.createGain();
        
        osc2.connect(gain2);
        gain2.connect(this.audioContext.destination);
        
        osc2.frequency.setValueAtTime(800, this.audioContext.currentTime);
        osc2.type = 'square';
        
        gain2.gain.setValueAtTime(0, this.audioContext.currentTime);
        gain2.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.002);
        gain2.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.08);
        
        osc2.start(this.audioContext.currentTime);
        osc2.stop(this.audioContext.currentTime + 0.08);
      }, 60);
    } catch (error) {
      console.warn('Failed to create castle sound:', error);
    }
  }

  // Create game end sound sequence
  private createGameEndSound(): void {
    if (!this.audioContext || !this.enabled) return;

    try {
      const frequencies = [523, 659, 784, 1047]; // C5, E5, G5, C6
      
      frequencies.forEach((freq, index) => {
        setTimeout(() => {
          if (!this.audioContext) return;
          const oscillator = this.audioContext.createOscillator();
          const gainNode = this.audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(this.audioContext.destination);
          
          oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
          oscillator.type = 'sine';
          
          gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
          gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.01);
          gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.4);
          
          oscillator.start(this.audioContext.currentTime);
          oscillator.stop(this.audioContext.currentTime + 0.4);
        }, index * 150);
      });
    } catch (error) {
      console.warn('Failed to create game end sound:', error);
    }
  }

  public play(soundName: string, pieceType?: string): void {
    if (!this.enabled || typeof window === 'undefined') return;

    try {
      // Resume audio context if suspended (required by some browsers)
      if (this.audioContext?.state === 'suspended') {
        this.audioContext.resume();
      }

      switch (soundName) {
        case 'move':
          this.createMoveSound();
          break;
        case 'capture':
          this.createCaptureSound();
          break;
        case 'check':
          this.createCheckSound();
          break;
        case 'castle':
          this.createCastleSound();
          break;
        case 'gameEnd':
          this.createGameEndSound();
          break;
        default:
          this.createMoveSound();
      }
    } catch (error) {
      console.warn(`Failed to play sound "${soundName}":`, error);
    }
  }

  public playPiece(pieceType: string): void {
    this.play('move', pieceType);
  }

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }
}

// Export singleton instance
export const soundManager = new SoundManager();