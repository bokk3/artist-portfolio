"use client";

import { useState } from "react";
import { addTrack } from "@/app/actions/admin-music";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUpload } from "@/components/file-upload";
import { Plus, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

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
  const [waveformData, setWaveformData] = useState<string>("");
  const [trackNumber, setTrackNumber] = useState(defaultTrackNumber);

  const handleUploadComplete = (url: string, waveform?: string) => {
    console.log("AddTrackForm: Received upload URL:", url, "Waveform:", waveform ? "yes" : "no");
    setAudioUrl(url);
    if (waveform) {
      setWaveformData(waveform);
    }
    toast.success("Audio file ready! Fill in track details and click + to add.");
  };

  async function handleSubmit(formData: FormData) {
    formData.set("audio_url", audioUrl);
    formData.set("release_id", releaseId.toString());
    formData.set("artist", artist);
    if (waveformData) {
      formData.set("waveform_data", waveformData);
    }
    await addTrack(formData);
    // Reset form
    setAudioUrl("");
    setWaveformData("");
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
          onUploadComplete={handleUploadComplete}
        />
        {/* Debug: Check if type prop is being passed */}
        {console.log("AddTrackForm: Rendering FileUpload with type='audio'")}
        <input type="hidden" name="audio_url" value={audioUrl} required />
        {audioUrl && (
          <div className="mt-2 flex items-center gap-2 text-xs text-green-500">
            <CheckCircle2 className="h-3 w-3" />
            <span>Audio file ready</span>
          </div>
        )}
      </div>

      <div className="md:col-span-2">
        <Label htmlFor="duration" className="text-xs">
          Duration (secs) <span className="text-muted-foreground font-normal text-[10px]">(optional)</span>
        </Label>
        <Input
          id="duration"
          name="duration"
          type="number"
          placeholder="Auto"
          min="0"
        />
      </div>

      <div className="md:col-span-1">
        <Button 
          type="submit" 
          size="icon" 
          title={audioUrl ? "Add Track" : "Upload audio file first"} 
          disabled={!audioUrl}
          className={audioUrl ? "bg-green-500 hover:bg-green-600" : ""}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}

