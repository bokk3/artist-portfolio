import db from "@/lib/db";
import { notFound } from "next/navigation";
import { TrackList } from "@/components/track-list";
import { PlayerProvider } from "@/context/player-context";
import { Player } from "@/components/player";
import Image from "next/image";

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

export default async function EmbedReleasePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const release = await getRelease(id);
  const tracks = await getTracks(id);

  if (!release) {
    notFound();
  }

  return (
    <html lang="en" className="dark">
      <body className="bg-background m-0 p-0">
        <PlayerProvider>
          <div className="min-h-screen p-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-card rounded-lg border border-border/10 p-6 shadow-lg">
                <div className="flex flex-col md:flex-row gap-6 mb-6">
                  {release.cover_image_url && (
                    <div className="w-full md:w-48 h-48 relative rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <Image
                        src={release.cover_image_url}
                        alt={release.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">{release.title}</h2>
                    <p className="text-muted-foreground mb-2">{release.artist}</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {release.type} • {new Date(release.release_date).getFullYear()}
                    </p>
                  </div>
                </div>
                <TrackList tracks={tracks} coverImage={release.cover_image_url} />
                <div className="mt-6 pt-6 border-t border-border/10">
                  <Player />
                </div>
              </div>
            </div>
          </div>
        </PlayerProvider>
      </body>
    </html>
  );
}

