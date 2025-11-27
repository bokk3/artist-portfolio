"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Menu,
  Search,
  Music,
  Video,
  Calendar,
  Image,
  BookOpen,
  User,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ThemeSwitcher } from "@/components/theme-switcher";

const navItems = [
  { name: "Music", href: "/music", icon: Music },
  { name: "Videos", href: "/videos", icon: Video },
  { name: "Tour", href: "/tour", icon: Calendar },
  { name: "Gallery", href: "/gallery", icon: Image },
  { name: "Blog", href: "/blog", icon: BookOpen },
  { name: "About", href: "/about", icon: User },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <nav className="container mx-auto flex h-16 items-center justify-between px-4">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <Link
          href="/"
          className="font-display text-2xl font-bold tracking-tighter text-primary hover:text-primary/80 transition-colors"
        >
          ARTIST<span className="text-foreground">NAME</span>
        </Link>
        <span className="text-xs text-muted-foreground/60 font-mono hidden sm:inline">
          v{process.env.NEXT_PUBLIC_APP_VERSION || "dev"}
        </span>
      </div>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-6">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative px-3 py-2 text-sm font-medium transition-colors hover:text-primary",
              pathname === item.href ? "text-primary" : "text-muted-foreground"
            )}
          >
            {pathname === item.href && (
              <motion.div
                layoutId="navbar-active"
                className="absolute inset-0 bg-primary/10 rounded-md -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            {item.name}
          </Link>
        ))}

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpen(true)}
          className="text-muted-foreground hover:text-primary"
        >
          <Search className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Button>

        <ThemeSwitcher />
      </div>

      {/* Mobile Nav */}
      <div className="md:hidden flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpen(true)}
          className="text-muted-foreground h-12 w-12 touch-manipulation"
        >
          <Search className="h-6 w-6" />
        </Button>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 touch-manipulation"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="glass-panel h-full border-r-0 rounded-l-[10px]"
          >
            <div className="flex flex-col gap-4 mt-10">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-2xl font-display font-medium transition-colors hover:text-primary active:text-primary flex items-center gap-4 py-4 px-2 -mx-2 rounded-lg active:bg-muted/50 touch-manipulation",
                    pathname === item.href
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  <item.icon className="h-7 w-7" />
                  {item.name}
                </Link>
              ))}

              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-sm text-muted-foreground mb-4 font-medium">
                  Theme
                </p>
                <div className="flex gap-4">
                  <ThemeSwitcher />
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Command Dialog */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Pages">
            {navItems.map((item) => (
              <CommandItem
                key={item.href}
                onSelect={() => {
                  setOpen(false);
                  router.push(item.href);
                }}
              >
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </nav>
  );
}
