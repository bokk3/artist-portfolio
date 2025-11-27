"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Unlock, Mail } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface UnlockableContentProps {
  children: React.ReactNode;
  contentId: string;
  title?: string;
  description?: string;
}

export function UnlockableContent({
  children,
  contentId,
  title = "Exclusive Content",
  description = "Join our newsletter to unlock this content.",
}: UnlockableContentProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check local storage for unlock status
    const unlocked = localStorage.getItem(`unlocked_${contentId}`);
    if (unlocked) {
      setIsUnlocked(true);
    }
  }, [contentId]);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simple validation
    if (!email.includes("@")) {
      toast.error("Please enter a valid email address");
      setLoading(false);
      return;
    }

    // In a real app, we would verify the email or subscribe them here
    localStorage.setItem(`unlocked_${contentId}`, "true");
    setIsUnlocked(true);
    setLoading(false);
    toast.success("Content unlocked! Welcome to the inner circle.");
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card/30">
      <AnimatePresence mode="wait">
        {isUnlocked ? (
          <motion.div
            key="content"
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.5 }}
            className="p-6"
          >
            <div className="flex items-center gap-2 text-primary mb-4 text-sm font-medium uppercase tracking-wider">
              <Unlock className="w-4 h-4" />
              Unlocked Exclusive
            </div>
            {children}
          </motion.div>
        ) : (
          <motion.div
            key="lock"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative p-8 md:p-12 text-center"
          >
            {/* Blurred background preview */}
            <div className="absolute inset-0 bg-background/80 backdrop-blur-md z-10 flex flex-col items-center justify-center p-6">
              <div className="max-w-md w-full space-y-6">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-primary" />
                </div>

                <div>
                  <h3 className="text-2xl font-display font-bold mb-2">
                    {title}
                  </h3>
                  <p className="text-muted-foreground">{description}</p>
                </div>

                <form onSubmit={handleUnlock} className="flex flex-col gap-3">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10 bg-background/50"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "Unlocking..." : "Unlock Access"}
                  </Button>
                </form>

                <p className="text-xs text-muted-foreground">
                  We respect your privacy. No spam, ever.
                </p>
              </div>
            </div>

            {/* Fake content behind blur */}
            <div
              className="opacity-20 blur-sm select-none pointer-events-none"
              aria-hidden="true"
            >
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
