import db from "@/lib/db";
import { VideoCard } from "@/components/video-card";

export const dynamic = "force-dynamic";

async function getVideos() {
  const stmt = db.prepare("SELECT * FROM videos ORDER BY created_at DESC");
  return stmt.all() as any[];
}

export default async function VideosPage() {
  const videos = await getVideos();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">
          Videos
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Music videos, performances, and behind-the-scenes content.
        </p>
      </div>

      {videos.length === 0 ? (
        <div className="text-center text-muted-foreground py-20">
          <p>No videos available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}
