
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { TicketMaintenance } from "@prisma/client";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import ReadMoreText from "./read-more";
import Image from "next/image";

interface Ticket {
    id: string;
    ticketNumber: string;
    status: string;
    troubleUser: string;
    analisaDescription?: string;
    actionDescription?: string;
    priorityStatus: string;
    scheduledDate?: string;
    completedDate?: string;
    ticketImage1?: string;
    ticketImage2?: string;
    ticketImage3?: string;
    createdAt: Date;
    employee: {
        name: string;
        email: string;
    };
    asset: {
        assetImage1?: string;
        assetNumber: string;
        product: {
            part_name: string;
        };
    };
    technician?: {
        name: string;
    }
}

export function TicketDialog({ ticket }: { ticket: Ticket }) {
    // Pastikan URL gambar tidak kosong, gunakan fallback "/noImage.jpg"
    const imageSrc1 =
        ticket.ticketImage1 && ticket.ticketImage1.trim() !== ""
            ? ticket.ticketImage1
            : "/noImage.jpg";
    const imageSrc2 =
        ticket.ticketImage2 && ticket.ticketImage2.trim() !== ""
            ? ticket.ticketImage2
            : "/noImage.jpg";
    const imageSrc3 =
        ticket.ticketImage3 && ticket.ticketImage3.trim() !== ""
            ? ticket.ticketImage3
            : "/noImage.jpg";

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="text-white-600 rounded-md border p-2 hover:bg-green-800 h-8 text-center hover:text-white flex justify-center items-center"
                >
                    <MagnifyingGlassIcon className="w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[70vh] overflow-y-auto rounded-lg shadow-lg">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-800 dark:text-white">
                        {ticket.ticketNumber} - {new Date(ticket.createdAt).toDateString()}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-gray-600 dark:text-gray-300">
                        Detail lengkap ticket maintenance
                    </DialogDescription>
                </DialogHeader>
                <Card className="p-2 border rounded-lg shadow-sm bg-gray-50 dark:bg-gray-800">
                    <CardContent className="grid gap-2 text-sm">
                        <p>
                            <strong className="text-gray-700 dark:text-gray-300">
                                Trouble User :
                            </strong>{" "}
                            <ReadMoreText text={ticket.troubleUser} />
                        </p>
                        <p>
                            <strong className="text-gray-700 dark:text-gray-300">
                                Analisa Teknisi :
                            </strong>{" "}
                            <ReadMoreText text={ticket.analisaDescription ?? ""} />
                        </p>
                        <p>
                            <strong className="text-gray-700 dark:text-gray-300">
                                Action Teknisi:
                            </strong>{" "}
                            <ReadMoreText text={ticket.actionDescription ?? ""} />
                        </p>
                        <p>
                            <strong className="text-gray-700 dark:text-gray-300">
                                Teknisi:
                            </strong>{" "}
                            <ReadMoreText text={ticket.technician?.name ?? ""} />
                        </p>
                        <p>
                            <strong className="text-gray-700 dark:text-gray-300">
                                Closing Date:
                            </strong>{" "}
                            {ticket.completedDate
                                ? new Intl.DateTimeFormat("id-ID", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "2-digit",
                                }).format(new Date(ticket.completedDate))
                                : ""}

                        </p>
                        {/* Container untuk gambar */}
                        <div className="flex flex-wrap gap-2 mt-3 justify-start md:justify-start">
                            <Image
                                src={imageSrc1}
                                alt="Ticket Image 1"
                                width={96}
                                height={96}
                                className="object-cover rounded w-20 h-20"
                            />
                            <Image
                                src={imageSrc2}
                                alt="Ticket Image 2"
                                width={96}
                                height={96}
                                className="object-cover rounded w-20 h-20"
                            />
                            <Image
                                src={imageSrc3}
                                alt="Ticket Image 3"
                                width={96}
                                height={96}
                                className="object-cover rounded w-20 h-20"
                            />
                        </div>
                    </CardContent>
                </Card>
                <DialogFooter>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="w-full">Tutup</Button>
                    </DialogTrigger>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
