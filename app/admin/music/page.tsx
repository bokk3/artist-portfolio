import db from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { deleteRelease } from "@/app/actions/admin-music";

// Force dynamic
export const dynamic = "force-dynamic";

async function getReleases() {
  const stmt = db.prepare("SELECT * FROM releases ORDER BY release_date DESC");
  return stmt.all() as any[];
}

export default async function AdminMusicPage() {
  const releases = await getReleases();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold">Music Management</h1>
        <div className="flex gap-2">
          <Link href="/admin/music/import">
            <Button variant="outline">
              Import from SoundCloud
            </Button>
          </Link>
          <Link href="/admin/music/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Release
            </Button>
          </Link>
        </div>
      </div>

      <div className="rounded-md border border-border/10 bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Cover</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {releases.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground"
                >
                  No releases found.
                </TableCell>
              </TableRow>
            ) : (
              releases.map((release) => (
                <TableRow key={release.id}>
                  <TableCell>
                    <div className="relative h-12 w-12 rounded overflow-hidden bg-muted">
                      {release.cover_image_url && (
                        <Image
                          src={release.cover_image_url}
                          alt={release.title}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{release.title}</TableCell>
                  <TableCell className="capitalize">{release.type}</TableCell>
                  <TableCell>
                    {new Date(release.release_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/music/${release.id}`}>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <form action={deleteRelease.bind(null, release.id)}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </form>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
