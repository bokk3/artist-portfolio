"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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

export function VideoCard({
  video,
  index = 0,
}: {
  video: Video;
  index?: number;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const embedUrl = getEmbedUrl(video.video_url, video.platform);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card
        className="overflow-hidden group cursor-pointer glass-card hover-lift hover:border-primary/50"
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
          <motion.div
            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              className="rounded-full bg-primary p-4"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Play className="h-8 w-8 text-primary-foreground ml-1" />
            </motion.div>
          </motion.div>
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
    </motion.div>
  );
}
