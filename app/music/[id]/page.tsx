import db from "@/lib/db";
import { TrackList } from "@/components/track-list";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

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

            <div className="mt-6 flex justify-center md:justify-start gap-4">
              {/* We could add a "Play Album" button here that adds all tracks to playlist */}
              <Button className="w-full md:w-auto">
                <Play className="mr-2 h-4 w-4" /> Play Album
              </Button>
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
