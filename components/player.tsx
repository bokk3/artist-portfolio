"use client";

import { useEffect, useRef, useState } from "react";
import { usePlayer } from "@/context/player-context";
import WaveSurfer from "wavesurfer.js";
import {
  isMediaSessionSupported,
  updateMediaSessionMetadata,
  updateMediaSessionPlaybackState,
  updateMediaSessionPosition,
} from "@/lib/media-session";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Maximize2,
  ChevronDown,
  ListMusic,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerClose,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import { QueueInterface } from "@/components/queue-interface";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AudioVisualizer, BeatReactiveBackground } from "@/components/audio-visualizer";
import { AudioManager } from "@/lib/audio-manager";

export function Player() {
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    volume,
    setVolume,
    playNext,
    playPrev,
    playlist,
  } = usePlayer();
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const audioManagerRef = useRef<AudioManager | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showQueue, setShowQueue] = useState(false);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);

  // Initialize AudioManager and WaveSurfer
  useEffect(() => {
    if (!waveformRef.current || !currentTrack) {
      // Cleanup if no track
      if (audioManagerRef.current) {
        audioManagerRef.current.cleanup();
        audioManagerRef.current = null;
      }
      if (wavesurfer.current) {
        wavesurfer.current.pause();
        wavesurfer.current.destroy();
        wavesurfer.current = null;
      }
      return;
    }

    let isMounted = true;

    const initializeAudio = async () => {
      // Step 1: Initialize AudioManager (creates single audio stream)
      const audioManager = new AudioManager();
      audioManagerRef.current = audioManager;

      try {
        await audioManager.initialize(currentTrack.audioUrl);
        if (!isMounted) return;

        // Set analyser for visualizer
        const analyserNode = audioManager.getAnalyser();
        if (analyserNode) {
          setAnalyser(analyserNode);
        }

        // Handle audio finish event
        audioManager.addEventListener("ended", () => {
          playNext();
        });

        // Step 2: Initialize WaveSurfer for waveform visualization only
        // WaveSurfer will create its own audio element (muted) for waveform sync
        if (!waveformRef.current) return;
        
        if (wavesurfer.current) {
          wavesurfer.current.pause();
          wavesurfer.current.destroy();
          wavesurfer.current = null;
        }

        wavesurfer.current = WaveSurfer.create({
          container: waveformRef.current,
          waveColor: "#1e293b",
          progressColor: "#ff10f0",
          cursorColor: "#00d9ff",
          barWidth: 2,
          barGap: 3,
          height: 40,
          barRadius: 3,
          normalize: true,
          url: currentTrack.audioUrl,
          backend: "WebAudio",
          mediaControls: false,
        });

        // Sync WaveSurfer with AudioManager playback
        const syncWaveSurfer = () => {
          if (!wavesurfer.current || !audioManager) return;
          const currentTime = audioManager.getCurrentTime();
          const duration = audioManager.getDuration();
          if (duration > 0) {
            wavesurfer.current.seekTo(currentTime / duration);
          }
        };

        // Update WaveSurfer progress from AudioManager
        const progressInterval = setInterval(() => {
          if (audioManager.isPlaying()) {
            syncWaveSurfer();
            setCurrentTime(audioManager.getCurrentTime());
          }
        }, 100);

        wavesurfer.current.on("ready", () => {
          if (!isMounted) return;
          const wsDuration = wavesurfer.current?.getDuration() || 0;
          const amDuration = audioManager.getDuration();
          setDuration(amDuration || wsDuration);
          
          // Mute WaveSurfer's audio element (we use AudioManager for playback)
          try {
            const wsAudio = wavesurfer.current?.getMediaElement();
            if (wsAudio instanceof HTMLAudioElement) {
              wsAudio.volume = 0;
            }
          } catch (e) {
            // Ignore
          }

          if (isPlaying) {
            audioManager.play();
          }
        });

        // Handle waveform interaction (click/drag to seek)
        wavesurfer.current.on("interaction", (progress: number) => {
          if (!audioManager) return;
          const duration = audioManager.getDuration();
          if (duration > 0) {
            audioManager.seekTo(progress * duration);
          }
        });

        return () => {
          clearInterval(progressInterval);
        };
      } catch (error) {
        console.error("❌ Failed to initialize audio:", error);
      }
    };

    initializeAudio();

    return () => {
      isMounted = false;
      setAnalyser(null);
      if (audioManagerRef.current) {
        audioManagerRef.current.cleanup();
        audioManagerRef.current = null;
      }
      if (wavesurfer.current) {
        wavesurfer.current.pause();
        wavesurfer.current.destroy();
        wavesurfer.current = null;
      }
    };
  }, [currentTrack, playNext]);

  // Handle Play/Pause with AudioManager
  useEffect(() => {
    if (!audioManagerRef.current) return;
    
    if (isPlaying) {
      audioManagerRef.current.play().catch(console.error);
      // Sync WaveSurfer visualization
      if (wavesurfer.current) {
        const currentTime = audioManagerRef.current.getCurrentTime();
        const duration = audioManagerRef.current.getDuration();
        if (duration > 0) {
          wavesurfer.current.seekTo(currentTime / duration);
        }
      }
    } else {
      audioManagerRef.current.pause();
    }
  }, [isPlaying]);

  // Handle Volume with AudioManager
  useEffect(() => {
    if (audioManagerRef.current) {
      audioManagerRef.current.setVolume(volume);
    }
  }, [volume]);

  // Update current time from AudioManager
  useEffect(() => {
    if (!audioManagerRef.current || !isPlaying) return;

    const interval = setInterval(() => {
      if (audioManagerRef.current) {
        setCurrentTime(audioManagerRef.current.getCurrentTime());
        setDuration(audioManagerRef.current.getDuration());
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Media Session API for background playback (mobile)
  useEffect(() => {
    if (!currentTrack || !isMediaSessionSupported()) {
      return;
    }

    const mediaSession = (navigator as any).mediaSession;
    if (!mediaSession) return;

    // Set metadata for lock screen/notification
    updateMediaSessionMetadata(
      currentTrack.title,
      currentTrack.artist,
      currentTrack.coverImageUrl
    );

    // Handle play action from lock screen/notification
    if (mediaSession.setActionHandler) {
      mediaSession.setActionHandler("play", () => {
        console.log("Media Session: Play");
        togglePlay();
      });

      // Handle pause action
      mediaSession.setActionHandler("pause", () => {
        console.log("Media Session: Pause");
        togglePlay();
      });

      // Handle next track
      mediaSession.setActionHandler("nexttrack", () => {
        console.log("Media Session: Next");
        playNext();
      });

      // Handle previous track
      mediaSession.setActionHandler("previoustrack", () => {
        console.log("Media Session: Previous");
        playPrev();
      });

      // Handle seek backward (optional)
      mediaSession.setActionHandler("seekbackward", (details: any) => {
        console.log("Media Session: Seek backward", details);
        if (audioManagerRef.current && details) {
          const newTime = Math.max(0, audioManagerRef.current.getCurrentTime() - (details.seekOffset || 10));
          audioManagerRef.current.seekTo(newTime);
          if (wavesurfer.current && duration > 0) {
            wavesurfer.current.seekTo(newTime / duration);
          }
        }
      });

      // Handle seek forward (optional)
      mediaSession.setActionHandler("seekforward", (details: any) => {
        console.log("Media Session: Seek forward", details);
        if (audioManagerRef.current && details) {
          const newTime = Math.min(duration, audioManagerRef.current.getCurrentTime() + (details.seekOffset || 10));
          audioManagerRef.current.seekTo(newTime);
          if (wavesurfer.current && duration > 0) {
            wavesurfer.current.seekTo(newTime / duration);
          }
        }
      });
    }

    // Update playback state
    updateMediaSessionPlaybackState(isPlaying);

    // Update position state (for lock screen progress)
    const updatePositionState = () => {
      if (audioManagerRef.current && duration > 0 && isFinite(duration) && isFinite(currentTime)) {
        // Ensure currentTime is within valid bounds
        const validCurrentTime = Math.max(0, Math.min(currentTime, duration));
        updateMediaSessionPosition(duration, validCurrentTime);
      }
    };

    // Update position state periodically
    const positionInterval = setInterval(updatePositionState, 1000);
    updatePositionState();

    return () => {
      clearInterval(positionInterval);
      // Clear action handlers
      if (mediaSession.setActionHandler) {
        mediaSession.setActionHandler("play", null);
        mediaSession.setActionHandler("pause", null);
        mediaSession.setActionHandler("nexttrack", null);
        mediaSession.setActionHandler("previoustrack", null);
        mediaSession.setActionHandler("seekbackward", null);
        mediaSession.setActionHandler("seekforward", null);
      }
    };
  }, [currentTrack, isPlaying, currentTime, duration, togglePlay, playNext, playPrev]);

  if (!currentTrack) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <>
      {/* Audio Visualizer - Background Effects */}
      <BeatReactiveBackground
        analyser={analyser}
        isPlaying={isPlaying && !!currentTrack}
      />
      <AudioVisualizer
        analyser={analyser}
        isPlaying={isPlaying && !!currentTrack}
      />

      {/* Desktop / Persistent Player */}
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-background/80 backdrop-blur-xl border-t border-border/10 z-50 flex items-center px-4 gap-4">
        {/* Track Info */}
        <div className="flex items-center gap-3 w-1/4 min-w-[200px]">
          <div className="h-12 w-12 relative rounded-md overflow-hidden bg-muted">
            {currentTrack.coverImageUrl && (
              <Image
                src={currentTrack.coverImageUrl}
                alt={currentTrack.title}
                fill
                className="object-cover"
              />
            )}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-sm font-bold truncate">{currentTrack.title}</h4>
            <p className="text-xs text-muted-foreground truncate">
              {currentTrack.artist}
            </p>
          </div>
        </div>

        {/* Controls & Waveform */}
        <div className="flex-1 flex flex-col items-center justify-center gap-1">
          <div className="flex items-center gap-4 md:gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={playPrev}
              className="h-12 w-12 md:h-8 md:w-8 text-muted-foreground hover:text-primary touch-manipulation"
            >
              <SkipBack className="h-6 w-6 md:h-4 md:w-4" />
            </Button>
            <Button
              size="icon"
              onClick={togglePlay}
              className="h-14 w-14 md:h-10 md:w-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(255,16,240,0.5)] touch-manipulation"
            >
              {isPlaying ? (
                <Pause className="h-7 w-7 md:h-5 md:w-5" />
              ) : (
                <Play className="h-7 w-7 md:h-5 md:w-5 ml-1" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={playNext}
              className="h-12 w-12 md:h-8 md:w-8 text-muted-foreground hover:text-primary touch-manipulation"
            >
              <SkipForward className="h-6 w-6 md:h-4 md:w-4" />
            </Button>
          </div>
          <div className="w-full flex items-center gap-2 text-xs text-muted-foreground font-mono">
            <span>{formatTime(currentTime)}</span>
            <div
              ref={waveformRef}
              className="flex-1 h-10 cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
            />
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume & Queue & Mobile Expand */}
        <div className="w-1/4 flex items-center justify-end gap-4">
          <div className="hidden md:flex items-center gap-2 w-32">
            <Volume2 className="h-4 w-4 text-muted-foreground" />
            <Slider
              value={[volume]}
              max={1}
              step={0.01}
              onValueChange={(val: number[]) => setVolume(val[0])}
              className="cursor-pointer"
            />
          </div>

          {/* Desktop Queue Button */}
          {playlist.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowQueue(!showQueue)}
              className="hidden md:flex relative"
            >
              <ListMusic className="h-5 w-5" />
              {playlist.length > 1 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">
                  {playlist.length}
                </span>
              )}
            </Button>
          )}

          {/* Mobile Drawer Trigger */}
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Maximize2 className="h-5 w-5" />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="h-[90vh] bg-background/95 backdrop-blur-xl border-t border-border/10">
              <DrawerHeader className="text-left">
                <DrawerTitle className="sr-only">Now Playing</DrawerTitle>
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-1 bg-muted rounded-full" />
                </div>
              </DrawerHeader>
              <Tabs defaultValue="now-playing" className="flex-1 flex flex-col h-full">
                <TabsList className="mx-4 mb-2">
                  <TabsTrigger value="now-playing">Now Playing</TabsTrigger>
                  <TabsTrigger value="queue" className="relative">
                    Queue
                    {playlist.length > 1 && (
                      <span className="ml-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">
                        {playlist.length}
                      </span>
                    )}
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="now-playing" className="flex-1 overflow-hidden">
                  <div className="p-6 flex flex-col h-full overflow-y-auto">
                    <div className="w-full aspect-square relative rounded-xl overflow-hidden shadow-2xl mb-8 bg-muted">
                      {currentTrack.coverImageUrl && (
                        <Image
                          src={currentTrack.coverImageUrl}
                          alt={currentTrack.title}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>

                    <div className="mb-8">
                      <h2 className="text-3xl font-display font-bold mb-2">
                        {currentTrack.title}
                      </h2>
                      <p className="text-xl text-muted-foreground">
                        {currentTrack.artist}
                      </p>
                    </div>

                    {/* Mobile Waveform Placeholder */}
                    <div className="w-full h-1 bg-muted rounded-full mb-2 relative">
                      <div
                        className="absolute top-0 left-0 h-full bg-primary rounded-full"
                        style={{ width: `${(currentTime / duration) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground font-mono mb-8">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>

                    <div className="flex items-center justify-between mb-8">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={playPrev}
                        className="h-12 w-12"
                      >
                        <SkipBack className="h-8 w-8" />
                      </Button>
                      <Button
                        size="icon"
                        onClick={togglePlay}
                        className="h-20 w-20 rounded-full bg-primary text-primary-foreground shadow-[0_0_30px_rgba(255,16,240,0.4)]"
                      >
                        {isPlaying ? (
                          <Pause className="h-10 w-10" />
                        ) : (
                          <Play className="h-10 w-10 ml-1" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={playNext}
                        className="h-12 w-12"
                      >
                        <SkipForward className="h-8 w-8" />
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="queue" className="flex-1 overflow-hidden">
                  <div className="h-full">
                    <QueueInterface />
                  </div>
                </TabsContent>
              </Tabs>
            </DrawerContent>
          </Drawer>
        </div>
      </div>

      {/* Desktop Queue Sidebar */}
      {showQueue && playlist.length > 0 && (
        <div className="hidden md:block fixed bottom-20 right-4 w-80 h-[calc(100vh-8rem)] bg-background/95 backdrop-blur-xl border border-border/10 rounded-lg shadow-2xl z-40">
          <QueueInterface />
        </div>
      )}
    </>
  );
}
