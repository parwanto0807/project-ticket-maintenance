"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface TicketCompleteDialogProps {
  ticketId: string;
  status: string; // Contoh: "In_Progress", dsb.
  onUpdate?: () => void;
}

const TicketCompleteDialog: React.FC<TicketCompleteDialogProps> = ({
  ticketId,
  status,
  onUpdate,
}) => {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/ticket-closing/${ticketId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "Completed",
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update status");
      }
      router.refresh();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setLoading(false);
      // Tutup dialog segera setelah proses selesai
      setDialogOpen(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={status !== "In_Progress"}
          className="text-green-500 border border-green-500 hover:bg-green-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Closing Ticket
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Closing Ticket Status</DialogTitle>
          <DialogDescription>
            Are you sure you want to mark this ticket as Completed?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="flex justify-end gap-2">
            <Button variant="outline" disabled={loading} onClick={handleComplete}>
              {loading ? "Updating..." : "Confirm"}
            </Button>
            <Button variant="ghost" disabled={loading} onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TicketCompleteDialog;
