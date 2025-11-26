/**
 * Audio Analyzer for real-time frequency analysis and beat detection
 * Accepts a pre-created AnalyserNode from AudioManager
 */

class AudioAnalyzer {
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array<ArrayBuffer> | null = null;
  private animationFrameId: number | null = null;
  private onBeatDetected: ((intensity: number) => void) | null = null;
  private onFrequencyData: ((data: Uint8Array) => void) | null = null;

  constructor() {
    // Analyzer is initialized with a pre-created analyser node
  }

  /**
   * Initialize the audio analyzer with a pre-created AnalyserNode
   * The analyser should already be connected to the audio graph by AudioManager
   */
  initialize(analyser: AnalyserNode): void {
    if (!analyser || !(analyser instanceof AnalyserNode)) {
      throw new Error('Invalid analyser node provided');
    }

    this.analyser = analyser;
    const bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(bufferLength);
  }

  /**
   * Start analyzing audio and detecting beats
   */
  start(onBeatDetected?: (intensity: number) => void, onFrequencyData?: (data: Uint8Array) => void): void {
    if (!this.analyser || !this.dataArray) return;

    this.onBeatDetected = onBeatDetected || null;
    this.onFrequencyData = onFrequencyData || null;

    const analyze = () => {
      if (!this.analyser || !this.dataArray) return;

      this.analyser.getByteFrequencyData(this.dataArray as Uint8Array<ArrayBuffer>);

      // Call frequency data callback
      if (this.onFrequencyData) {
        this.onFrequencyData(this.dataArray as Uint8Array);
      }

      // Detect beats in low frequency range (kicks/bass)
      // With fftSize 512, we have 256 frequency bins
      // Sample rate typically 44100 Hz, so each bin is ~86 Hz (44100 / 512)
      // Low frequencies (kicks) are typically in bins 0-5 (0-430 Hz)
      // Focus on bins 0-3 for sub-bass and kick (0-258 Hz)
      const kickRange = this.dataArray.slice(0, 8);
      const kickIntensity = Math.max(...kickRange) / 255;
      
      // Also check mid-low frequencies for snare/percussion (bins 6-15)
      const snareRange = this.dataArray.slice(8, 20);
      const snareIntensity = Math.max(...snareRange) / 255;
      
      // Calculate average of low frequencies for better detection
      const kickAvg = kickRange.reduce((a, b) => a + b, 0) / kickRange.length / 255;
      
      // Get overall energy level for normalization
      const totalEnergy = Array.from(this.dataArray as Uint8Array).reduce((a, b) => a + b, 0) / this.dataArray.length / 255;
      
      // Combine kick and snare for overall beat detection
      // Use max of peak and average for more reliable detection
      const overallIntensity = Math.max(
        kickIntensity,
        kickAvg * 1.8, // Boost average to catch sustained bass
        snareIntensity * 0.7,
        totalEnergy * 0.5 // Include overall energy
      );

      // Very low threshold for maximum sensitivity
      // Detect any meaningful audio activity
      if (overallIntensity > 0.05) {
        // Calculate intensity based on how strong the beat is
        // Scale it up for more dramatic effects
        const intensity = Math.min(overallIntensity * 3.0, 1.0);
        if (this.onBeatDetected) {
          this.onBeatDetected(intensity);
        }
      }

      this.animationFrameId = requestAnimationFrame(analyze);
    };

    analyze();
  }

  /**
   * Stop analyzing
   */
  stop(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.onBeatDetected = null;
    this.onFrequencyData = null;
  }

  /**
   * Get current frequency data
   */
  getFrequencyData(): Uint8Array | null {
    if (!this.analyser || !this.dataArray) return null;
    this.analyser.getByteFrequencyData(this.dataArray as Uint8Array<ArrayBuffer>);
    return this.dataArray as Uint8Array<ArrayBuffer>;
  }

  /**
   * Cleanup resources
   * Note: We don't disconnect the analyser here because it's owned by AudioManager
   */
  cleanup(): void {
    this.stop();
    // Don't disconnect analyser - it's managed by AudioManager
    this.analyser = null;
    this.dataArray = null;
  }
}

export { AudioAnalyzer };

