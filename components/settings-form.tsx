"use client";

import { useState, useTransition } from "react";
import { updateSettings } from "@/app/actions/admin-settings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/file-upload";
import { toast } from "sonner";

interface SettingsFormProps {
  initialSettings: Record<string, string>;
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [isPending, startTransition] = useTransition();
  const [heroImageUrl, setHeroImageUrl] = useState(
    initialSettings.hero_image || ""
  );
  const [siteTitle, setSiteTitle] = useState(
    initialSettings.site_title || "Artist Portfolio"
  );
  const [siteDescription, setSiteDescription] = useState(
    initialSettings.site_description || ""
  );
  const [contactEmail, setContactEmail] = useState(
    initialSettings.contact_email || ""
  );
  const [instagramUrl, setInstagramUrl] = useState(
    initialSettings.instagram_url || ""
  );
  const [twitterUrl, setTwitterUrl] = useState(
    initialSettings.twitter_url || ""
  );
  const [facebookUrl, setFacebookUrl] = useState(
    initialSettings.facebook_url || ""
  );
  const [youtubeUrl, setYoutubeUrl] = useState(
    initialSettings.youtube_url || ""
  );

  const handleSaveHeroImage = () => {
    startTransition(async () => {
      const result = await updateSettings({
        hero_image: heroImageUrl,
      });
      if (result.success) {
        toast.success("Hero image updated successfully");
      } else {
        toast.error(result.error || "Failed to update hero image");
      }
    });
  };

  const handleSaveSiteInfo = () => {
    startTransition(async () => {
      const result = await updateSettings({
        site_title: siteTitle,
        site_description: siteDescription,
      });
      if (result.success) {
        toast.success("Site information updated successfully");
      } else {
        toast.error(result.error || "Failed to update site information");
      }
    });
  };

  const handleSaveSocialLinks = () => {
    startTransition(async () => {
      const result = await updateSettings({
        instagram_url: instagramUrl,
        twitter_url: twitterUrl,
        facebook_url: facebookUrl,
        youtube_url: youtubeUrl,
      });
      if (result.success) {
        toast.success("Social links updated successfully");
      } else {
        toast.error(result.error || "Failed to update social links");
      }
    });
  };

  const handleSaveContactInfo = () => {
    startTransition(async () => {
      const result = await updateSettings({
        contact_email: contactEmail,
      });
      if (result.success) {
        toast.success("Contact information updated successfully");
      } else {
        toast.error(result.error || "Failed to update contact information");
      }
    });
  };

  return (
    <>
      <Card className="border-border/10">
        <CardHeader>
          <CardTitle>Hero Image</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Background Image</Label>
            <p className="text-sm text-muted-foreground">
              Upload a custom hero/background image for the homepage. If not
              set, the latest release cover will be used.
            </p>
            <FileUpload
              type="cover"
              accept="image/*"
              onUploadComplete={setHeroImageUrl}
              currentUrl={heroImageUrl}
            />
            <input type="hidden" value={heroImageUrl} />
          </div>
          <Button onClick={handleSaveHeroImage} disabled={isPending}>
            {isPending ? "Saving..." : "Save Hero Image"}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border/10">
        <CardHeader>
          <CardTitle>Site Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="site-name">Site Name</Label>
            <Input
              id="site-name"
              value={siteTitle}
              onChange={(e) => setSiteTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="site-description">Site Description</Label>
            <Textarea
              id="site-description"
              value={siteDescription}
              onChange={(e) => setSiteDescription(e.target.value)}
              rows={3}
            />
          </div>
          <Button onClick={handleSaveSiteInfo} disabled={isPending}>
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border/10">
        <CardHeader>
          <CardTitle>Social Media Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram URL</Label>
            <Input
              id="instagram"
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
              placeholder="https://instagram.com/username"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="twitter">Twitter/X URL</Label>
            <Input
              id="twitter"
              value={twitterUrl}
              onChange={(e) => setTwitterUrl(e.target.value)}
              placeholder="https://twitter.com/username"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="facebook">Facebook URL</Label>
            <Input
              id="facebook"
              value={facebookUrl}
              onChange={(e) => setFacebookUrl(e.target.value)}
              placeholder="https://facebook.com/username"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="youtube">YouTube URL</Label>
            <Input
              id="youtube"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://youtube.com/@username"
            />
          </div>
          <Button onClick={handleSaveSocialLinks} disabled={isPending}>
            {isPending ? "Saving..." : "Save Social Links"}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border/10">
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Contact Email</Label>
            <Input
              id="email"
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
            />
          </div>
          <Button onClick={handleSaveContactInfo} disabled={isPending}>
            {isPending ? "Saving..." : "Save Contact Info"}
          </Button>
        </CardContent>
      </Card>
    </>
  );
}

