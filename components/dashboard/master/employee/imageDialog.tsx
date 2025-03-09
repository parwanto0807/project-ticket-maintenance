"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogHeader, DialogDescription } from "@/components/ui/dialog";
import Image from "next/image";

interface ImageDialogProps {
  src: string;
  alt: string;
}

export default function ImageDialogEmployee({ src, alt }: ImageDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Image
          src={src}
          alt={alt}
          width={50}
          height={30}
          style={{ width: "auto", height: "auto" }}
          className="rounded-lg cursor-pointer w-auto h-auto max-w-full max-h-full hover:scale-110 transition-transform duration-300"
          priority={true}
        />
      </DialogTrigger>
      <DialogContent className="flex flex-col items-center">
        <DialogHeader>
          <DialogTitle className="sr-only">{alt}</DialogTitle> {/* 🔥 Aksesibilitas */}
          <DialogDescription>{alt}</DialogDescription>
        </DialogHeader>

        <Image
          src={src}
          alt={alt}
          width={500}
          height={300}
          style={{ width: "auto", height: "auto" }}
          className="rounded-lg w-auto h-auto max-w-full max-h-full"
          priority={true}
        />
      </DialogContent>
    </Dialog>
  );
}
