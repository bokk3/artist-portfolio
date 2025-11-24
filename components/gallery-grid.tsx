"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { AspectRatio } from "@/components/ui/aspect-ratio";

type GalleryImage = {
  id: number;
  image_url: string;
  caption: string;
  category: string;
};

export function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  const slides = images.map((img) => ({
    src: img.image_url,
    alt: img.caption,
  }));

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div
            key={image.id}
            className="group cursor-pointer overflow-hidden rounded-lg border border-border/10 hover:border-primary/50 transition-all"
            onClick={() => setLightboxIndex(index)}
          >
            <AspectRatio ratio={1}>
              <Image
                src={image.image_url}
                alt={image.caption}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            </AspectRatio>
          </div>
        ))}
      </div>

      <Lightbox
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        close={() => setLightboxIndex(-1)}
        slides={slides}
      />
    </>
  );
}
