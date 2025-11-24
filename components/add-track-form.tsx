"use client";

import { useState } from "react";
import { addTrack } from "@/app/actions/admin-music";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUpload } from "@/components/file-upload";
import { Plus } from "lucide-react";

interface AddTrackFormProps {
  releaseId: number;
  artist: string;
  defaultTrackNumber: number;
}

export function AddTrackForm({
  releaseId,
  artist,
  defaultTrackNumber,
}: AddTrackFormProps) {
  const [audioUrl, setAudioUrl] = useState("");
  const [trackNumber, setTrackNumber] = useState(defaultTrackNumber);

  async function handleSubmit(formData: FormData) {
    formData.set("audio_url", audioUrl);
    formData.set("release_id", releaseId.toString());
    formData.set("artist", artist);
    await addTrack(formData);
    // Reset form
    setAudioUrl("");
    setTrackNumber((prev) => prev + 1);
  }

  return (
    <form
      action={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end border-b border-border/10 pb-6"
    >
      <div className="md:col-span-1">
        <Label htmlFor="track_number" className="text-xs">
          #
        </Label>
        <Input
          id="track_number"
          name="track_number"
          type="number"
          value={trackNumber}
          onChange={(e) => setTrackNumber(parseInt(e.target.value) || 1)}
        />
      </div>

      <div className="md:col-span-4">
        <Label htmlFor="title" className="text-xs">
          Title
        </Label>
        <Input
          id="title"
          name="title"
          placeholder="Track Title"
          required
        />
      </div>

      <div className="md:col-span-4">
        <Label htmlFor="audio_url" className="text-xs">
          Audio File
        </Label>
        <FileUpload
          type="audio"
          accept="audio/*"
          maxSize={25 * 1024 * 1024}
          onUploadComplete={setAudioUrl}
        />
        <input type="hidden" name="audio_url" value={audioUrl} required />
      </div>

      <div className="md:col-span-2">
        <Label htmlFor="duration" className="text-xs">
          Secs
        </Label>
        <Input
          id="duration"
          name="duration"
          type="number"
          placeholder="180"
        />
      </div>

      <div className="md:col-span-1">
        <Button type="submit" size="icon" title="Add Track" disabled={!audioUrl}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}

