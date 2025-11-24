import db from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ReleaseCard } from "@/components/release-card";
import { Play, ArrowRight } from "lucide-react";

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

export default async function HomePage() {
  const latestRelease = await getLatestRelease();
  const featuredReleases = await getLatestReleases();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        {latestRelease?.cover_image_url && (
          <div className="absolute inset-0 z-0">
            <Image
              src={latestRelease.cover_image_url}
              alt="Hero background"
              fill
              className="object-cover blur-2xl opacity-30"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
          </div>
        )}

        {/* Hero Content */}
        <div className="container mx-auto px-4 z-10 text-center">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-6 tracking-tight">
            <span className="text-gradient">ARTIST</span>
            <br />
            <span className="text-foreground">NAME</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Producer, Artist, Creator — Pushing boundaries through sound.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/music">
              <Button
                size="lg"
                className="text-lg px-8 shadow-[0_0_20px_rgba(255,16,240,0.3)]"
              >
                <Play className="mr-2 h-5 w-5" />
                Listen Now
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg" className="text-lg px-8">
                Learn More
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-border/50 flex items-start justify-center p-2">
            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
          </div>
        </div>
      </section>

      {/* Latest Release Highlight */}
      {latestRelease && (
        <section className="py-20 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2">
                <div className="aspect-square relative rounded-xl overflow-hidden shadow-2xl">
                  {latestRelease.cover_image_url && (
                    <Image
                      src={latestRelease.cover_image_url}
                      alt={latestRelease.title}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
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
                <Link href={`/music/${latestRelease.id}`}>
                  <Button size="lg">
                    <Play className="mr-2 h-5 w-5" />
                    Play Album
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Music */}
      <section className="py-20">
        <div className="container mx-auto px-4">
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
            {featuredReleases.map((release) => (
              <ReleaseCard key={release.id} release={release} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Stay in the Loop
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Get notified about new releases, tour dates, and exclusive content.
          </p>
          <Link href="/newsletter">
            <Button size="lg">Subscribe to Newsletter</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
