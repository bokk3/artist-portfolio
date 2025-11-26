"use client";

import Image from "next/image";
import { usePlayer } from "@/context/player-context";
import { cn } from "@/lib/utils";

type Track = {
  id: number;
  title: string;
  artist: string;
  audio_url: string;
  track_number: number;
};

type AlbumArtPlayerProps = {
  coverImageUrl?: string;
  title: string;
  tracks: Track[];
  className?: string;
};

export function AlbumArtPlayer({
  coverImageUrl,
  title,
  tracks,
  className,
}: AlbumArtPlayerProps) {
  const { playTrack, setPlaylist } = usePlayer();

  const handleClick = () => {
    if (tracks.length === 0) return;

    // Convert tracks to player format
    const playerTracks = tracks.map((track) => ({
      id: track.id,
      title: track.title,
      artist: track.artist,
      audioUrl: track.audio_url,
      coverImageUrl,
    }));

    // Set the playlist
    setPlaylist(playerTracks);

    // Play the first track
    playTrack(playerTracks[0]);
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "aspect-square relative rounded-xl overflow-hidden shadow-2xl bg-muted cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] group touch-manipulation",
        className
      )}
      role="button"
      tabIndex={0}
      aria-label={`Play ${title}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {coverImageUrl ? (
        <Image
          src={coverImageUrl}
          alt={title}
          fill
          className="object-cover"
          priority
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
          No Image
        </div>
      )}
      {/* Play indicator overlay - subtle on mobile, more visible on hover */}
      <div className="absolute inset-0 bg-black/0 hover:bg-black/30 active:bg-black/40 transition-colors flex items-center justify-center">
        <div className="opacity-0 hover:opacity-100 active:opacity-100 transition-opacity md:group-hover:opacity-100">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
            <svg
              className="w-8 h-8 md:w-10 md:h-10 text-primary-foreground ml-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

