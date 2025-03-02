// components/FilterBar.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const statuses = ["Pending", "Assigned", "In_Progress", "Completed", "Canceled"];
const priorities = ["Low", "Medium", "High", "Critical"];

export default function FilterBar() {
  const router = useRouter();
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);

  // Update URL setiap kali filter berubah (menggunakan query string)
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedStatuses.length > 0) {
      params.set("status", selectedStatuses.join(","));
    }
    if (selectedPriorities.length > 0) {
      params.set("priority", selectedPriorities.join(","));
    }
    router.push(`?${params.toString()}`);
  }, [selectedStatuses, selectedPriorities, router]);

  const toggleStatus = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  const togglePriority = (priority: string) => {
    setSelectedPriorities((prev) =>
      prev.includes(priority) ? prev.filter((p) => p !== priority) : [...prev, priority]
    );
  };

  return (
    <div className="flex gap-4 mb-4">
      {/* Dropdown untuk filter status */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Status</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Status Filter</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {statuses.map((status) => (
            <DropdownMenuCheckboxItem
              key={status}
              checked={selectedStatuses.includes(status)}
              onCheckedChange={() => toggleStatus(status)}
            >
              {status.replace("_", " ")}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dropdown untuk filter priority */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Priority</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Priority Filter</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {priorities.map((priority) => (
            <DropdownMenuCheckboxItem
              key={priority}
              checked={selectedPriorities.includes(priority)}
              onCheckedChange={() => togglePriority(priority)}
            >
              {priority}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
