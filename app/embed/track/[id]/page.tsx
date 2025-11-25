import db from "@/lib/db";
import { notFound } from "next/navigation";
import { Player } from "@/components/player";
import { PlayerProvider } from "@/context/player-context";

export const dynamic = "force-dynamic";

async function getTrack(id: string) {
  const stmt = db.prepare(`
    SELECT t.*, r.cover_image_url, r.title as release_title
    FROM tracks t
    LEFT JOIN releases r ON t.release_id = r.id
    WHERE t.id = ?
  `);
  return stmt.get(id) as any;
}

export default async function EmbedTrackPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const track = await getTrack(id);

  if (!track) {
    notFound();
  }

  return (
    <html lang="en" className="dark">
      <body className="bg-background m-0 p-0">
        <PlayerProvider>
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
              <div className="bg-card rounded-lg border border-border/10 p-6 shadow-lg">
                <h2 className="text-xl font-bold mb-2">{track.title}</h2>
                <p className="text-muted-foreground mb-4">{track.artist}</p>
                <Player />
              </div>
            </div>
          </div>
        </PlayerProvider>
      </body>
    </html>
  );
}

