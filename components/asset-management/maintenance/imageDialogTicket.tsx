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
        <Image
          src={imageSrc}
          alt={alt}
          width={40}
          height={30}
          className="rounded-lg cursor-pointer w-auto h-auto max-w-full max-h-full hover:scale-110 transition-transform duration-300"
        />
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
