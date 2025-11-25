/**
 * Media Session API utilities for background playback on mobile
 * 
 * Browser Support:
 * - Chrome/Edge Android: Full support
 * - Safari iOS: Full support (iOS 13+)
 * - Firefox Android: Partial support
 * - Chrome Desktop: Metadata only (no background playback)
 */

// TypeScript may already have MediaSession types in some environments
// We'll use type assertions where needed

export function isMediaSessionSupported(): boolean {
  return typeof navigator !== "undefined" && "mediaSession" in navigator;
}

export function updateMediaSessionMetadata(
  title: string,
  artist: string,
  artwork?: string
) {
  if (!isMediaSessionSupported()) return;

  const mediaSession = (navigator as any).mediaSession;
  if (!mediaSession) return;

  mediaSession.metadata = new (window as any).MediaMetadata({
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

  const mediaSession = (navigator as any).mediaSession;
  if (!mediaSession) return;

  mediaSession.playbackState = isPlaying ? "playing" : "paused";
}

export function updateMediaSessionPosition(
  duration: number,
  position: number,
  playbackRate: number = 1.0
) {
  if (!isMediaSessionSupported()) return;

  const mediaSession = (navigator as any).mediaSession;
  if (!mediaSession || !mediaSession.setPositionState) return;

  try {
    mediaSession.setPositionState({
      duration,
      position,
      playbackRate,
    });
  } catch (error) {
    // Some browsers don't support setPositionState
    console.log("Position state not supported:", error);
  }
}
