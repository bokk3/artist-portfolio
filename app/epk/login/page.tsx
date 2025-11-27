"use client";

import { loginToEpk } from "@/app/actions/epk";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Verifying..." : "Access EPK"}
    </Button>
  );
}

export default function EpkLoginPage() {
  async function clientAction(formData: FormData) {
    const result = await loginToEpk(formData);
    if (result?.error) {
      toast.error(result.error);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 glass-card">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-display font-bold mb-2">
            Electronic Press Kit
          </h1>
          <p className="text-muted-foreground">
            Please enter the password to access press assets.
          </p>
        </div>

        <form action={clientAction} className="space-y-4">
          <div>
            <Input
              type="password"
              name="password"
              placeholder="Enter password"
              required
              className="bg-background/50 text-center text-lg tracking-widest"
            />
          </div>
          <SubmitButton />
        </form>

        <p className="text-xs text-center text-muted-foreground mt-6">
          For access, please contact management.
        </p>
      </Card>
    </div>
  );
}
