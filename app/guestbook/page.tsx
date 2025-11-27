"use client";

import { useState, useRef } from "react";
import { useFormStatus } from "react-dom";
import {
  submitGuestbookEntry,
  getGuestbookEntries,
} from "@/app/actions/guestbook";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { SectionWrapper } from "@/components/section-wrapper";
import { toast } from "sonner";
import { MessageSquare, User } from "lucide-react";
import { useEffect } from "react";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Signing..." : "Sign Guestbook"}
    </Button>
  );
}

export default function GuestbookPage() {
  const [entries, setEntries] = useState<any[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    async function fetchEntries() {
      const data = await getGuestbookEntries();
      setEntries(data);
    }
    fetchEntries();
  }, []);

  async function clientAction(formData: FormData) {
    const result = await submitGuestbookEntry(formData);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Thanks for signing! Your message is pending approval.");
      formRef.current?.reset();
    }
  }

  return (
    <div className="min-h-screen pt-20">
      <SectionWrapper>
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Guestbook
          </h1>
          <p className="text-muted-foreground text-lg">
            Leave a message for the community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Sign Form */}
          <div>
            <Card className="p-6 glass-card">
              <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-primary" />
                Sign the Guestbook
              </h2>
              <form ref={formRef} action={clientAction} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-2"
                  >
                    Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Your name"
                    required
                    minLength={2}
                    className="bg-background/50"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium mb-2"
                  >
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Leave a message..."
                    required
                    minLength={5}
                    className="bg-background/50 min-h-[120px]"
                  />
                </div>
                <SubmitButton />
              </form>
            </Card>
          </div>

          {/* Entries List */}
          <div className="space-y-6">
            <h2 className="text-2xl font-display font-bold mb-6">
              Recent Messages
            </h2>
            {entries.length === 0 ? (
              <p className="text-muted-foreground italic">
                No messages yet. Be the first to sign!
              </p>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {entries.map((entry) => (
                  <Card key={entry.id} className="p-4 glass-card">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold">{entry.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(entry.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-sm">
                          {entry.message}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}
