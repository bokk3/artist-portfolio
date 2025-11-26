import db from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/file-upload";
import { SettingsForm } from "@/components/settings-form";
import { getAllSettings } from "@/app/actions/admin-settings";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getAllSettings();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-display font-bold">Settings</h1>

      <SettingsForm initialSettings={settings} />
    </div>
  );
}
