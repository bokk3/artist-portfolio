"use client";

import { useState, useEffect } from "react";
import {
  getPendingGuestbookEntries,
  approveGuestbookEntry,
  deleteGuestbookEntry,
} from "@/app/actions/guestbook";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Check, Trash2, Clock } from "lucide-react";

export default function AdminGuestbookPage() {
  const [pendingEntries, setPendingEntries] = useState<any[]>([]);

  useEffect(() => {
    fetchPending();
  }, []);

  async function fetchPending() {
    const data = await getPendingGuestbookEntries();
    setPendingEntries(data);
  }

  async function handleApprove(id: number) {
    const result = await approveGuestbookEntry(id);
    if (result.success) {
      toast.success("Entry approved");
      fetchPending();
    } else {
      toast.error("Failed to approve entry");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this entry?")) return;

    const result = await deleteGuestbookEntry(id);
    if (result.success) {
      toast.success("Entry deleted");
      fetchPending();
    } else {
      toast.error("Failed to delete entry");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold">
          Guestbook Moderation
        </h1>
      </div>

      {pendingEntries.length === 0 ? (
        <Card className="p-12 text-center text-muted-foreground">
          <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg">No pending entries to moderate.</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {pendingEntries.map((entry) => (
            <Card
              key={entry.id}
              className="p-4 glass-card flex items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold">{entry.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(entry.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="text-muted-foreground">{entry.message}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-green-500 hover:text-green-600 hover:bg-green-500/10"
                  onClick={() => handleApprove(entry.id)}
                >
                  <Check className="w-4 h-4" />
                  <span className="sr-only">Approve</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                  onClick={() => handleDelete(entry.id)}
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
