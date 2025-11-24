"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Play } from "lucide-react";

type Video = {
  id: number;
  title: string;
  video_url: string;
  thumbnail_url: string;
  platform: string;
};

function getEmbedUrl(videoUrl: string, platform: string): string {
  if (platform === "youtube") {
    const videoId =
      videoUrl.split("v=")[1]?.split("&")[0] || videoUrl.split("/").pop();
    return `https://www.youtube.com/embed/${videoId}`;
  } else if (platform === "vimeo") {
    const videoId = videoUrl.split("/").pop();
    return `https://player.vimeo.com/video/${videoId}`;
  }
  return videoUrl;
}

export function VideoCard({ video }: { video: Video }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const embedUrl = getEmbedUrl(video.video_url, video.platform);

  return (
    <>
      <Card
        className="overflow-hidden group cursor-pointer border-border/10 hover:border-primary/50 transition-all"
        onClick={() => setDialogOpen(true)}
      >
        <AspectRatio ratio={16 / 9} className="relative bg-muted">
          {video.thumbnail_url && (
            <Image
              src={video.thumbnail_url}
              alt={video.title}
              fill
              className="object-cover"
            />
          )}

          {/* Play Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="rounded-full bg-primary p-4">
              <Play className="h-8 w-8 text-primary-foreground ml-1" />
            </div>
          </div>
        </AspectRatio>
        <CardContent className="p-4">
          <h3 className="font-bold truncate">{video.title}</h3>
        </CardContent>
      </Card>

      {/* Video Player Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl p-0">
          <AspectRatio ratio={16 / 9}>
            {video.platform === "native" ? (
              <video controls className="w-full h-full">
                <source src={video.video_url} type="video/mp4" />
              </video>
            ) : (
              <iframe
                src={embedUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </AspectRatio>
        </DialogContent>
      </Dialog>
    </>
  );
}
