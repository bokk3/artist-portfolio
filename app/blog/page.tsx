import db from "@/lib/db";
import { BlogCard } from "@/components/blog-card";

export const dynamic = "force-dynamic";

async function getPosts() {
  const stmt = db.prepare(
    "SELECT * FROM posts WHERE published = 1 ORDER BY created_at DESC"
  );
  return stmt.all() as any[];
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">
          Blog
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Thoughts, stories, and insights from the studio.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center text-muted-foreground py-20">
          <p>No blog posts yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
