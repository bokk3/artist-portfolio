"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Play, Plus } from "lucide-react";
import { usePlayer } from "@/context/player-context";

type Release = {
  id: number;
  title: string;
  artist: string;
  slug: string;
  type: string;
  release_date: string;
  cover_image_url: string;
};

export function ReleaseCard({
  release,
  index = 0,
}: {
  release: Release;
  index?: number;
}) {
  const { playlist, addToQueue } = usePlayer();
  const [isHovering, setIsHovering] = useState(false);
  const [isLoadingTracks, setIsLoadingTracks] = useState(false);
  const [tracksInQueue, setTracksInQueue] = useState(false);
  const [releaseTracks, setReleaseTracks] = useState<any[]>([]);

  // Check if release tracks are in queue
  const checkTracksInQueue = async () => {
    if (isLoadingTracks && releaseTracks.length > 0) {
      // Use cached tracks
      const playlistTrackIds = new Set(playlist.map((t) => t.id));
      const allTracksInQueue =
        releaseTracks.length > 0 &&
        releaseTracks.every((t: any) => playlistTrackIds.has(t.id));
      setTracksInQueue(allTracksInQueue);
      return;
    }

    setIsLoadingTracks(true);
    try {
      const response = await fetch(`/api/releases/${release.id}/tracks`);
      if (!response.ok) return;

      const tracks = await response.json();
      setReleaseTracks(tracks);
      const playlistTrackIds = new Set(playlist.map((t) => t.id));
      const allTracksInQueue =
        tracks.length > 0 &&
        tracks.every((t: any) => playlistTrackIds.has(t.id));
      setTracksInQueue(allTracksInQueue);
    } catch (error) {
      console.error("Error checking tracks:", error);
    } finally {
      setIsLoadingTracks(false);
    }
  };

  // Update queue status when playlist changes
  useEffect(() => {
    if (releaseTracks.length > 0) {
      const playlistTrackIds = new Set(playlist.map((t) => t.id));
      const allTracksInQueue = releaseTracks.every((t: any) =>
        playlistTrackIds.has(t.id)
      );
      setTracksInQueue(allTracksInQueue);
    }
  }, [playlist, releaseTracks]);

  const handleQueueClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoadingTracks) return;

    setIsLoadingTracks(true);
    try {
      let tracks = releaseTracks;
      if (tracks.length === 0) {
        const response = await fetch(`/api/releases/${release.id}/tracks`);
        if (!response.ok) return;
        tracks = await response.json();
        setReleaseTracks(tracks);
      }

      const playerTracks = tracks.map((t: any) => ({
        id: t.id,
        title: t.title,
        artist: t.artist,
        audioUrl: t.audio_url,
        coverImageUrl: release.cover_image_url,
      }));

      addToQueue(playerTracks);
      setTracksInQueue(true);
    } catch (error) {
      console.error("Error adding to queue:", error);
    } finally {
      setIsLoadingTracks(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <Card className="overflow-hidden group glass-card hover-lift">
        <div className="p-4 pb-0">
          <Link
            href={`/music/${release.slug}`}
            className="block touch-manipulation"
          >
            <AspectRatio
              ratio={1 / 1}
              className="bg-muted rounded-md overflow-hidden relative cursor-pointer active:opacity-90 transition-opacity"
              onMouseEnter={() => {
                setIsHovering(true);
                if (!tracksInQueue) {
                  checkTracksInQueue();
                }
              }}
              onMouseLeave={() => setIsHovering(false)}
            >
              {release.cover_image_url ? (
                <Image
                  src={release.cover_image_url}
                  alt={release.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                  No Image
                </div>
              )}

              {/* Hover Overlay - Desktop */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 pointer-events-none">
                {/* Play Button */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <div className="rounded-full h-12 w-12 bg-primary text-primary-foreground flex items-center justify-center">
                    <Play className="h-6 w-6 ml-1" />
                  </div>
                </motion.div>

                {/* Queue Button - Only show if tracks not in queue */}
                {!tracksInQueue && (
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="pointer-events-auto"
                  >
                    <Button
                      size="icon"
                      variant="secondary"
                      className="rounded-full h-12 w-12 bg-secondary/90 hover:bg-secondary"
                      onClick={handleQueueClick}
                      disabled={isLoadingTracks}
                    >
                      <Plus className="h-6 w-6" />
                    </Button>
                  </motion.div>
                )}
              </div>

              {/* Mobile Touch Indicator */}
              <div className="absolute inset-0 md:hidden flex items-center justify-center opacity-0 active:opacity-100 transition-opacity bg-black/20 pointer-events-none">
                <Play className="h-8 w-8 text-white" />
              </div>
            </AspectRatio>
          </Link>
        </div>
        <CardContent className="p-4 md:p-4">
          <Link
            href={`/music/${release.slug}`}
            className="block touch-manipulation"
          >
            <h3 className="font-bold truncate hover:text-primary active:text-primary transition-colors py-1">
              {release.title}
            </h3>
            <p className="text-sm text-muted-foreground truncate py-1">
              {release.artist}
            </p>
            <p className="text-xs text-muted-foreground mt-1 capitalize py-1">
              {release.type} • {new Date(release.release_date).getFullYear()}
            </p>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
}
