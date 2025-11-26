/**
 * Unified Audio Manager
 * Single source of truth for audio playback and analysis
 * Creates ONE audio stream that is analyzed for visualization
 */

export class AudioManager {
  private audioContext: AudioContext | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private source: MediaElementAudioSourceNode | null = null;
  private analyser: AnalyserNode | null = null;
  private gainNode: GainNode | null = null;
  private isInitialized: boolean = false;
  private currentUrl: string | null = null;

  /**
   * Initialize the audio manager with an audio URL
   * Creates the audio graph: audioElement -> source -> analyser -> gain -> destination
   */
  async initialize(url: string): Promise<void> {
    // Cleanup existing instance if any
    this.cleanup();

    this.currentUrl = url;

    try {
      // Create AudioContext
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

      // Resume audio context if suspended (required by some browsers)
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      // Create audio element
      this.audioElement = document.createElement('audio');
      this.audioElement.src = url;
      this.audioElement.crossOrigin = 'anonymous';
      this.audioElement.preload = 'auto';

      // Wait for audio to be ready
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Audio load timeout'));
        }, 10000);

        this.audioElement!.addEventListener(
          'canplaythrough',
          () => {
            clearTimeout(timeout);
            resolve();
          },
          { once: true }
        );

        this.audioElement!.addEventListener(
          'error',
          (e) => {
            clearTimeout(timeout);
            reject(e);
          },
          { once: true }
        );

        this.audioElement!.load();
      });

      // Create analyser node
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 512;
      this.analyser.smoothingTimeConstant = 0.3;
      this.analyser.minDecibels = -90;
      this.analyser.maxDecibels = -10;

      // Create gain node for volume control
      this.gainNode = this.audioContext.createGain();
      this.gainNode.gain.value = 1.0;

      // Create source from audio element
      this.source = this.audioContext.createMediaElementSource(this.audioElement);

      // Connect audio graph: source -> analyser -> gain -> destination
      this.source.connect(this.analyser);
      this.analyser.connect(this.gainNode);
      this.gainNode.connect(this.audioContext.destination);

      this.isInitialized = true;
    } catch (error) {
      console.error('❌ Failed to initialize AudioManager:', error);
      this.cleanup();
      throw error;
    }
  }

  /**
   * Get the analyser node for visualization
   */
  getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  /**
   * Get the audio element (for WaveSurfer if needed)
   */
  getAudioElement(): HTMLAudioElement | null {
    return this.audioElement;
  }

  /**
   * Get the audio context
   */
  getAudioContext(): AudioContext | null {
    return this.audioContext;
  }

  /**
   * Play the audio
   */
  async play(): Promise<void> {
    if (!this.audioElement) {
      throw new Error('AudioManager not initialized');
    }
    await this.audioElement.play();
  }

  /**
   * Pause the audio
   */
  pause(): void {
    if (!this.audioElement) {
      return;
    }
    this.audioElement.pause();
  }

  /**
   * Check if audio is playing
   */
  isPlaying(): boolean {
    return this.audioElement ? !this.audioElement.paused : false;
  }

  /**
   * Get current time
   */
  getCurrentTime(): number {
    return this.audioElement ? this.audioElement.currentTime : 0;
  }

  /**
   * Get duration
   */
  getDuration(): number {
    return this.audioElement && this.audioElement.duration
      ? this.audioElement.duration
      : 0;
  }

  /**
   * Seek to a specific time
   */
  seekTo(time: number): void {
    if (!this.audioElement) {
      return;
    }
    this.audioElement.currentTime = time;
  }

  /**
   * Seek to a progress (0-1)
   */
  seekToProgress(progress: number): void {
    if (!this.audioElement || !this.audioElement.duration) {
      return;
    }
    this.audioElement.currentTime = progress * this.audioElement.duration;
  }

  /**
   * Set volume (0-1)
   */
  setVolume(volume: number): void {
    if (!this.gainNode) {
      return;
    }
    this.gainNode.gain.value = Math.max(0, Math.min(1, volume));
  }

  /**
   * Get volume (0-1)
   */
  getVolume(): number {
    return this.gainNode ? this.gainNode.gain.value : 1.0;
  }

  /**
   * Add event listener to audio element
   */
  addEventListener(
    event: string,
    handler: EventListener,
    options?: boolean | AddEventListenerOptions
  ): void {
    if (!this.audioElement) {
      return;
    }
    this.audioElement.addEventListener(event, handler, options);
  }

  /**
   * Remove event listener from audio element
   */
  removeEventListener(
    event: string,
    handler: EventListener,
    options?: boolean | EventListenerOptions
  ): void {
    if (!this.audioElement) {
      return;
    }
    this.audioElement.removeEventListener(event, handler, options);
  }

  /**
   * Check if initialized
   */
  getInitialized(): boolean {
    return this.isInitialized;
  }

  /**
   * Get current URL
   */
  getCurrentUrl(): string | null {
    return this.currentUrl;
  }

  /**
   * Cleanup resources
   */
  cleanup(): void {
    // Remove event listeners and pause
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.src = '';
      this.audioElement.load();
      // Remove from DOM if it was added
      if (this.audioElement.parentNode) {
        this.audioElement.parentNode.removeChild(this.audioElement);
      }
      this.audioElement = null;
    }

    // Disconnect audio nodes
    if (this.source) {
      try {
        this.source.disconnect();
      } catch (e) {
        // Ignore errors during cleanup
      }
      this.source = null;
    }

    if (this.analyser) {
      try {
        this.analyser.disconnect();
      } catch (e) {
        // Ignore errors during cleanup
      }
      this.analyser = null;
    }

    if (this.gainNode) {
      try {
        this.gainNode.disconnect();
      } catch (e) {
        // Ignore errors during cleanup
      }
      this.gainNode = null;
    }

    // Close audio context if we created it
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close().catch(console.error);
    }
    this.audioContext = null;

    this.isInitialized = false;
    this.currentUrl = null;
  }
}

