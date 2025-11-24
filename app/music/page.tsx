import db from "@/lib/db";
import { ReleaseCard } from "@/components/release-card";

// Force dynamic rendering to fetch fresh data
export const dynamic = "force-dynamic";

async function getReleases() {
  const stmt = db.prepare("SELECT * FROM releases ORDER BY release_date DESC");
  return stmt.all() as any[];
}

export default async function MusicPage() {
  const releases = await getReleases();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl md:text-6xl font-display font-bold mb-8 text-center">
        Discography
      </h1>

      {releases.length === 0 ? (
        <div className="text-center text-muted-foreground py-20">
          <p>No releases found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {releases.map((release) => (
            <ReleaseCard key={release.id} release={release} />
          ))}
        </div>
      )}
    </div>
  );
}
