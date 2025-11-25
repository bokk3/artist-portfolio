import db from "@/lib/db";
import { TrackList } from "@/components/track-list";
import { ShareButtons } from "@/components/share-buttons";
import { EmbedPlayer } from "@/components/embed-player";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import type { Metadata } from "next";

// Force dynamic rendering
export const dynamic = "force-dynamic";

async function getRelease(id: string) {
  const stmt = db.prepare("SELECT * FROM releases WHERE id = ?");
  return stmt.get(id) as any;
}

async function getTracks(releaseId: string) {
  const stmt = db.prepare(
    "SELECT * FROM tracks WHERE release_id = ? ORDER BY track_number ASC"
  );
  return stmt.all(releaseId) as any[];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const release = await getRelease(id);

  if (!release) {
    return {
      title: "Release Not Found",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://artist-portfolio.com";
  const releaseUrl = `${siteUrl}/music/${id}`;
  const description = release.description || `${release.title} by ${release.artist}`;

  return {
    title: `${release.title} by ${release.artist}`,
    description,
    openGraph: {
      title: `${release.title} by ${release.artist}`,
      description,
      type: "music.album",
      url: releaseUrl,
      images: release.cover_image_url
        ? [
            {
              url: release.cover_image_url,
              width: 1200,
              height: 1200,
              alt: `${release.title} cover art`,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${release.title} by ${release.artist}`,
      description,
      images: release.cover_image_url ? [release.cover_image_url] : [],
    },
  };
}

export default async function ReleasePage({
  params,
}: {
  params: { id: string };
}) {
  // Await params in Next.js 15/16 if necessary, but standard access works for now in 14/15
  // Note: Next.js 15+ might require awaiting params. Let's assume standard behavior for now or await if it's a promise.
  // Actually, in Next.js 15, params is a Promise. Let's await it to be safe.
  const { id } = await params;

  const release = await getRelease(id);
  const tracks = await getTracks(id);

  if (!release) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8 md:gap-12">
        {/* Album Art & Info */}
        <div className="w-full md:w-1/3 flex flex-col gap-6">
          <div className="aspect-square relative rounded-xl overflow-hidden shadow-2xl bg-muted">
            {release.cover_image_url ? (
              <Image
                src={release.cover_image_url}
                alt={release.title}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                No Image
              </div>
            )}
          </div>

          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
              {release.title}
            </h1>
            <p className="text-xl text-muted-foreground mb-4">
              {release.artist}
            </p>
            <p className="text-sm text-muted-foreground capitalize">
              {release.type} • {new Date(release.release_date).getFullYear()}
            </p>

            <div className="mt-6 flex flex-col sm:flex-row justify-center md:justify-start gap-4">
              <Button className="w-full md:w-auto">
                <Play className="mr-2 h-4 w-4" /> Play Album
              </Button>
              <ShareButtons
                title={`${release.title} by ${release.artist}`}
                url={`/music/${release.id}`}
                description={release.description || `${release.title} by ${release.artist}`}
                image={release.cover_image_url || ""}
              />
              <EmbedPlayer
                releaseId={release.id}
                title={release.title}
              />
            </div>
          </div>
        </div>

        {/* Tracklist */}
        <div className="w-full md:w-2/3">
          <h2 className="text-2xl font-display font-bold mb-6 border-b border-border/10 pb-2">
            Tracklist
          </h2>
          <TrackList tracks={tracks} coverImage={release.cover_image_url} />
        </div>
      </div>
    </div>
  );
}
