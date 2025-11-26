import db from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ReleaseCard } from "@/components/release-card";
import { VideoCard } from "@/components/video-card";
import { BlogCard } from "@/components/blog-card";
import { TrackCard } from "@/components/track-card";
import { AnimatedHero } from "@/components/animated-hero";
import { ArrowRight, Music2, Video, BookOpen } from "lucide-react";
import { SectionWrapper } from "@/components/section-wrapper";
import { getSetting } from "@/app/actions/admin-settings";

export const dynamic = "force-dynamic";

async function getLatestReleases() {
  const stmt = db.prepare(
    "SELECT * FROM releases ORDER BY release_date DESC LIMIT 4"
  );
  return stmt.all() as any[];
}

async function getLatestRelease() {
  const stmt = db.prepare(
    "SELECT * FROM releases ORDER BY release_date DESC LIMIT 1"
  );
  return stmt.get() as any;
}

async function getFeaturedTracks() {
  const stmt = db.prepare(`
    SELECT t.*, r.title as release_title, r.cover_image_url
    FROM tracks t
    LEFT JOIN releases r ON t.release_id = r.id
    ORDER BY t.created_at DESC
    LIMIT 6
  `);
  return stmt.all() as any[];
}

async function getRecentVideos() {
  const stmt = db.prepare(
    "SELECT * FROM videos ORDER BY created_at DESC LIMIT 3"
  );
  return stmt.all() as any[];
}

async function getRecentPosts() {
  const stmt = db.prepare(
    "SELECT * FROM posts WHERE published = 1 ORDER BY created_at DESC LIMIT 3"
  );
  return stmt.all() as any[];
}

export default async function HomePage() {
  const latestRelease = await getLatestRelease();
  const featuredReleases = await getLatestReleases();
  const featuredTracks = await getFeaturedTracks();
  const recentVideos = await getRecentVideos();
  const recentPosts = await getRecentPosts();
  const heroImage = await getSetting("hero_image");

  return (
    <div className="min-h-screen">
      {/* Animated Hero Section */}
      <AnimatedHero latestRelease={latestRelease} heroImage={heroImage} />

      {/* Latest Release Highlight */}
      {latestRelease && (
        <SectionWrapper>
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <Link href={`/music/${latestRelease.slug}`} className="block">
                <div className="aspect-square relative rounded-xl overflow-hidden shadow-2xl group cursor-pointer">
                  {latestRelease.cover_image_url && (
                    <Image
                      src={latestRelease.cover_image_url}
                      alt={latestRelease.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  )}
                  {/* Mobile touch indicator */}
                  <div className="absolute inset-0 md:hidden flex items-center justify-center opacity-0 active:opacity-100 transition-opacity bg-black/20 pointer-events-none">
                    <Music2 className="h-12 w-12 text-white" />
                  </div>
                </div>
              </Link>
            </div>
            <div className="md:w-1/2 text-center md:text-left">
              <p className="text-sm uppercase tracking-widest text-primary font-bold mb-2">
                Latest Release
              </p>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
                {latestRelease.title}
              </h2>
              <p className="text-xl text-muted-foreground mb-2">
                {latestRelease.artist}
              </p>
              <p className="text-sm text-muted-foreground capitalize mb-6">
                {latestRelease.type} •{" "}
                {new Date(latestRelease.release_date).getFullYear()}
              </p>
              {latestRelease.description && (
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  {latestRelease.description}
                </p>
              )}
              <Link href={`/music/${latestRelease.slug}`}>
                <Button size="lg" className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 hover:shadow-primary/50 font-semibold min-h-[48px]">
                  <Music2 className="mr-2 h-5 w-5" />
                  Play Album
                </Button>
              </Link>
            </div>
          </div>
        </SectionWrapper>
      )}

      {/* Top Featured Songs */}
      {featuredTracks.length > 0 && (
        <SectionWrapper className="bg-muted/20">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <Music2 className="h-8 w-8 text-primary" />
              <h2 className="text-3xl md:text-4xl font-display font-bold">
                Featured Songs
              </h2>
            </div>
            <Link href="/music">
              <Button variant="ghost">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredTracks.map((track, index) => (
              <TrackCard key={track.id} track={track} index={index} />
            ))}
          </div>
        </SectionWrapper>
      )}

      {/* Featured Music */}
      <SectionWrapper>
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold">
            Featured Music
          </h2>
          <Link href="/music">
            <Button variant="ghost">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredReleases.map((release, index) => (
            <ReleaseCard key={release.id} release={release} index={index} />
          ))}
        </div>
      </SectionWrapper>

      {/* Recent Videos */}
      {recentVideos.length > 0 && (
        <SectionWrapper className="bg-muted/20">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <Video className="h-8 w-8 text-primary" />
              <h2 className="text-3xl md:text-4xl font-display font-bold">
                Recent Videos
              </h2>
            </div>
            <Link href="/videos">
              <Button variant="ghost">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentVideos.map((video, index) => (
              <VideoCard key={video.id} video={video} index={index} />
            ))}
          </div>
        </SectionWrapper>
      )}

      {/* Recent Blog Posts */}
      {recentPosts.length > 0 && (
        <SectionWrapper>
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-primary" />
              <h2 className="text-3xl md:text-4xl font-display font-bold">
                Recent Posts
              </h2>
            </div>
            <Link href="/blog">
              <Button variant="ghost">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPosts.map((post, index) => (
              <BlogCard key={post.id} post={post} index={index} />
            ))}
          </div>
        </SectionWrapper>
      )}

      {/* Newsletter CTA */}
      <SectionWrapper className="bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Stay in the Loop
          </h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Get notified about new releases, tour dates, and exclusive content.
          </p>
          <Link href="/newsletter">
            <Button size="lg" className="text-lg px-8">
              Subscribe to Newsletter
            </Button>
          </Link>
        </div>
      </SectionWrapper>
    </div>
  );
}
