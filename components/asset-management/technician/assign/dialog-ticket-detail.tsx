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
import { TicketMaintenance } from "@prisma/client";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import ReadMoreText from "../../maintenance/read-more";
import Image from "next/image";

export function TicketDialog({ ticket }: { ticket: TicketMaintenance }) {
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

  // Jika ticket.createdAt bukan objek Date, pastikan dikonversi
  const createdAt = ticket.createdAt instanceof Date
    ? ticket.createdAt
    : new Date(ticket.createdAt);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="rounded-md border p-2 bg-green-500 text-white hover:bg-green-600 h-8 w-8 md:h-8 md:w-auto text-center hover:text-white flex justify-center items-center"
        >
          <MagnifyingGlassIcon className="w-4 h-4" />
          <span className="sr-only md:not-sr-only md:ml-2 md:inline">View</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="
        w-[95vw] max-w-lg max-h-[85vh] 
        md:max-w-2xl md:max-h-[70vh]
        overflow-y-auto rounded-lg shadow-lg
        mx-auto my-4
      ">
        <DialogHeader className="px-4 md:px-6 pt-4 md:pt-6">
          <DialogTitle className="text-lg md:text-xl font-bold text-gray-800 dark:text-white text-center md:text-left">
            {ticket.ticketNumber}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 dark:text-gray-300 text-center md:text-left">
            Created on {createdAt.toDateString()}
          </DialogDescription>
        </DialogHeader>
        
        <div className="px-4 md:px-6 pb-4 md:pb-6">
          <Card className="border rounded-lg shadow-sm bg-gray-50 dark:bg-gray-800">
            <CardContent className="grid gap-4 text-sm p-4 md:p-6">
              {/* Trouble User Section */}
              <div className="space-y-2">
                <strong className="text-gray-700 dark:text-gray-300 block text-base">
                  Trouble Report:
                </strong>
                <div className="bg-white dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                  <ReadMoreText text={ticket.troubleUser} />
                </div>
              </div>

              {/* Analysis Section */}
              {ticket.analisaDescription && (
                <div className="space-y-2">
                  <strong className="text-gray-700 dark:text-gray-300 block text-base">
                    Technician Analysis:
                  </strong>
                  <div className="bg-white dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                    <ReadMoreText text={ticket.analisaDescription} />
                  </div>
                </div>
              )}

              {/* Action Section */}
              {ticket.actionDescription && (
                <div className="space-y-2">
                  <strong className="text-gray-700 dark:text-gray-300 block text-base">
                    Action Taken:
                  </strong>
                  <div className="bg-white dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                    <ReadMoreText text={ticket.actionDescription} />
                  </div>
                </div>
              )}

              {/* Images Section */}
              <div className="space-y-3">
                <strong className="text-gray-700 dark:text-gray-300 block text-base">
                  Documentation:
                </strong>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      Issue Image
                    </div>
                    <div className="w-24 h-24 md:w-28 md:h-28 rounded-lg overflow-hidden border-2 border-gray-300 dark:border-gray-600 shadow-sm">
                      <Image
                        src={imageSrc1}
                        alt="Issue documentation"
                        width={112}
                        height={112}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center space-y-2">
                    <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      Analysis Image
                    </div>
                    <div className="w-24 h-24 md:w-28 md:h-28 rounded-lg overflow-hidden border-2 border-gray-300 dark:border-gray-600 shadow-sm">
                      <Image
                        src={imageSrc2}
                        alt="Analysis documentation"
                        width={112}
                        height={112}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center space-y-2">
                    <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      Action Image
                    </div>
                    <div className="w-24 h-24 md:w-28 md:h-28 rounded-lg overflow-hidden border-2 border-gray-300 dark:border-gray-600 shadow-sm">
                      <Image
                        src={imageSrc3}
                        alt="Action documentation"
                        width={112}
                        height={112}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="px-4 md:px-6 pb-4 md:pb-6">
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full md:w-auto bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white"
            >
              Close
            </Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}