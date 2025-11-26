"use client";

import { useState, useEffect } from "react";
import { createRelease } from "@/app/actions/admin-music";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload } from "@/components/file-upload";
import { FlowGuide } from "@/components/flow-guide";
import Link from "next/link";
import { ChevronLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function NewReleasePage() {
  const [coverUrl, setCoverUrl] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    type: "album",
    release_date: "",
    description: "",
  });

  // Determine current step based on form completion
  useEffect(() => {
    if (!formData.title || !formData.artist) {
      setCurrentStep(1);
    } else if (!formData.type || !formData.release_date) {
      setCurrentStep(2);
    } else if (!coverUrl) {
      setCurrentStep(3);
    } else {
      setCurrentStep(4);
    }
  }, [formData, coverUrl]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/music">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-display font-bold">Add New Release</h1>
      </div>

      {/* Step Indicator */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <FlowGuide
              step={1}
              totalSteps={4}
              currentStep={currentStep}
              label="Basic Info"
              completed={currentStep > 1}
            />
            <FlowGuide
              step={2}
              totalSteps={4}
              currentStep={currentStep}
              label="Type & Date"
              completed={currentStep > 2}
            />
            <FlowGuide
              step={3}
              totalSteps={4}
              currentStep={currentStep}
              label="Cover Image"
              completed={currentStep > 3}
            />
            <FlowGuide
              step={4}
              totalSteps={4}
              currentStep={currentStep}
              label="Submit"
              showArrow={false}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Release Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createRelease} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 relative">
                <Label htmlFor="title" className="flex items-center gap-2">
                  Title
                  {currentStep === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-1 text-primary"
                    >
                      <ArrowRight className="h-4 w-4 animate-pulse" />
                      <span className="text-xs font-medium">Start here</span>
                    </motion.div>
                  )}
                </Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Album Title"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={currentStep === 1 ? "ring-2 ring-primary focus:ring-primary" : ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="artist">Artist</Label>
                <Input
                  id="artist"
                  name="artist"
                  placeholder="Artist Name"
                  required
                  value={formData.artist}
                  onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                  className={currentStep === 1 ? "ring-2 ring-primary focus:ring-primary" : ""}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 relative">
                <Label htmlFor="type" className="flex items-center gap-2">
                  Type
                  {currentStep === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-1 text-primary"
                    >
                      <ArrowRight className="h-4 w-4 animate-pulse" />
                      <span className="text-xs font-medium">Next step</span>
                    </motion.div>
                  )}
                </Label>
                <Select
                  name="type"
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger className={currentStep === 2 ? "ring-2 ring-primary focus:ring-primary" : ""}>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="album">Album</SelectItem>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="ep">EP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="release_date">Release Date</Label>
                <Input
                  id="release_date"
                  name="release_date"
                  type="date"
                  required
                  value={formData.release_date}
                  onChange={(e) => setFormData({ ...formData, release_date: e.target.value })}
                  className={currentStep === 2 ? "ring-2 ring-primary focus:ring-primary" : ""}
                />
              </div>
            </div>

            <div className="space-y-2 relative">
              <Label className="flex items-center gap-2">
                Cover Image
                {currentStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-1 text-primary"
                  >
                    <ArrowRight className="h-4 w-4 animate-pulse" />
                    <span className="text-xs font-medium">Upload now</span>
                  </motion.div>
                )}
              </Label>
              <div className={currentStep === 3 ? "ring-2 ring-primary rounded-lg p-2" : ""}>
                <FileUpload
                  type="cover"
                  accept="image/*"
                  onUploadComplete={setCoverUrl}
                />
              </div>
              <input type="hidden" name="cover_image_url" value={coverUrl} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="About this release..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="pt-4 flex flex-col sm:flex-row justify-end gap-3 relative">
              {currentStep === 4 && coverUrl && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -top-12 right-0 flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-lg px-4 py-2"
                >
                  <ArrowRight className="h-5 w-5 text-primary animate-pulse" />
                  <span className="text-sm font-medium text-primary">Ready to submit!</span>
                </motion.div>
              )}
              <Link href="/admin/music" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto">Cancel</Button>
              </Link>
              <Button
                type="submit"
                className={cn(
                  "w-full sm:w-auto min-h-[48px] font-semibold shadow-lg transition-all",
                  currentStep === 4 && coverUrl
                    ? "bg-primary hover:bg-primary/90 shadow-primary/50 scale-105"
                    : "bg-primary/70 hover:bg-primary/80"
                )}
                disabled={!coverUrl || !formData.title || !formData.artist}
              >
                {currentStep === 4 ? (
                  <motion.span
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="flex items-center gap-2"
                  >
                    Create Release
                    <ArrowRight className="h-5 w-5" />
                  </motion.span>
                ) : (
                  "Create Release"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
