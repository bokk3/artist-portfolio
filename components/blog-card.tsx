import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";

type Post = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  cover_image_url: string;
  created_at: string;
  tags: string; // JSON string
};

function estimateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

export function BlogCard({ post }: { post: Post }) {
  const tags = post.tags ? JSON.parse(post.tags) : [];

  return (
    <Link href={`/blog/${post.slug}`}>
      <Card className="overflow-hidden group border-border/10 bg-card/50 hover:bg-card/80 transition-all hover:shadow-lg">
        {post.cover_image_url && (
          <div className="relative w-full h-48 overflow-hidden bg-muted">
            <Image
              src={post.cover_image_url}
              alt={post.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          </div>
        )}

        <CardHeader>
          <div className="flex gap-2 mb-2 flex-wrap">
            {tags.slice(0, 3).map((tag: string, idx: number) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <h3 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
        </CardHeader>

        <CardContent>
          <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
        </CardContent>

        <CardFooter className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(post.created_at).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {estimateReadingTime(post.excerpt)} min read
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
