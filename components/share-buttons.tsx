"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Share2,
  Twitter,
  Facebook,
  Linkedin,
  Link as LinkIcon,
  Check,
  MessageCircle,
  Send,
  MessageSquare,
  Code,
  Copy,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface ShareButtonsProps {
  title: string;
  url: string;
  description?: string;
  image?: string;
  variant?: "default" | "icon" | "compact";
}

export function ShareButtons({
  title,
  url,
  description = "",
  image = "",
  variant = "default",
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [embedCopied, setEmbedCopied] = useState(false);
  const [embedDialogOpen, setEmbedDialogOpen] = useState(false);

  const shareUrl = `${
    typeof window !== "undefined" ? window.location.origin : ""
  }${url}`;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}${description ? `&description=${encodedDescription}` : ""}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
  };

  const embedCode = `<iframe src="${shareUrl}" width="100%" height="400" frameborder="0" allow="autoplay"></iframe>`;

  const copyToClipboard = async (text: string, setState: (val: boolean) => void) => {
    try {
      await navigator.clipboard.writeText(text);
      setState(true);
      setTimeout(() => setState(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description || title,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or error occurred
        console.log("Share cancelled or failed:", err);
      }
    } else {
      // Fallback to copy
      copyToClipboard(shareUrl, setCopied);
    }
  };

  const buttonContent = variant === "icon" ? (
    <Share2 className="h-4 w-4" />
  ) : variant === "compact" ? (
    <>
      <Share2 className="h-4 w-4" />
      <span className="sr-only">Share</span>
    </>
  ) : (
    <>
      <Share2 className="mr-2 h-4 w-4" />
      Share
    </>
  );

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size={variant === "icon" ? "icon" : "sm"}>
            {buttonContent}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {/* Native Share (Mobile) */}
          {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
            <>
              <DropdownMenuItem onClick={handleNativeShare} className="cursor-pointer">
                <Share2 className="mr-2 h-4 w-4" />
                Share via...
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}

          {/* Social Platforms */}
          <DropdownMenuItem asChild>
            <a
              href={shareLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer"
            >
              <Twitter className="mr-2 h-4 w-4" />
              Twitter / X
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a
              href={shareLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer"
            >
              <Facebook className="mr-2 h-4 w-4" />
              Facebook
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a
              href={shareLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              WhatsApp
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a
              href={shareLinks.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer"
            >
              <Send className="mr-2 h-4 w-4" />
              Telegram
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a
              href={shareLinks.reddit}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Reddit
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a
              href={shareLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer"
            >
              <Linkedin className="mr-2 h-4 w-4" />
              LinkedIn
            </a>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Copy Link */}
          <DropdownMenuItem
            onClick={() => copyToClipboard(shareUrl, setCopied)}
            className="cursor-pointer"
          >
            {copied ? (
              <Check className="mr-2 h-4 w-4" />
            ) : (
              <LinkIcon className="mr-2 h-4 w-4" />
            )}
            {copied ? "Copied!" : "Copy Link"}
          </DropdownMenuItem>

          {/* Embed Code */}
          <Dialog open={embedDialogOpen} onOpenChange={setEmbedDialogOpen}>
            <DialogTrigger asChild>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  setEmbedDialogOpen(true);
                }}
                className="cursor-pointer"
              >
                <Code className="mr-2 h-4 w-4" />
                Get Embed Code
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Embed Code</DialogTitle>
                <DialogDescription>
                  Copy this code to embed this content on your website
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2">
                <Label htmlFor="embed-code">Embed Code</Label>
                <div className="flex gap-2">
                  <Input
                    id="embed-code"
                    value={embedCode}
                    readOnly
                    className="font-mono text-xs"
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => copyToClipboard(embedCode, setEmbedCopied)}
                  >
                    {embedCopied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {embedCopied && (
                  <p className="text-sm text-green-500">Copied to clipboard!</p>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
