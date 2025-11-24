"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { toast } from "sonner";

interface FileUploadProps {
  type: "cover" | "audio" | "gallery" | "blog" | "press" | "misc";
  accept?: string;
  maxSize?: number;
  onUploadComplete?: (url: string) => void;
  currentUrl?: string;
  className?: string;
}

export function FileUpload({
  type,
  accept = "image/*",
  maxSize = 10 * 1024 * 1024, // 10MB default
  onUploadComplete,
  currentUrl,
  className,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(
    currentUrl || null
  );
  const [preview, setPreview] = useState<string | null>(currentUrl || null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      // Create preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => setPreview(reader.result as string);
        reader.readAsDataURL(file);
      }

      setUploading(true);

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", type);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Upload failed");
        }

        setUploadedUrl(data.url);
        toast.success("File uploaded successfully!");
        onUploadComplete?.(data.url);
      } catch (error) {
        console.error("Upload error:", error);
        toast.error(error instanceof Error ? error.message : "Upload failed");
        setPreview(null);
      } finally {
        setUploading(false);
      }
    },
    [type, onUploadComplete]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept ? { [accept]: [] } : undefined,
    maxSize,
    multiple: false,
    disabled: uploading,
  });

  const removeFile = () => {
    setUploadedUrl(null);
    setPreview(null);
    onUploadComplete?.("");
  };

  return (
    <div className={className}>
      {uploadedUrl && preview ? (
        <div className="relative">
          {preview.match(/\.(jpg|jpeg|png|gif|webp)$/i) ||
          preview.startsWith("data:image") ? (
            <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
              <Image
                src={preview}
                alt="Upload preview"
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="p-4 border border-border rounded-lg bg-muted">
              <p className="text-sm">📎 {uploadedUrl}</p>
            </div>
          )}
          <button
            type="button"
            onClick={removeFile}
            className="absolute top-2 right-2 p-1 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            <X className="h-4 w-4" />
          </button>
          <input type="hidden" value={uploadedUrl} />
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50",
            uploading && "opacity-50 cursor-not-allowed"
          )}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm font-medium">
                {isDragActive
                  ? "Drop file here"
                  : "Click to upload or drag and drop"}
              </p>
              <p className="text-xs text-muted-foreground">
                Max {maxSize / 1024 / 1024}MB
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
