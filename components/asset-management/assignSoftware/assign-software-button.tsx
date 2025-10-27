// components/asset-management/asset/assign-software-button.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { Laptop, Plus } from "lucide-react"
import { AssignSoftwareForm } from "./assign-software-form"

interface AssignSoftwareButtonProps {
  assetId: string
  assetNumber?: string
}

export function AssignSoftwareButton({ assetId, assetNumber }: AssignSoftwareButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2"
        >
          <Laptop className="h-4 w-4" />
          Assign Software
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Assign Software to Asset
          </DialogTitle>
          <DialogDescription>
            {assetNumber 
              ? `Assign software to asset ${assetNumber}`
              : "Select software to assign to this asset"
            }
          </DialogDescription>
        </DialogHeader>
        <AssignSoftwareForm 
          assetId={assetId} 
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}