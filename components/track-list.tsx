"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import { usePlayer } from "@/context/player-context";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

type Track = {
  id: number;
  title: string;
  artist: string;
  duration: number | null;
  audio_url: string;
  track_number: number;
  cover_image_url?: string; // Optional, from release
};

export function TrackList({
  tracks,
  coverImage,
}: {
  tracks: Track[];
  coverImage?: string;
}) {
  const { playTrack, currentTrack, isPlaying, togglePlay, setPlaylist } = usePlayer();

  const handlePlay = (track: Track) => {
    if (currentTrack?.id === track.id) {
      togglePlay();
    } else {
      // Convert tracks to player format
      const playerTracks = tracks.map((t) => ({
        id: t.id,
        title: t.title,
        artist: t.artist,
        audioUrl: t.audio_url,
        coverImageUrl: coverImage,
      }));

      // Set the playlist
      setPlaylist(playerTracks);

      // Play the selected track
      playTrack({
        id: track.id,
        title: track.title,
        artist: track.artist,
        audioUrl: track.audio_url,
        coverImageUrl: coverImage,
      });
    }
  };

  const formatTime = (seconds: number | null | undefined) => {
    if (!seconds) return '-';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent border-border/10">
          <TableHead className="w-12">#</TableHead>
          <TableHead>Title</TableHead>
          <TableHead className="text-right">Time</TableHead>
          <TableHead className="w-12"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tracks.map((track) => (
          <TableRow
            key={track.id}
            className="group hover:bg-muted/50 active:bg-muted/70 border-border/10 transition-colors cursor-pointer touch-manipulation"
            onClick={() => handlePlay(track)}
          >
            <TableCell className="font-mono text-muted-foreground py-4">
              {track.track_number}
            </TableCell>
            <TableCell className="py-4">
              <div className="font-medium">{track.title}</div>
              <div className="text-xs text-muted-foreground md:hidden">
                {track.artist}
              </div>
            </TableCell>
            <TableCell className="text-right font-mono text-muted-foreground py-4">
              {formatTime(track.duration)}
            </TableCell>
            <TableCell className="py-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlay(track);
                }}
                className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity h-12 w-12 md:h-9 md:w-9 touch-manipulation"
              >
                {currentTrack?.id === track.id && isPlaying ? (
                  <Pause className="h-6 w-6 md:h-4 md:w-4 text-primary" />
                ) : (
                  <Play className="h-6 w-6 md:h-4 md:w-4" />
                )}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
