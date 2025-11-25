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

export function Player() {
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    volume,
    setVolume,
    playNext,
    playPrev,
  } = usePlayer();
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // Initialize WaveSurfer
  useEffect(() => {
    if (!waveformRef.current || !currentTrack) return;

    wavesurfer.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#1e293b", // muted
      progressColor: "#ff10f0", // primary (neon pink)
      cursorColor: "#00d9ff", // secondary (cyan)
      barWidth: 2,
      barGap: 3,
      height: 40,
      barRadius: 3,
      normalize: true,
      url: currentTrack.audioUrl,
      // Enable background playback
      backend: "WebAudio",
      mediaControls: false, // We handle controls ourselves
    });

    wavesurfer.current.on("ready", () => {
      setDuration(wavesurfer.current?.getDuration() || 0);
      
      // Note: Media Session API handles background playback
      // Audio element configuration is optional and not required for background playback
      
      if (isPlaying) wavesurfer.current?.play();
    });

    wavesurfer.current.on("audioprocess", () => {
      setCurrentTime(wavesurfer.current?.getCurrentTime() || 0);
    });

    wavesurfer.current.on("finish", () => {
      playNext();
    });

    return () => {
      wavesurfer.current?.destroy();
    };
  }, [currentTrack]);

  // Handle Play/Pause
  useEffect(() => {
    if (wavesurfer.current) {
      isPlaying ? wavesurfer.current.play() : wavesurfer.current.pause();
    }
  }, [isPlaying]);

  // Handle Volume
  useEffect(() => {
    if (wavesurfer.current) {
      wavesurfer.current.setVolume(volume);
    }
  }, [volume]);

  // Media Session API for background playback (mobile)
  useEffect(() => {
    if (!currentTrack || !isMediaSessionSupported()) {
      return;
    }

    const mediaSession = navigator.mediaSession!;

    // Set metadata for lock screen/notification
    updateMediaSessionMetadata(
      currentTrack.title,
      currentTrack.artist,
      currentTrack.coverImageUrl
    );

    // Handle play action from lock screen/notification
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
    mediaSession.setActionHandler("seekbackward", (details) => {
      console.log("Media Session: Seek backward", details);
      if (wavesurfer.current) {
        const newTime = Math.max(0, wavesurfer.current.getCurrentTime() - (details.seekOffset || 10));
        wavesurfer.current.seekTo(newTime / duration);
      }
    });

    // Handle seek forward (optional)
    mediaSession.setActionHandler("seekforward", (details) => {
      console.log("Media Session: Seek forward", details);
      if (wavesurfer.current) {
        const newTime = Math.min(duration, wavesurfer.current.getCurrentTime() + (details.seekOffset || 10));
        wavesurfer.current.seekTo(newTime / duration);
      }
    });

    // Update playback state
    updateMediaSessionPlaybackState(isPlaying);

    // Update position state (for lock screen progress)
    const updatePositionState = () => {
      if (wavesurfer.current && duration > 0) {
        updateMediaSessionPosition(duration, currentTime);
      }
    };

    // Update position state periodically
    const positionInterval = setInterval(updatePositionState, 1000);
    updatePositionState();

    return () => {
      clearInterval(positionInterval);
      // Clear action handlers
      mediaSession.setActionHandler("play", null);
      mediaSession.setActionHandler("pause", null);
      mediaSession.setActionHandler("nexttrack", null);
      mediaSession.setActionHandler("previoustrack", null);
      mediaSession.setActionHandler("seekbackward", null);
      mediaSession.setActionHandler("seekforward", null);
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
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={playPrev}
              className="h-8 w-8 text-muted-foreground hover:text-primary"
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              onClick={togglePlay}
              className="h-10 w-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(255,16,240,0.5)]"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5 ml-1" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={playNext}
              className="h-8 w-8 text-muted-foreground hover:text-primary"
            >
              <SkipForward className="h-4 w-4" />
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

        {/* Volume & Mobile Expand */}
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
              <div className="p-6 flex flex-col h-full">
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

                {/* Mobile Waveform Placeholder (WaveSurfer instance is singular, usually hard to move, so we might use a progress bar here or clone) */}
                {/* For simplicity in this iteration, we use a standard progress bar for mobile if WaveSurfer is stuck in the footer */}
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
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </>
  );
}
