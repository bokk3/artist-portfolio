"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { usePlayer } from "@/context/player-context";

type Release = {
  id: number;
  title: string;
  artist: string;
  type: string;
  release_date: string;
  cover_image_url: string;
};

export function ReleaseCard({ release, index = 0 }: { release: Release; index?: number }) {
  // In a real app, we'd fetch the first track of the release to play
  // For now, the play button will just link to the details page where tracks are listed

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <Card className="overflow-hidden group border-border/10 bg-card/50 hover:bg-card/80 transition-colors">
      <div className="p-4 pb-0">
        <AspectRatio
          ratio={1 / 1}
          className="bg-muted rounded-md overflow-hidden relative"
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

          {/* Hover Play Overlay */}
          <motion.div
            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
          >
            <Link href={`/music/${release.id}`}>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  size="icon"
                  className="rounded-full h-12 w-12 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Play className="h-6 w-6 ml-1" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </AspectRatio>
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold truncate">{release.title}</h3>
        <p className="text-sm text-muted-foreground truncate">
          {release.artist}
        </p>
        <p className="text-xs text-muted-foreground mt-1 capitalize">
          {release.type} • {new Date(release.release_date).getFullYear()}
        </p>
      </CardContent>
    </Card>
    </motion.div>
  );
}
