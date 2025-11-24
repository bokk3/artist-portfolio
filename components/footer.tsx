import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 text-left">
        <div className="md:col-span-2">
          <h3 className="font-display text-xl font-bold mb-4">Stay Updated</h3>
          <p className="text-muted-foreground mb-4 max-w-sm">
            Join the mailing list for exclusive updates, tour dates, and new
            releases.
          </p>
          <div className="flex gap-2 max-w-sm">
            <Input
              placeholder="Enter your email"
              className="bg-background/50"
            />
            <Button>Subscribe</Button>
          </div>
        </div>

        <div>
          <h3 className="font-display text-lg font-bold mb-4">Connect</h3>
          <div className="flex flex-col gap-2">
            <Link
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
            >
              <Instagram className="h-4 w-4" /> Instagram
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
            >
              <Twitter className="h-4 w-4" /> Twitter
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
            >
              <Facebook className="h-4 w-4" /> Facebook
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
            >
              <Youtube className="h-4 w-4" /> YouTube
            </Link>
          </div>
        </div>

        <div>
          <h3 className="font-display text-lg font-bold mb-4">Contact</h3>
          <Link
            href="mailto:booking@artist.com"
            className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
          >
            <Mail className="h-4 w-4" /> booking@artist.com
          </Link>
          <p className="text-muted-foreground mt-2 text-sm">
            Management: <br />
            Jane Doe <br />
            jane@management.com
          </p>
        </div>
      </div>

      <div className="border-t border-border/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Artist Name. All rights reserved.
        </p>
        <div className="flex gap-6 text-sm text-muted-foreground">
          <Link href="/privacy" className="hover:text-foreground">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-foreground">
            Terms of Service
          </Link>
        </div>
      </div>
    </div>
  );
}
