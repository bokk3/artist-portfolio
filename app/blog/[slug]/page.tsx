import db from "@/lib/db";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Share2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

async function getPostBySlug(slug: string) {
  const stmt = db.prepare(
    "SELECT * FROM posts WHERE slug = ? AND published = 1"
  );
  return stmt.get(slug) as any;
}

function estimateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const tags = post.tags ? JSON.parse(post.tags) : [];

  return (
    <article className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link href="/blog">
          <Button variant="ghost" className="mb-6">
            ← Back to Blog
          </Button>
        </Link>

        <div className="flex gap-2 mb-4 flex-wrap">
          {tags.map((tag: string, idx: number) => (
            <Badge key={idx} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>

        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
          {post.title}
        </h1>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {new Date(post.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {estimateReadingTime(post.content)} min read
          </div>
        </div>

        <Button variant="outline" size="sm">
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </div>

      {/* Cover Image */}
      {post.cover_image_url && (
        <div className="relative w-full h-[400px] rounded-xl overflow-hidden mb-8 bg-muted">
          <Image
            src={post.cover_image_url}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Content */}
      <div
        className="prose prose-invert prose-lg max-w-none
          prose-headings:font-display prose-headings:text-foreground
          prose-p:text-muted-foreground prose-p:leading-relaxed
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline
          prose-strong:text-foreground
          prose-code:text-primary prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded
          prose-pre:bg-muted prose-pre:border prose-pre:border-border
          prose-img:rounded-lg prose-img:shadow-lg
          prose-blockquote:border-l-primary prose-blockquote:text-foreground"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}
