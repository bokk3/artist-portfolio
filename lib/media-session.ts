/**
 * Media Session API utilities for background playback on mobile
 * 
 * Browser Support:
 * - Chrome/Edge Android: Full support
 * - Safari iOS: Full support (iOS 13+)
 * - Firefox Android: Partial support
 * - Chrome Desktop: Metadata only (no background playback)
 */

// Type definitions for Media Session API
declare global {
  interface Navigator {
    mediaSession?: MediaSession;
  }

  interface MediaSession {
    metadata: MediaMetadata | null;
    playbackState: "none" | "paused" | "playing";
    setActionHandler(
      action: MediaSessionAction,
      handler: ((details?: MediaSessionActionDetails) => void) | null
    ): void;
    setPositionState(state?: MediaPositionState): void;
  }

  interface MediaMetadata {
    title?: string;
    artist?: string;
    album?: string;
    artwork?: MediaImage[];
  }

  interface MediaImage {
    src: string;
    sizes?: string;
    type?: string;
  }

  interface MediaPositionState {
    duration?: number;
    playbackRate?: number;
    position?: number;
  }

  type MediaSessionAction =
    | "play"
    | "pause"
    | "seekbackward"
    | "seekforward"
    | "seekto"
    | "previoustrack"
    | "nexttrack"
    | "stop";

  interface MediaSessionActionDetails {
    action: MediaSessionAction;
    seekOffset?: number;
    seekTime?: number;
    fastSeek?: boolean;
  }

  class MediaMetadata {
    constructor(init?: MediaMetadataInit);
    title?: string;
    artist?: string;
    album?: string;
    artwork?: MediaImage[];
  }
}

export function isMediaSessionSupported(): boolean {
  return typeof navigator !== "undefined" && "mediaSession" in navigator;
}

export function updateMediaSessionMetadata(
  title: string,
  artist: string,
  artwork?: string
) {
  if (!isMediaSessionSupported()) return;

  navigator.mediaSession.metadata = new MediaMetadata({
    title,
    artist,
    artwork: artwork
      ? [
          {
            src: artwork,
            sizes: "512x512",
            type: "image/jpeg",
          },
        ]
      : [],
  });
}

export function updateMediaSessionPlaybackState(isPlaying: boolean) {
  if (!isMediaSessionSupported()) return;

  navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";
}

export function updateMediaSessionPosition(
  duration: number,
  position: number,
  playbackRate: number = 1.0
) {
  if (!isMediaSessionSupported()) return;

  try {
    navigator.mediaSession.setPositionState({
      duration,
      position,
      playbackRate,
    });
  } catch (error) {
    // Some browsers don't support setPositionState
    console.log("Position state not supported:", error);
  }
}

