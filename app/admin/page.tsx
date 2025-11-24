import db from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, FileText, Calendar, Users, TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

async function getStats() {
  const releases = db
    .prepare("SELECT COUNT(*) as count FROM releases")
    .get() as { count: number };
  const posts = db.prepare("SELECT COUNT(*) as count FROM posts").get() as {
    count: number;
  };
  const events = db.prepare("SELECT COUNT(*) as count FROM events").get() as {
    count: number;
  };
  const subscribers = db
    .prepare("SELECT COUNT(*) as count FROM newsletter_subscribers")
    .get() as { count: number };

  return {
    releases: releases.count,
    posts: posts.count,
    events: events.count,
    subscribers: subscribers.count,
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const statCards = [
    {
      title: "Total Releases",
      value: stats.releases,
      icon: Music,
      description: "Published albums & singles",
    },
    {
      title: "Blog Posts",
      value: stats.posts,
      icon: FileText,
      description: "Published articles",
    },
    {
      title: "Events",
      value: stats.events,
      icon: Calendar,
      description: "Scheduled shows",
    },
    {
      title: "Subscribers",
      value: stats.subscribers,
      icon: Users,
      description: "Newsletter subscribers",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold">Dashboard</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <TrendingUp className="h-4 w-4" />
          <span>Overview</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="border-border/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="border-border/10">
        <CardHeader>
          <CardTitle>Quick Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <a
              href="/admin/music/new"
              className="text-sm hover:text-primary transition-colors"
            >
              + Add Release
            </a>
            <a
              href="/admin/blog/new"
              className="text-sm hover:text-primary transition-colors"
            >
              + New Blog Post
            </a>
            <a
              href="/admin/events/new"
              className="text-sm hover:text-primary transition-colors"
            >
              + Add Event
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
