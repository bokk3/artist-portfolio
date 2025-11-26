"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useDropzone, type Accept } from "react-dropzone";
import { Upload, X, Loader2, CheckCircle2, FileAudio } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { toast } from "sonner";
import { generateWaveformPeaks } from "@/lib/waveform";
import { motion } from "framer-motion";

interface FileUploadProps {
  type: "cover" | "audio" | "gallery" | "blog" | "press" | "misc";
  accept?: string;
  maxSize?: number;
  onUploadComplete?: (url: string, waveformData?: string) => void;
  currentUrl?: string;
  className?: string;
}

export function FileUpload({
  type,
  accept,
  maxSize = 25 * 1024 * 1024, // 25MB default
  onUploadComplete,
  currentUrl,
  className,
}: FileUploadProps) {
  console.log("🎵 FileUpload component rendered:", {
    type,
    accept,
    maxSize,
    isAudio: type === "audio",
    stackTrace: new Error().stack
  });
  // Set default accept based on type if not provided
  const effectiveAccept = accept || (type === "audio" ? "audio/*" : "image/*");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(
    currentUrl || null
  );
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const [fileSize, setFileSize] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [waveformData, setWaveformData] = useState<number[] | null>(null);
  const [generatingWaveform, setGeneratingWaveform] = useState(false);
  const waveformCanvasRef = useRef<HTMLCanvasElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) {
        console.log("No file provided");
        return;
      }

      console.log("onDrop called with file:", {
        name: file.name,
        type: file.type,
        size: file.size,
        uploadType: type
      });

      // Validate audio files by extension (primary) and MIME type (fallback)
      if (type === "audio") {
        // Handle files with or without extension, and handle multiple dots
        const fileName = file.name.toLowerCase();
        const lastDot = fileName.lastIndexOf('.');
        const ext = lastDot > 0 ? fileName.substring(lastDot + 1) : '';
        const audioExts = ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a'];
        const audioMimeTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/wave', 'audio/x-wav', 'audio/x-pn-wav', 'audio/ogg', 'audio/flac', 'audio/aac', 'audio/mp4', 'audio/x-m4a'];
        const isValidByExt = audioExts.includes(ext);
        const isValidByMime = file.type && (file.type.startsWith('audio/') || audioMimeTypes.includes(file.type));
        
        console.log("onDrop: Checking audio file:", {
          fileName: file.name,
          extension: ext,
          mimeType: file.type,
          validExtensions: audioExts,
          isValidByExt,
          isValidByMime,
          isValid: isValidByExt || isValidByMime
        });
        
        if (!isValidByExt && !isValidByMime) {
          console.error("onDrop: Invalid audio file:", {
            extension: ext,
            mimeType: file.type,
            fileName: file.name
          });
          toast.error(`Invalid file type: .${ext || 'no extension'}. Please upload an audio file (MP3, WAV, OGG, FLAC, AAC, M4A)`);
          return;
        }
        console.log("onDrop: Audio file validated successfully");
      }

      console.log("File validated, starting upload:", file.name, "Type:", file.type, "Size:", file.size, "bytes");
      setSelectedFile(file);
      setFileSize(file.size);

      // Create preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => setPreview(reader.result as string);
        reader.readAsDataURL(file);
      } else {
        // For non-image files (audio, etc.), set preview to file name
        setPreview(file.name);
      }

      setUploading(true);
      setUploadProgress(0);
      console.log("Starting upload...");

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", type);

        // Use XMLHttpRequest for progress tracking
        const xhr = new XMLHttpRequest();

        // Track upload progress
        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            const percentComplete = Math.round((e.loaded / e.total) * 100);
            setUploadProgress(percentComplete);
            console.log("Upload progress:", percentComplete + "%");
          }
        });

        // Handle completion
        const uploadPromise = new Promise<{ url: string; filename: string }>((resolve, reject) => {
          xhr.addEventListener("load", () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                const data = JSON.parse(xhr.responseText);
                console.log("Upload successful, response:", data);
                resolve({ url: data.url, filename: data.filename });
              } catch (e) {
                console.error("Failed to parse response:", xhr.responseText);
                reject(new Error("Invalid response from server"));
              }
            } else {
              try {
                const error = JSON.parse(xhr.responseText);
                console.error("Upload failed, server error:", error);
                reject(new Error(error.error || "Upload failed"));
              } catch {
                console.error("Upload failed, status:", xhr.status, "Response:", xhr.responseText);
                reject(new Error(`Upload failed with status ${xhr.status}`));
              }
            }
          });

          xhr.addEventListener("error", () => {
            reject(new Error("Network error during upload"));
          });

          xhr.addEventListener("abort", () => {
            reject(new Error("Upload cancelled"));
          });
        });

        xhr.open("POST", "/api/upload");
        xhr.send(formData);

        const result = await uploadPromise;
        console.log("Upload successful:", result.url);
        setUploadedUrl(result.url);
        setUploadProgress(100);
        
        // Generate waveform for audio files
        let waveformJson: string | undefined;
        if (type === "audio") {
          setGeneratingWaveform(true);
          try {
            console.log("Generating waveform for audio file...");
            const peaks = await generateWaveformPeaks(file, 512);
            setWaveformData(peaks);
            waveformJson = JSON.stringify(peaks);
            console.log("Waveform generated successfully:", peaks.length, "peaks");
            toast.success("Waveform generated!", {
              description: "Audio file ready with waveform preview",
              duration: 3000,
            });
          } catch (error) {
            console.error("Failed to generate waveform:", error);
            toast.error("Waveform generation failed", {
              description: "Audio uploaded but waveform couldn't be generated",
              duration: 3000,
            });
          } finally {
            setGeneratingWaveform(false);
          }
        }
        
        toast.success("File uploaded successfully!", {
          description: `${file.name} (${formatFileSize(file.size)})`,
          duration: 5000,
        });
        console.log("Calling onUploadComplete with:", result.url, waveformJson);
        onUploadComplete?.(result.url, waveformJson);
        console.log("onUploadComplete called");
      } catch (error) {
        console.error("Upload error:", error);
        toast.error(error instanceof Error ? error.message : "Upload failed");
        setPreview(null);
        setUploadProgress(0);
      } finally {
        setUploading(false);
        // Reset progress after a short delay to show completion
        setTimeout(() => setUploadProgress(0), 2000);
      }
    },
    [type, onUploadComplete]
  );

  // Format accept prop for react-dropzone
  const getAcceptConfig = (): Accept | undefined => {
    if (!effectiveAccept) return undefined;
    
    if (effectiveAccept === "audio/*" || effectiveAccept.includes("audio") || type === "audio") {
      return {
        "audio/*": [".mp3", ".wav", ".ogg", ".flac", ".aac", ".m4a"],
        "audio/mpeg": [".mp3"],
        "audio/mp3": [".mp3"],
        "audio/wav": [".wav"],
        "audio/wave": [".wav"],
        "audio/x-wav": [".wav"],
        "audio/ogg": [".ogg"],
        "audio/flac": [".flac"],
        "audio/aac": [".aac"],
        "audio/mp4": [".m4a"],
        "audio/x-m4a": [".m4a"],
      };
    }
    
    if (effectiveAccept === "image/*" || effectiveAccept.includes("image")) {
      return {
        "image/*": [".jpg", ".jpeg", ".png", ".webp", ".gif"],
        "image/jpeg": [".jpg", ".jpeg"],
        "image/png": [".png"],
        "image/webp": [".webp"],
        "image/gif": [".gif"],
      };
    }
    
    // Fallback to original format
    return { [effectiveAccept]: [] };
  };

  // For audio files, use a completely separate native file input
  // For other types, use react-dropzone
  const acceptConfig: Accept | undefined = type === "audio" 
    ? undefined // Not used for audio
    : getAcceptConfig();

  const handleDropAccepted = useCallback((acceptedFiles: File[]) => {
    onDrop(acceptedFiles);
  }, [onDrop]);

  const handleDropRejected = useCallback((rejectedFiles: any[]) => {
    rejectedFiles.forEach(({ file, errors }) => {
      errors.forEach((error: any) => {
        if (error.code === "file-too-large") {
          toast.error(`File too large. Maximum size is ${Math.round(maxSize / 1024 / 1024)}MB`);
        } else if (error.code === "file-invalid-type") {
          if (type === "audio") {
            toast.error(`Invalid file type. Please upload an audio file (MP3, WAV, OGG, FLAC, AAC, M4A)`);
          } else {
            toast.error(`Invalid file type. Please upload an image`);
          }
        } else {
          toast.error(`Upload error: ${error.message}`);
        }
      });
    });
  }, [type, maxSize]);

  // Only use react-dropzone for non-audio files
  // For audio, we use a native file input completely separate from react-dropzone
  const dropzoneForImages = type !== "audio" ? useDropzone({
    onDropAccepted: handleDropAccepted,
    onDropRejected: handleDropRejected,
    accept: acceptConfig,
    maxSize,
    multiple: false,
    disabled: uploading,
  }) : null;

  const { getRootProps, getInputProps, isDragActive } = type === "audio" 
    ? { 
        getRootProps: () => ({}), 
        getInputProps: () => ({}), 
        isDragActive: false 
      }
    : dropzoneForImages!;

  const removeFile = () => {
    setUploadedUrl(null);
    setPreview(null);
    setFileSize(null);
    setUploadProgress(0);
    setSelectedFile(null);
    setWaveformData(null);
    onUploadComplete?.("");
  };

  // Render waveform on canvas
  useEffect(() => {
    if (waveformData && waveformCanvasRef.current && type === "audio") {
      const canvas = waveformCanvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;
      const barWidth = 2;
      const barGap = 1;
      const bars = waveformData.length;
      const totalBarWidth = barWidth + barGap;
      const maxBars = Math.floor(width / totalBarWidth);
      const step = Math.max(1, Math.floor(bars / maxBars));

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#ff10f0"; // Primary color

      for (let i = 0; i < maxBars; i++) {
        const index = Math.min(i * step, bars - 1);
        const peak = waveformData[index];
        const barHeight = Math.max(2, peak * height * 0.8);
        const x = i * totalBarWidth;
        const y = (height - barHeight) / 2;

        ctx.fillRect(x, y, barWidth, barHeight);
      }
    }
  }, [waveformData, type]);

  const isImagePreview = preview && (
    preview.startsWith("data:image") || 
    preview.match(/\.(jpg|jpeg|png|gif|webp)$/i)
  );

  return (
    <div className={className}>
      {uploadedUrl && preview ? (
        <div className="relative">
          {isImagePreview ? (
            <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
              <Image
                src={preview}
                alt="Upload preview"
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className={cn(
              "p-4 border-2 rounded-lg transition-all",
              uploadedUrl 
                ? "border-green-500/50 bg-green-500/10" 
                : "border-border bg-muted/50"
            )}>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {uploadedUrl ? (
                      <div className="relative">
                        <CheckCircle2 className="h-10 w-10 text-green-500" />
                        <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
                      </div>
                    ) : (
                      <FileAudio className="h-8 w-8 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate flex items-center gap-2">
                      {preview}
                      {uploadedUrl && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-500/20 text-green-600 dark:text-green-400">
                          <CheckCircle2 className="h-3 w-3" />
                          Uploaded
                        </span>
                      )}
                    </p>
                    {uploadedUrl && (
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1 font-medium">
                        ✓ Ready to add track
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground truncate mt-1">{uploadedUrl}</p>
                    {fileSize && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatFileSize(fileSize)}
                      </p>
                    )}
                  </div>
                </div>
                {/* Waveform Preview */}
                {type === "audio" && (
                  <div className="space-y-2">
                    {generatingWaveform ? (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        <span>Generating waveform...</span>
                      </div>
                    ) : waveformData ? (
                      <div className="w-full">
                        <canvas
                          ref={waveformCanvasRef}
                          width={400}
                          height={60}
                          className="w-full h-[60px] rounded bg-muted/50"
                        />
                        <p className="text-xs text-muted-foreground mt-1 text-center">
                          Waveform preview
                        </p>
                      </div>
                    ) : uploadedUrl && (
                      <div className="h-[60px] rounded bg-muted/30 flex items-center justify-center">
                        <p className="text-xs text-muted-foreground">No waveform data</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
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
          {...(type === "audio" ? {
            onClick: (e: React.MouseEvent) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("Click handler fired, looking for audio-file-input");
              const input = document.getElementById("audio-file-input");
              console.log("Found input element:", input);
              if (input) {
                console.log("Clicking input element");
                input.click();
              } else {
                console.error("audio-file-input not found!");
              }
            },
            onDragOver: (e: React.DragEvent) => {
              e.preventDefault();
              e.stopPropagation();
            },
            onDragEnter: (e: React.DragEvent) => {
              e.preventDefault();
              e.stopPropagation();
            },
            onDrop: (e: React.DragEvent) => {
              e.preventDefault();
              e.stopPropagation();
              const files = Array.from(e.dataTransfer.files);
              if (files.length > 0) {
                // Validate by extension and MIME type before calling onDrop
                const file = files[0];
                const fileName = file.name.toLowerCase();
                const lastDot = fileName.lastIndexOf('.');
                const ext = lastDot > 0 ? fileName.substring(lastDot + 1) : '';
                const audioExts = ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a'];
                const audioMimeTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/wave', 'audio/x-wav', 'audio/x-pn-wav', 'audio/ogg', 'audio/flac', 'audio/aac', 'audio/mp4', 'audio/x-m4a'];
                const isValidByExt = audioExts.includes(ext);
                const isValidByMime = file.type && (file.type.startsWith('audio/') || audioMimeTypes.includes(file.type));
                
                console.log("Drag & drop: Audio file validation:", {
                  fileName: file.name,
                  extension: ext,
                  mimeType: file.type,
                  isValidByExt,
                  isValidByMime,
                  isValid: isValidByExt || isValidByMime
                });
                
                if (isValidByExt || isValidByMime) {
                  onDrop([file]);
                } else {
                  console.error("Drag & drop: Invalid audio file:", {
                    extension: ext,
                    mimeType: file.type,
                    fileName: file.name
                  });
                  toast.error(`Invalid file type: .${ext || 'no extension'}. Please upload an audio file (MP3, WAV, OGG, FLAC, AAC, M4A)`);
                }
              }
            }
          } : getRootProps())}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
            uploading 
              ? "border-primary bg-primary/10 cursor-wait"
              : isDragActive || (type === "audio")
              ? "border-primary bg-primary/5 cursor-pointer"
              : "border-border hover:border-primary/50 cursor-pointer"
          )}
        >
          {type === "audio" ? (
            <input
              type="file"
              disabled={uploading}
              ref={(input) => {
                if (input) {
                  console.log("🎵 Audio file input element mounted:", input);
                  console.log("Input accept attribute:", input.accept);
                  console.log("Input disabled:", input.disabled);
                  console.log("Input id:", input.id);
                }
              }}
              onChange={(e) => {
                  console.log("=== AUDIO FILE INPUT onChange FIRED ===");
                  console.log("Event:", e);
                  console.log("Event target:", e.target);
                  console.log("Files:", e.target.files);
                  console.log("Files length:", e.target.files?.length);
                  const files = e.target.files;
                  if (files && files.length > 0) {
                    const file = files[0];
                    console.log("Audio file selected:", {
                      name: file.name,
                      type: file.type,
                      size: file.size,
                      lastModified: file.lastModified
                    });
                    // Validate by extension (primary) and MIME type (fallback)
                    // Handle files with or without extension, and handle multiple dots
                    const fileName = file.name.toLowerCase();
                    const lastDot = fileName.lastIndexOf('.');
                    const ext = lastDot > 0 ? fileName.substring(lastDot + 1) : '';
                    const audioExts = ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a'];
                    const audioMimeTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/wave', 'audio/x-wav', 'audio/x-pn-wav', 'audio/ogg', 'audio/flac', 'audio/aac', 'audio/mp4', 'audio/x-m4a'];
                    const isValidByExt = audioExts.includes(ext);
                    const isValidByMime = file.type && (file.type.startsWith('audio/') || audioMimeTypes.includes(file.type));
                    
                    console.log("Audio file validation:", {
                      fileName: file.name,
                      extension: ext,
                      mimeType: file.type,
                      size: file.size,
                      isValidByExt,
                      isValidByMime,
                      isValid: isValidByExt || isValidByMime
                    });
                    
                    if (isValidByExt || isValidByMime) {
                      console.log("✅ Audio file validated, calling onDrop");
                      onDrop([file]);
                    } else {
                      console.error("❌ Invalid audio file:", {
                        extension: ext,
                        mimeType: file.type,
                        fileName: file.name
                      });
                      toast.error(`Invalid file type: .${ext || 'no extension'}. Please upload an audio file (MP3, WAV, OGG, FLAC, AAC, M4A)`);
                      e.target.value = ''; // Reset input
                    }
                  } else {
                    console.warn("No files in onChange event");
                  }
                }}
              className="hidden"
              id="audio-file-input"
            />
          ) : (
            <input {...getInputProps()} disabled={uploading} />
          )}
          {uploading ? (
            <div className="flex flex-col items-center gap-4 w-full">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <div className="w-full max-w-xs space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Uploading...</span>
                  <span className="font-bold text-primary text-lg">{uploadProgress}%</span>
                </div>
                <div className="w-full h-3 bg-muted rounded-full overflow-hidden shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-purple-500 transition-all duration-300 ease-out rounded-full shadow-lg"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                {fileSize && (
                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <span>{formatFileSize(fileSize)}</span>
                    <span>•</span>
                    <span>{Math.round((uploadProgress / 100) * fileSize / 1024)} KB uploaded</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              {type === "audio" ? (
                <span className="text-4xl">🎵</span>
              ) : (
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Upload className="h-10 w-10 text-primary" />
              </motion.div>
              )}
              <div className="flex flex-col items-center gap-1">
                <p className="text-base font-semibold text-foreground">
                  {isDragActive
                    ? "Drop file here"
                    : type === "audio"
                    ? "Click to upload audio or drag and drop"
                    : "Click to upload or drag and drop"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {type === "audio" ? "MP3, WAV, OGG, FLAC, AAC, M4A • " : ""}Max {Math.round(maxSize / 1024 / 1024)}MB
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
