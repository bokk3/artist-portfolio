"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Music,
  FileText,
  Calendar,
  Video,
  Image,
  LogOut,
  Settings,
  BookOpen,
} from "lucide-react";
import { logoutAction } from "@/app/actions/auth";

const adminNav = [
  { name: "Music", href: "/admin/music", icon: Music },
  { name: "Videos", href: "/admin/videos", icon: Video },
  { name: "Events", href: "/admin/events", icon: Calendar },
  { name: "Gallery", href: "/admin/gallery", icon: Image },
  { name: "Blog", href: "/admin/blog", icon: BookOpen },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border/10 hidden md:flex flex-col">
        <div className="p-6 border-b border-border/10">
          <h1 className="text-xl font-display font-bold text-primary">
            Admin Panel
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="/admin/gallery"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
              pathname === "/admin/gallery"
                ? "bg-muted text-primary"
                : "text-muted-foreground"
            )}
          >
            <Image className="h-4 w-4" />
            Gallery
          </Link>
          <Link
            href="/admin/settings"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
              pathname === "/admin/settings"
                ? "bg-muted text-primary"
                : "text-muted-foreground"
            )}
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-border/10">
          <form action={logoutAction}>
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background p-8">
        {children}
      </main>
    </div>
  );
}
