import db from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";
import { deleteVideo } from "@/app/actions/admin-videos";

export const dynamic = "force-dynamic";

async function getVideos() {
  const stmt = db.prepare("SELECT * FROM videos ORDER BY created_at DESC");
  return stmt.all() as any[];
}

export default async function AdminVideosPage() {
  const videos = await getVideos();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold">Videos Management</h1>
        <Link href="/admin/videos/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Video
          </Button>
        </Link>
      </div>

      {videos.length === 0 ? (
        <div className="text-center text-muted-foreground py-20 border border-border/10 rounded-lg">
          <p>No videos yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {videos.map((video) => (
            <div
              key={video.id}
              className="group relative rounded-lg border border-border/10 overflow-hidden"
            >
              <div className="aspect-video relative bg-muted">
                {video.thumbnail_url && (
                  <Image
                    src={video.thumbnail_url}
                    alt={video.title}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <div className="p-3 bg-card">
                <p className="text-sm font-medium truncate">{video.title}</p>
                <Badge variant="secondary" className="text-xs capitalize mt-1">
                  {video.platform}
                </Badge>
              </div>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <form action={deleteVideo.bind(null, video.id)}>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8 shadow-lg"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
