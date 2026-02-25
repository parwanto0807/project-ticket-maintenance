"use client";

import React, { useEffect, useState, useRef } from "react";
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from "html5-qrcode";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Scan, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getTicketByAssetNumber } from "@/action/maintenance/ticket";
import { useRouter } from "next/navigation";

interface AssetScannerProps {
    trigger?: React.ReactNode;
}

export const AssetScanner = ({ trigger }: AssetScannerProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);

    const onScanSuccess = async (decodedText: string) => {
        if (isLoading) return;

        // Stop scanning immediately after success
        if (scannerRef.current) {
            try {
                await scannerRef.current.clear();
                scannerRef.current = null;
            } catch (err) {
                console.error("Failed to clear scanner:", err);
            }
        }

        setIsLoading(true);
        const toastId = toast.loading(`Mencari tiket untuk aset: ${decodedText}...`);

        try {
            const result = await getTicketByAssetNumber(decodedText);

            if (result.error) {
                toast.error(result.error, { id: toastId });
                setIsOpen(false);
            } else if (result.success && result.ticket) {
                toast.success("Tiket ditemukan! Mengalihkan...", { id: toastId });
                setIsOpen(false);
                // Redirect to schedule with ticket number as query
                router.push(`/dashboard/technician/schedule?query=${result.ticket.ticketNumber}`);
            }
        } catch (error) {
            toast.error("Terjadi kesalahan saat mencari aset.", { id: toastId });
            setIsOpen(false);
        } finally {
            setIsLoading(false);
        }
    };

    const onScanFailure = (error: any) => {
        // Errors are frequent during scanning process (e.g. no code found in frame)
        // We don't need to show them to the user.
    };

    useEffect(() => {
        if (isOpen && !scannerRef.current) {
            // Give the DOM a moment to render the #reader div
            const timer = setTimeout(() => {
                const scanner = new Html5QrcodeScanner(
                    "reader",
                    {
                        fps: 10,
                        qrbox: { width: 250, height: 250 },
                        aspectRatio: 1.0,
                        formatsToSupport: [
                            Html5QrcodeSupportedFormats.QR_CODE,
                            Html5QrcodeSupportedFormats.CODE_128,
                            Html5QrcodeSupportedFormats.EAN_13,
                            Html5QrcodeSupportedFormats.CODE_39
                        ]
                    },
                    /* verbose= */ false
                );

                scanner.render(onScanSuccess, onScanFailure);
                scannerRef.current = scanner;
            }, 100);

            return () => {
                clearTimeout(timer);
                if (scannerRef.current) {
                    scannerRef.current.clear().catch(err => console.error("Cleanup failed", err));
                    scannerRef.current = null;
                }
            };
        }
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            setIsOpen(open);
            if (!open && scannerRef.current) {
                scannerRef.current.clear().catch(err => console.error("Close cleanup failed", err));
                scannerRef.current = null;
            }
        }}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" className="flex items-center gap-2">
                        <Scan className="w-4 h-4" />
                        Scan Asset
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Scan QR/Barcode Aset</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center justify-center space-y-4 relative min-h-[300px]">
                    <div id="reader" className="w-full overflow-hidden rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50"></div>

                    {isLoading && (
                        <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 flex flex-col items-center justify-center z-50 rounded-xl">
                            <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-3" />
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest italic">Memproses...</p>
                        </div>
                    )}

                    <div className="text-center px-4">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic">
                            Arahkan kamera ke QR Code atau Barcode aset.
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
