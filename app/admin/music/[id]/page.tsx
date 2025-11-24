import db from "@/lib/db";
import { addTrack, deleteTrack } from "@/app/actions/admin-music";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { ChevronLeft, Plus, Trash2 } from "lucide-react";
import { notFound } from "next/navigation";
import { AddTrackForm } from "@/components/add-track-form";

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

export default async function EditReleasePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const release = await getRelease(id);
  const tracks = await getTracks(id);

  if (!release) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/music">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-display font-bold">Edit Release</h1>
          <p className="text-muted-foreground">{release.title}</p>
        </div>
      </div>

      {/* Tracks Management */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Tracks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Add Track Form */}
            <AddTrackForm releaseId={release.id} artist={release.artist} defaultTrackNumber={tracks.length + 1} />

            {/* Tracks List */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Audio URL</TableHead>
                  <TableHead className="text-right">Duration</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tracks.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-muted-foreground py-4"
                    >
                      No tracks added yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  tracks.map((track) => (
                    <TableRow key={track.id}>
                      <TableCell>{track.track_number}</TableCell>
                      <TableCell className="font-medium">
                        {track.title}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {track.audio_url}
                      </TableCell>
                      <TableCell className="text-right">
                        {track.duration}s
                      </TableCell>
                      <TableCell>
                        <form
                          action={deleteTrack.bind(null, track.id, release.id)}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </form>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
