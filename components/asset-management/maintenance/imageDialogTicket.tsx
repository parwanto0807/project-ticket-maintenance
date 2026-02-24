"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogHeader, DialogDescription } from "@/components/ui/dialog";
import Image from "next/image";

interface ImageDialogProps {
  src: string;
  alt: string;
}

export default function ImageDialogTicket({ src, alt }: ImageDialogProps) {
  const [open, setOpen] = useState(false);
  const imageSrc = src && src.trim().length > 0 ? src : "/noImage.jpg";


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="relative w-full h-full cursor-pointer overflow-hidden rounded-lg">
          <Image
            src={imageSrc}
            alt={alt}
            fill
            className="object-cover hover:scale-110 transition-transform duration-300"
          />
        </div>
      </DialogTrigger>
      <DialogContent className="flex flex-col items-center">
        <DialogHeader>
          <DialogTitle className="sr-only">{alt}</DialogTitle> {/* 🔥 Aksesibilitas */}
          <DialogDescription className="hidden">{alt}</DialogDescription>
        </DialogHeader>

        <Image
          src={src}
          alt={alt}
          width={400}
          height={300}
          className="rounded-lg w-auto h-auto max-w-full max-h-full"
        />
      </DialogContent>
    </Dialog>
  );
}
