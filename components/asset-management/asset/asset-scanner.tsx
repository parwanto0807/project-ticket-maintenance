"use client";

import React, { useEffect, useState, useRef } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Scan, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { getTicketByAssetNumber } from "@/action/maintenance/ticket";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AssetScannerProps {
    trigger?: React.ReactNode;
}

export const AssetScanner = ({ trigger }: AssetScannerProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isCameraStarting, setIsCameraStarting] = useState(false);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const router = useRouter();
    const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

    const onScanSuccess = async (decodedText: string) => {
        if (isLoading) return;

        stopScanner();

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
                router.push(`/dashboard/technician/schedule?query=${result.ticket.ticketNumber}`);
            }
        } catch (error) {
            toast.error("Terjadi kesalahan saat mencari aset.", { id: toastId });
            setIsOpen(false);
        } finally {
            setIsLoading(false);
        }
    };

    const stopScanner = async () => {
        if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
            try {
                await html5QrCodeRef.current.stop();
            } catch (err) {
                console.error("Failed to stop scanner:", err);
            }
        }
    };

    const startScanner = async () => {
        setCameraError(null);
        setIsCameraStarting(true);

        // Check for secure context
        if (!window.isSecureContext) {
            setCameraError("Kamera hanya dapat diakses melalui HTTPS atau localhost.");
            setIsCameraStarting(false);
            return;
        }

        try {
            if (!html5QrCodeRef.current) {
                html5QrCodeRef.current = new Html5Qrcode("reader");
            }

            const config = {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0,
                formatsToSupport: [
                    Html5QrcodeSupportedFormats.QR_CODE,
                    Html5QrcodeSupportedFormats.CODE_128,
                    Html5QrcodeSupportedFormats.EAN_13,
                    Html5QrcodeSupportedFormats.CODE_39
                ]
            };

            // Preferred: use back camera
            await html5QrCodeRef.current.start(
                { facingMode: "environment" },
                config,
                onScanSuccess,
                (errorMessage) => {
                    // Suppress frame-by-frame errors
                }
            );
        } catch (err: any) {
            console.error("Start scanner error:", err);
            let message = "Gagal mengakses kamera.";
            if (err.name === "NotAllowedError") message = "Izin kamera ditolak. Silakan izinkan akses kamera di browser Anda.";
            else if (err.name === "NotFoundError") message = "Kamera tidak ditemukan.";
            else if (err.message) message = err.message;

            setCameraError(message);
        } finally {
            setIsCameraStarting(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            // Wait for DOM
            const timer = setTimeout(() => {
                startScanner();
            }, 300);
            return () => {
                clearTimeout(timer);
                stopScanner();
            };
        } else {
            stopScanner();
        }
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) {
                setCameraError(null);
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
                    <div id="reader" className="w-full overflow-hidden rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 min-h-[300px]"></div>

                    {(isCameraStarting || isLoading) && (
                        <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 flex flex-col items-center justify-center z-50 rounded-xl">
                            <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-3" />
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest italic">
                                {isLoading ? "Memproses..." : "Menyiapkan Kamera..."}
                            </p>
                        </div>
                    )}

                    {cameraError && (
                        <div className="absolute inset-0 bg-white dark:bg-slate-900 flex flex-col items-center justify-center z-[60] rounded-xl p-6 text-center">
                            <Alert variant="destructive" className="mb-4">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error Kamera</AlertTitle>
                                <AlertDescription className="text-xs">
                                    {cameraError}
                                </AlertDescription>
                            </Alert>
                            <Button size="sm" onClick={startScanner} className="flex items-center gap-2">
                                <RefreshCw className="w-4 h-4" />
                                Coba Lagi
                            </Button>
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
