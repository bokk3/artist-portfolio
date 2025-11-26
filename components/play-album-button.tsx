"use client";

import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { usePlayer } from "@/context/player-context";

type Track = {
  id: number;
  title: string;
  artist: string;
  audio_url: string;
  track_number: number;
};

type PlayAlbumButtonProps = {
  tracks: Track[];
  coverImageUrl?: string;
  className?: string;
};

export function PlayAlbumButton({
  tracks,
  coverImageUrl,
  className,
}: PlayAlbumButtonProps) {
  const { playTrack, setPlaylist } = usePlayer();

  const handlePlay = () => {
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
    <Button onClick={handlePlay} className={className}>
      <Play className="mr-2 h-4 w-4" /> Play Album
    </Button>
  );
}

