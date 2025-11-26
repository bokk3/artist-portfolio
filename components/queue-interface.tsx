"use client";

import { usePlayer } from "@/context/player-context";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { X, Play, GripVertical, Music2, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export function QueueInterface() {
  const {
    playlist,
    currentTrack,
    playTrack,
    removeTrack,
    reorderTracks,
    clearQueue,
  } = usePlayer();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Get upcoming tracks (everything after current track)
  const currentIndex = currentTrack
    ? playlist.findIndex((t) => t.id === currentTrack.id)
    : -1;
  const upcomingTracks = playlist.slice(currentIndex + 1);

  if (playlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Music2 className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-sm text-muted-foreground">Queue is empty</p>
        <p className="text-xs text-muted-foreground mt-1">
          Add tracks to see them here
        </p>
      </div>
    );
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragEnd = () => {
    if (
      draggedIndex !== null &&
      dragOverIndex !== null &&
      draggedIndex !== dragOverIndex
    ) {
      // Calculate actual indices in the full playlist
      // upcomingTracks is a slice starting after currentIndex
      const actualFromIndex = currentIndex + 1 + draggedIndex;
      const actualToIndex = currentIndex + 1 + dragOverIndex;

      reorderTracks(actualFromIndex, actualToIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/10">
        <div>
          <h3 className="text-sm font-semibold">Queue</h3>
          <p className="text-xs text-muted-foreground">
            {upcomingTracks.length}{" "}
            {upcomingTracks.length === 1 ? "track" : "tracks"} upcoming
          </p>
        </div>
        {upcomingTracks.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearQueue}
            className="h-8 text-xs text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Current Track */}
      {currentTrack && (
        <div className="px-4 py-3 border-b border-border/10 bg-primary/5">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 relative rounded-md overflow-hidden bg-muted flex-shrink-0">
              {currentTrack.coverImageUrl && (
                <Image
                  src={currentTrack.coverImageUrl}
                  alt={currentTrack.title}
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">
                {currentTrack.title}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {currentTrack.artist}
              </p>
            </div>
            <div className="flex-shrink-0">
              <div className="px-2 py-1 bg-primary/20 text-primary text-xs font-medium rounded-full">
                Now
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upcoming Tracks */}
      <ScrollArea className="flex-1">
        <div className="px-2 py-2">
          {upcomingTracks.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground">
              No more tracks in queue
            </div>
          ) : (
            <div className="space-y-1">
              {upcomingTracks.map((track, index) => {
                const actualIndex = currentIndex + 1 + index;
                const isDragging = draggedIndex === index;
                const isDragOver = dragOverIndex === index;

                return (
                  <div
                    key={track.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    onDragLeave={() => setDragOverIndex(null)}
                    className={cn(
                      "group flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                      "hover:bg-muted/50 cursor-move",
                      isDragging && "opacity-50",
                      isDragOver && "bg-primary/10 border-2 border-primary/30"
                    )}
                  >
                    {/* Drag Handle */}
                    <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />

                    {/* Track Number */}
                    <div className="flex-shrink-0 w-6 text-xs text-muted-foreground text-center">
                      {actualIndex + 1}
                    </div>

                    {/* Album Art */}
                    <div className="h-10 w-10 relative rounded-md overflow-hidden bg-muted flex-shrink-0">
                      {track.coverImageUrl && (
                        <Image
                          src={track.coverImageUrl}
                          alt={track.title}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>

                    {/* Track Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {track.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {track.artist}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => playTrack(track)}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => removeTrack(track.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
