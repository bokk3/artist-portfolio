"use client";

import { useEffect, useRef } from "react";
import { AudioAnalyzer } from "@/lib/audio-analyzer";

interface AudioVisualizerProps {
  analyser: AnalyserNode | null;
  isPlaying: boolean;
}

export function AudioVisualizer({
  analyser,
  isPlaying,
}: AudioVisualizerProps) {
  const analyzerRef = useRef<AudioAnalyzer | null>(null);
  const shakeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastBeatTimeRef = useRef<number>(0);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    // No analyser available
    if (!analyser || !isPlaying) {
      if (analyzerRef.current) {
        analyzerRef.current.cleanup();
        analyzerRef.current = null;
      }
      document.body.classList.remove("beat-shake");
      return;
    }

    // Initialize analyzer with the provided analyser node
    const analyzer = new AudioAnalyzer();
    analyzerRef.current = analyzer;

    try {
      analyzer.initialize(analyser);
      
      analyzer.start(
        (intensity) => {
          // Beat detected - apply shake effect to body
          const now = Date.now();
          // Throttle beats to avoid too many rapid shakes (reduced to 30ms for more responsiveness)
          if (now - lastBeatTimeRef.current > 30) {
            lastBeatTimeRef.current = now;
            
            // Very low threshold - trigger on any audio activity
            // With 0.05 threshold and 3.0 multiplier, intensity will be at least 0.15
            if (intensity > 0.05) {
              document.body.classList.add("beat-shake");
              
              // Clear any existing timeout
              if (shakeTimeoutRef.current) {
                clearTimeout(shakeTimeoutRef.current);
              }
              
              // Reset shake after animation (shorter for more responsive feel)
              shakeTimeoutRef.current = setTimeout(() => {
                document.body.classList.remove("beat-shake");
              }, 120);
            }
          }
        }
      );
    } catch (error) {
      console.error("❌ Failed to initialize audio analyzer:", error);
    }

    return () => {
      if (analyzerRef.current) {
        analyzerRef.current.cleanup();
        analyzerRef.current = null;
      }
      if (shakeTimeoutRef.current) {
        clearTimeout(shakeTimeoutRef.current);
      }
      // Clean up body class
      if (typeof document !== "undefined") {
        document.body.classList.remove("beat-shake");
      }
    };
  }, [analyser, isPlaying]);

  return null; // This component doesn't render anything, it just applies effects to body
}

/**
 * Full-screen audio-reactive background visualizer
 */
export function BeatReactiveBackground({
  analyser,
  isPlaying,
}: {
  analyser: AnalyserNode | null;
  isPlaying: boolean;
}) {
  const analyzerRef = useRef<AudioAnalyzer | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!canvasRef.current) {
      if (analyzerRef.current) {
        analyzerRef.current.cleanup();
        analyzerRef.current = null;
      }
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to full screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Clear canvas when not playing (static background)
    if (!isPlaying || !analyser) {
      ctx.fillStyle = "#0a1929"; // Background color
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      if (analyzerRef.current) {
        analyzerRef.current.cleanup();
        analyzerRef.current = null;
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    // Initialize analyzer with the provided analyser node
    const analyzer = new AudioAnalyzer();
    analyzerRef.current = analyzer;

    try {
      analyzer.initialize(analyser);
      
      // Store frequency data for drawing
      let currentFrequencyData: Uint8Array | null = null;
      let hasReceivedData = false;
      
      // Draw function for the visualizer
      const draw = () => {
        if (!ctx || !canvas) {
          animationFrameRef.current = requestAnimationFrame(draw);
          return;
        }
        
        // If we don't have frequency data yet, keep drawing (showing static background)
        if (!currentFrequencyData) {
          animationFrameRef.current = requestAnimationFrame(draw);
          return;
        }
        
        // Mark that we've received data
        if (!hasReceivedData) {
          hasReceivedData = true;
        }
        
        // Clear with minimal fade for more visible effects
        ctx.fillStyle = "rgba(10, 25, 41, 0.3)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw frequency bars across the entire screen
        const barCount = Math.min(currentFrequencyData.length, 128);
        const barWidth = canvas.width / barCount;
        const maxBarHeight = canvas.height;
        
        // Calculate overall energy for background glow
        const avgEnergy = Array.from(currentFrequencyData.slice(0, 32)).reduce((a, b) => a + b, 0) / 32 / 255;
        
        // Draw bars with gradient
        for (let i = 0; i < barCount; i++) {
          const value = currentFrequencyData[i] / 255;
          const boostedValue = Math.min(value * 3.0, 1.0);
          const barHeight = boostedValue * maxBarHeight;
          
          if (barHeight < 2) continue;
          
          // Color gradient: low frequencies (bass) = pink, high = cyan
          const hue = 240 + (i / barCount) * 120;
          const saturation = 90;
          const lightness = 50 + (boostedValue * 30);
          
          const gradient = ctx.createLinearGradient(
            i * barWidth,
            canvas.height - barHeight,
            i * barWidth,
            canvas.height
          );
          
          gradient.addColorStop(0, `hsla(${hue}, ${saturation}%, ${lightness}%, ${0.98})`);
          gradient.addColorStop(0.5, `hsla(${hue}, ${saturation}%, ${lightness}%, ${0.9})`);
          gradient.addColorStop(1, `hsla(${hue}, ${saturation}%, ${lightness}%, 0.7)`);
          
          ctx.fillStyle = gradient;
          ctx.fillRect(
            i * barWidth,
            canvas.height - barHeight,
            Math.max(barWidth - 1, 1),
            barHeight
          );
        }
        
        // Draw center circle that pulses with bass
        const bassIntensity = Math.max(...currentFrequencyData.slice(0, 8)) / 255;
        if (bassIntensity > 0.03) {
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const radius = 100 + (bassIntensity * 400);
          
          const circleGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
          circleGradient.addColorStop(0, `rgba(255, 16, 240, ${Math.min(bassIntensity * 0.8, 0.6)})`);
          circleGradient.addColorStop(0.3, `rgba(255, 16, 240, ${bassIntensity * 0.4})`);
          circleGradient.addColorStop(0.6, `rgba(255, 16, 240, ${bassIntensity * 0.2})`);
          circleGradient.addColorStop(1, "rgba(255, 16, 240, 0)");
          
          ctx.fillStyle = circleGradient;
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Add overall background glow based on energy
        if (avgEnergy > 0.1) {
          const glowGradient = ctx.createRadialGradient(
            canvas.width / 2,
            canvas.height / 2,
            0,
            canvas.width / 2,
            canvas.height / 2,
            Math.max(canvas.width, canvas.height) * 0.8
          );
          glowGradient.addColorStop(0, `rgba(255, 16, 240, ${avgEnergy * 0.1})`);
          glowGradient.addColorStop(1, "rgba(255, 16, 240, 0)");
          
          ctx.fillStyle = glowGradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        animationFrameRef.current = requestAnimationFrame(draw);
      };
      
      // Start the draw loop
      draw();
      
      analyzer.start(
        undefined, // No beat callback needed here, we draw continuously
        (frequencyData) => {
          currentFrequencyData = frequencyData;
        }
      );
    } catch (error) {
      console.error("❌ Failed to initialize audio analyzer:", error);
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      if (analyzerRef.current) {
        analyzerRef.current.cleanup();
        analyzerRef.current = null;
      }
    };
  }, [analyser, isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{
        background: "transparent", // Transparent so we can see the effects
        transition: "opacity 0.3s ease-in-out",
        zIndex: -1, // Behind everything
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
      }}
    />
  );
}

