"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogHeader, DialogDescription } from "@/components/ui/dialog";
import Image from "next/image";
import { getImageUrl } from "@/lib/getImageUrl";

interface ImageDialogProps {
  src: string;
  alt: string;
}

export default function ImageDialog({ src, alt }: ImageDialogProps) {
  const [open, setOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState(`${src}?t=${new Date().getTime()}`);

  const imageUrl = getImageUrl(imageSrc);

  const handleError = () => {
    setImageSrc("/noImage.jpg");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Image
          src={imageUrl}
          alt={alt}
          width={100}
          height={100}
          unoptimized={true}
          onError={handleError}
          className="rounded-lg cursor-pointer w-full h-full object-cover hover:scale-110 transition-transform duration-300"
        />
      </DialogTrigger>
      <DialogContent className="flex flex-col items-center">
        <DialogHeader>
          <DialogTitle className="sr-only">{alt}</DialogTitle>
          <DialogDescription>{alt}</DialogDescription>
        </DialogHeader>

        <Image
          src={imageUrl}
          alt={alt}
          width={500}
          height={300}
          unoptimized={true}
          onError={handleError}
          className="rounded-lg w-auto h-auto max-w-full max-h-full"
        />
      </DialogContent>
    </Dialog>
  );
}
