"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogHeader, DialogDescription } from "@/components/ui/dialog";

// 🔥 Gunakan `dynamic()` agar gambar hanya dirender di client-side (CSR)
const DynamicImage = dynamic(() => import("next/image"), { ssr: false });

interface ImageDialogProps {
  src: string;
  alt: string;
}

export default function ImageDialogEmployee({ src, alt }: ImageDialogProps) {
  const [open, setOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState(`${src}?t=${new Date().getTime()}`);

  // 🔥 Fungsi untuk menangani error saat gambar gagal dimuat
  const handleError = () => {
    setImageSrc("/noImage.jpg");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DynamicImage
          src={imageSrc} // 🔥 Cache Bypass
          alt={alt}
          width={50}
          height={30}
          unoptimized={true} // ✅ Hindari optimasi Next.js (Fix error 400)
          onError={handleError} // ✅ Ganti gambar jika gagal dimuat
          className="rounded-lg cursor-pointer w-auto h-auto max-w-full max-h-full hover:scale-110 transition-transform duration-300"
        />
      </DialogTrigger>
      <DialogContent className="flex flex-col items-center">
        <DialogHeader>
          <DialogTitle className="sr-only">{alt}</DialogTitle>
          <DialogDescription>{alt}</DialogDescription>
        </DialogHeader>

        <DynamicImage
          src={imageSrc} // 🔥 Cache Bypass
          alt={alt}
          width={500}
          height={300}
          unoptimized={true} // ✅ Hindari optimasi Next.js (Fix error 400)
          onError={handleError} // ✅ Ganti gambar jika gagal dimuat
          className="rounded-lg w-auto h-auto max-w-full max-h-full"
        />
      </DialogContent>
    </Dialog>
  );
}
