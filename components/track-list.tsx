"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  duration: number;
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
  const { playTrack, currentTrack, isPlaying, togglePlay } = usePlayer();

  const handlePlay = (track: Track) => {
    if (currentTrack?.id === track.id) {
      togglePlay();
    } else {
      playTrack({
        id: track.id,
        title: track.title,
        artist: track.artist,
        audioUrl: track.audio_url,
        coverImageUrl: coverImage,
      });
    }
  };

  const formatTime = (seconds: number) => {
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
            className="group hover:bg-muted/50 border-border/10 transition-colors"
          >
            <TableCell className="font-mono text-muted-foreground">
              {track.track_number}
            </TableCell>
            <TableCell>
              <div className="font-medium">{track.title}</div>
              <div className="text-xs text-muted-foreground md:hidden">
                {track.artist}
              </div>
            </TableCell>
            <TableCell className="text-right font-mono text-muted-foreground">
              {formatTime(track.duration)}
            </TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handlePlay(track)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {currentTrack?.id === track.id && isPlaying ? (
                  <Pause className="h-4 w-4 text-primary" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
