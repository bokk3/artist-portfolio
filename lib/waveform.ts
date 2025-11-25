import WaveSurfer from "wavesurfer.js";

/**
 * Generate waveform peaks from an audio file
 * @param audioFile - The audio file to generate peaks from
 * @param samples - Number of samples to generate (default: 512)
 * @returns Promise<number[]> - Array of normalized peak values (0-1)
 */
export async function generateWaveformPeaks(
  audioFile: File,
  samples: number = 512
): Promise<number[]> {
  return new Promise((resolve, reject) => {
    // Create a temporary audio context
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const fileReader = new FileReader();

    fileReader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        // Get the audio data
        const channelData = audioBuffer.getChannelData(0); // Use first channel
        const channelLength = channelData.length;
        const blockSize = Math.floor(channelLength / samples);
        const peaks: number[] = [];

        // Calculate peaks for each sample
        for (let i = 0; i < samples; i++) {
          const start = i * blockSize;
          const end = start + blockSize;
          let sum = 0;
          let max = 0;

          for (let j = start; j < end && j < channelLength; j++) {
            const abs = Math.abs(channelData[j]);
            sum += abs;
            max = Math.max(max, abs);
          }

          // Normalize the peak value (0-1)
          const peak = max;
          peaks.push(peak);
        }

        // Normalize all peaks to 0-1 range
        const maxPeak = Math.max(...peaks);
        const normalizedPeaks = maxPeak > 0 
          ? peaks.map(p => p / maxPeak)
          : peaks;

        audioContext.close();
        resolve(normalizedPeaks);
      } catch (error) {
        audioContext.close();
        reject(error);
      }
    };

    fileReader.onerror = () => {
      reject(new Error("Failed to read audio file"));
    };

    fileReader.readAsArrayBuffer(audioFile);
  });
}

/**
 * Generate waveform data using WaveSurfer (alternative method)
 * This is more accurate but requires the audio URL to be accessible
 */
export async function generateWaveformWithWaveSurfer(
  audioUrl: string,
  samples: number = 512
): Promise<number[]> {
  return new Promise((resolve, reject) => {
    // Create a temporary WaveSurfer instance
    const wavesurfer = WaveSurfer.create({
      container: document.createElement("div"),
      waveColor: "#1e293b",
      progressColor: "#ff10f0",
      cursorColor: "#00d9ff",
      barWidth: 2,
      barGap: 3,
      height: 40,
      barRadius: 3,
      normalize: true,
      url: audioUrl,
    });

    wavesurfer.on("ready", () => {
      try {
        const peaks = wavesurfer.getDecodedData();
        if (!peaks) {
          wavesurfer.destroy();
          reject(new Error("Failed to decode audio"));
          return;
        }

        // Get channel data
        const channelData = peaks.getChannelData(0);
        const channelLength = channelData.length;
        const blockSize = Math.floor(channelLength / samples);
        const waveformPeaks: number[] = [];

        // Calculate peaks for each sample
        for (let i = 0; i < samples; i++) {
          const start = i * blockSize;
          const end = start + blockSize;
          let max = 0;

          for (let j = start; j < end && j < channelLength; j++) {
            max = Math.max(max, Math.abs(channelData[j]));
          }

          waveformPeaks.push(max);
        }

        // Normalize to 0-1
        const maxPeak = Math.max(...waveformPeaks);
        const normalizedPeaks = maxPeak > 0 
          ? waveformPeaks.map(p => p / maxPeak)
          : waveformPeaks;

        wavesurfer.destroy();
        resolve(normalizedPeaks);
      } catch (error) {
        wavesurfer.destroy();
        reject(error);
      }
    });

    wavesurfer.on("error", (error) => {
      wavesurfer.destroy();
      reject(error);
    });
  });
}

