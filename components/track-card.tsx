"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Music } from "lucide-react";
import { usePlayer } from "@/context/player-context";

type Track = {
  id: number;
  title: string;
  artist: string;
  audio_url: string;
  duration?: number;
  release_id?: number;
};

export function TrackCard({ track, index }: { track: Track; index: number }) {
  const { playTrack } = usePlayer();

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    playTrack({
      id: track.id,
      title: track.title,
      artist: track.artist,
      audioUrl: track.audio_url,
      artworkUrl: null,
    });
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="group border-border/10 bg-card/50 hover:bg-card/80 transition-all hover:shadow-lg overflow-hidden">
        <CardContent className="p-4 flex items-center gap-4">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="relative w-16 h-16 rounded-lg bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center flex-shrink-0"
          >
            <Music className="h-8 w-8 text-primary" />
            <motion.div
              className="absolute inset-0 bg-primary/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              whileHover={{ scale: 1.2 }}
            />
          </motion.div>

          <div className="flex-1 min-w-0">
            <h3 className="font-bold truncate group-hover:text-primary transition-colors">
              {track.title}
            </h3>
            <p className="text-sm text-muted-foreground truncate">
              {track.artist}
            </p>
            {track.duration && (
              <p className="text-xs text-muted-foreground mt-1">
                {formatDuration(track.duration)}
              </p>
            )}
          </div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              size="icon"
              variant="ghost"
              className="rounded-full"
              onClick={handlePlay}
            >
              <Play className="h-5 w-5 ml-0.5" />
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}



