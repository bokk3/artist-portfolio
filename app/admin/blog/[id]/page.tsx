"use client";

import db from "@/lib/db";
import { updatePost } from "@/app/actions/admin-blog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { notFound } from "next/navigation";

export default function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [post, setPost] = useState<any>(null);
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then(({ id }) => {
      // Fetch post data client-side (not ideal, but simplifies for now)
      fetch(`/api/admin/posts/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setPost(data);
          setPublished(data.published === 1);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    });
  }, [params]);

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  if (!post) {
    notFound();
  }

  const tags = post.tags || "[]";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/blog">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-display font-bold">Edit Post</h1>
      </div>

      <form action={updatePost.bind(null, post.id)}>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Post Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={post.title}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  defaultValue={post.excerpt}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content (HTML)</Label>
                <Textarea
                  id="content"
                  name="content"
                  defaultValue={post.content}
                  rows={15}
                  className="font-mono text-sm"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cover_image_url">Cover Image URL</Label>
                <Input
                  id="cover_image_url"
                  name="cover_image_url"
                  defaultValue={post.cover_image_url}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (JSON Array)</Label>
                <Input id="tags" name="tags" defaultValue={tags} />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="published"
                  checked={published}
                  onCheckedChange={setPublished}
                />
                <Label htmlFor="published">Published</Label>
                <input
                  type="hidden"
                  name="published"
                  value={published.toString()}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Link href="/admin/blog">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button type="submit">Update Post</Button>
          </div>
        </div>
      </form>
    </div>
  );
}
