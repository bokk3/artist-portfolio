import db from "@/lib/db";
import { TrackList } from "@/components/track-list";
import { ShareButtons } from "@/components/share-buttons";
import { EmbedPlayer } from "@/components/embed-player";
import { AlbumArtPlayer } from "@/components/album-art-player";
import { PlayAlbumButton } from "@/components/play-album-button";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

// Force dynamic rendering
export const dynamic = "force-dynamic";

async function getRelease(slug: string) {
  const stmt = db.prepare("SELECT * FROM releases WHERE slug = ?");
  return stmt.get(slug) as any;
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
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const release = await getRelease(slug);

  if (!release) {
    return {
      title: "Release Not Found",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://artist-portfolio.com";
  const releaseUrl = `${siteUrl}/music/${slug}`;
  const description = release.description || `${release.title} by ${release.artist}`;

  // Convert relative image URL to absolute
  const imageUrl = release.cover_image_url
    ? release.cover_image_url.startsWith('http://') || release.cover_image_url.startsWith('https://')
      ? release.cover_image_url
      : `${siteUrl}${release.cover_image_url}`
    : null;

  return {
    title: `${release.title} by ${release.artist}`,
    description,
    openGraph: {
      title: `${release.title} by ${release.artist}`,
      description,
      type: "music.album",
      url: releaseUrl,
      images: imageUrl
        ? [
            {
              url: imageUrl,
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
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function ReleasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const release = await getRelease(slug);
  const tracks = await getTracks(release.id.toString());

  if (!release) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8 md:gap-12">
        {/* Album Art & Info */}
        <div className="w-full md:w-1/3 flex flex-col gap-6">
          <AlbumArtPlayer
            coverImageUrl={release.cover_image_url}
            title={release.title}
            tracks={tracks}
          />

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
              <PlayAlbumButton
                tracks={tracks}
                coverImageUrl={release.cover_image_url}
                className="w-full md:w-auto"
              />
              <ShareButtons
                title={`${release.title} by ${release.artist}`}
                url={`/music/${release.slug}`}
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

