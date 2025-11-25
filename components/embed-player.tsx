"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Code, Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface EmbedPlayerProps {
  trackId?: number;
  releaseId?: number;
  title?: string;
  variant?: "button" | "icon";
}

export function EmbedPlayer({
  trackId,
  releaseId,
  title = "Track",
  variant = "button",
}: EmbedPlayerProps) {
  const [copied, setCopied] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const siteUrl =
    typeof window !== "undefined" ? window.location.origin : "";
  
  let embedUrl = "";
  let embedCode = "";

  if (trackId) {
    embedUrl = `${siteUrl}/embed/track/${trackId}`;
    embedCode = `<iframe src="${embedUrl}" width="100%" height="400" frameborder="0" allow="autoplay" style="border-radius: 8px;"></iframe>`;
  } else if (releaseId) {
    embedUrl = `${siteUrl}/embed/release/${releaseId}`;
    embedCode = `<iframe src="${embedUrl}" width="100%" height="600" frameborder="0" allow="autoplay" style="border-radius: 8px;"></iframe>`;
  }

  const copyEmbedCode = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      toast.success("Embed code copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy embed code");
    }
  };

  if (!trackId && !releaseId) {
    return null;
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        {variant === "icon" ? (
          <Button variant="ghost" size="icon" title="Get embed code">
            <Code className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="outline" size="sm">
            <Code className="mr-2 h-4 w-4" />
            Embed
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Embed {title}</DialogTitle>
          <DialogDescription>
            Copy this code to embed this content on your website
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
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
                onClick={copyEmbedCode}
                title="Copy embed code"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Preview</Label>
            <div className="border rounded-lg p-4 bg-muted/50">
              <iframe
                src={embedUrl}
                width="100%"
                height={releaseId ? "600" : "400"}
                frameBorder="0"
                allow="autoplay"
                style={{ borderRadius: "8px" }}
                className="w-full"
              />
            </div>
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <p>
              <strong>Note:</strong> The embed player will show the full track or release
              with play controls.
            </p>
            <p>
              You can customize the width and height by modifying the iframe attributes.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

