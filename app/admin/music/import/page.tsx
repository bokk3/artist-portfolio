"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Music, AlertCircle, CheckCircle2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface SoundCloudTrack {
  title: string;
  artist: string;
  duration: number;
  artwork_url?: string;
  stream_url?: string;
  permalink_url: string;
}

export default function SoundCloudImportPage() {
  const [soundcloudUrl, setSoundcloudUrl] = useState("");
  const [importing, setImporting] = useState(false);
  const [tracks, setTracks] = useState<SoundCloudTrack[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Extract SoundCloud track ID or permalink from URL
  const extractTrackId = (url: string): string | null => {
    // Handle various SoundCloud URL formats:
    // https://soundcloud.com/user/track-name
    // https://soundcloud.com/user/track-name/s-xyz123
    const match = url.match(/soundcloud\.com\/[^\/]+\/([^\/\?]+)/);
    return match ? match[1] : null;
  };

  const fetchSoundCloudTrack = async (url: string): Promise<SoundCloudTrack | null> => {
    try {
      // Note: SoundCloud's official API requires OAuth and has rate limits
      // For a simpler approach, we'll use a proxy or direct parsing
      // This is a basic implementation - you may need to use a service like
      // soundcloud-downloader or implement OAuth for full API access
      
      const trackId = extractTrackId(url);
      if (!trackId) {
        throw new Error("Invalid SoundCloud URL format");
      }

      // Using a public SoundCloud oEmbed endpoint
      const oembedUrl = `https://soundcloud.com/oembed?url=${encodeURIComponent(url)}&format=json`;
      const response = await fetch(oembedUrl);
      
      if (!response.ok) {
        throw new Error("Failed to fetch track information");
      }

      const data = await response.json();
      
      // Parse HTML to extract metadata
      const html = data.html;
      const titleMatch = html.match(/title="([^"]+)"/);
      const title = titleMatch ? titleMatch[1] : data.title || "Unknown Track";
      
      // Extract artist from title (format: "Artist - Track Name")
      const parts = title.split(" - ");
      const artist = parts.length > 1 ? parts[0].trim() : "Unknown Artist";
      const trackTitle = parts.length > 1 ? parts.slice(1).join(" - ").trim() : title;

      return {
        title: trackTitle,
        artist: artist,
        duration: 0, // oEmbed doesn't provide duration
        permalink_url: url,
      };
    } catch (error) {
      console.error("Error fetching SoundCloud track:", error);
      throw error;
    }
  };

  const handleImport = async () => {
    if (!soundcloudUrl.trim()) {
      setError("Please enter a SoundCloud URL");
      return;
    }

    setImporting(true);
    setError(null);

    try {
      const track = await fetchSoundCloudTrack(soundcloudUrl);
      if (track) {
        setTracks([...tracks, track]);
        setSoundcloudUrl("");
        toast.success("Track information fetched! Add release details below.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to import track. Make sure the URL is valid.");
      toast.error("Import failed", {
        description: err.message || "Please check the URL and try again.",
      });
    } finally {
      setImporting(false);
    }
  };

  const handleBulkImport = async () => {
    // For bulk import, user can paste multiple URLs (one per line)
    const urls = soundcloudUrl
      .split("\n")
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    if (urls.length === 0) {
      setError("Please enter at least one SoundCloud URL");
      return;
    }

    setImporting(true);
    setError(null);
    const importedTracks: SoundCloudTrack[] = [];

    for (const url of urls) {
      try {
        const track = await fetchSoundCloudTrack(url);
        if (track) {
          importedTracks.push(track);
        }
      } catch (err) {
        console.error(`Failed to import ${url}:`, err);
      }
    }

    if (importedTracks.length > 0) {
      setTracks([...tracks, ...importedTracks]);
      setSoundcloudUrl("");
      toast.success(`Imported ${importedTracks.length} track(s)!`);
    } else {
      setError("No tracks were imported. Please check your URLs.");
    }

    setImporting(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold mb-2">Import from SoundCloud</h1>
        <p className="text-muted-foreground">
          Import your tracks from SoundCloud. Paste SoundCloud track URLs to fetch metadata.
        </p>
        <Alert className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Note:</strong> This tool fetches track metadata. You'll need to manually upload audio files 
            or use a SoundCloud downloader service. For bulk imports, paste multiple URLs (one per line).
          </AlertDescription>
        </Alert>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Import Tracks</CardTitle>
          <CardDescription>
            Enter SoundCloud track URLs (one per line for bulk import)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="soundcloud-url">SoundCloud URL(s)</Label>
            <Textarea
              id="soundcloud-url"
              placeholder="https://soundcloud.com/your-username/track-name&#10;https://soundcloud.com/your-username/another-track"
              value={soundcloudUrl}
              onChange={(e) => setSoundcloudUrl(e.target.value)}
              rows={5}
              disabled={importing}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            <Button
              onClick={handleImport}
              disabled={importing || !soundcloudUrl.trim()}
            >
              {importing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Music className="mr-2 h-4 w-4" />
                  Import Single Track
                </>
              )}
            </Button>
            <Button
              onClick={handleBulkImport}
              disabled={importing || !soundcloudUrl.trim()}
              variant="outline"
            >
              {importing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                "Bulk Import"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {tracks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Imported Tracks ({tracks.length})</CardTitle>
            <CardDescription>
              Review imported tracks and create releases for them
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tracks.map((track, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <h3 className="font-bold">{track.title}</h3>
                    <p className="text-sm text-muted-foreground">{track.artist}</p>
                    <a
                      href={track.permalink_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
                    >
                      View on SoundCloud <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <Link href="/admin/music/new">
                    <Button size="sm" variant="outline">
                      Create Release
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Manual Import Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            <strong>Option 1: Use SoundCloud Downloader Tools</strong>
          </p>
          <p>
            Use tools like <code>youtube-dl</code> or <code>yt-dlp</code> to download audio files:
          </p>
          <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">
            yt-dlp -x --audio-format mp3 SOUNDCLOUD_URL
          </pre>
          <p className="mt-4">
            <strong>Option 2: Download Manually</strong>
          </p>
          <p>
            Download tracks from SoundCloud using browser extensions or online tools, then upload them 
            using the regular track upload form.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

