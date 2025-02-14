"use client";

import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import LabelPDF from "@/components/asset-management/asset/labelPdf";
import { useParams, useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useMediaQuery } from "react-responsive";
import { Button } from "@/components/ui/button";

interface Asset {
  id: string;
  assetNumber: string;
  status: string;
  location?: string;
  purchaseDate?: string;
  purchaseCost?: number;
  residualValue?: number;
  usefulLife?: number;
  assetTypeId: string;
  departmentId: string;
  productId: string;
  employeeId?: string;
  assetImage1?: string;
  product: {
    part_number: string;
  };
  employee: {
    name: string;
  };
}

const GeneratePDFPage = () => {
  const params = useParams();
  const router = useRouter();
  const assetId = params.assetId as string;
  const [assetData, setAssetData] = useState<Asset | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [open, setOpen] = useState(true);
  const isMobile = useMediaQuery({ maxWidth: 768 }); // Cek apakah layar kecil

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        const res = await fetch(`/api/asset/${assetId}`);
        if (!res.ok) throw new Error("Failed to fetch asset data");
        const data: Asset = await res.json();
        setAssetData(data);

        // Generate QR Code
        const qrCode = await import("qrcode");
        const qr = await qrCode.default.toDataURL(data.assetNumber);
        setQrCodeUrl(qr);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAsset();
  }, [assetId]);

  // Tutup dialog dan redirect ke halaman asset-list
  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      router.push("/dashboard/asset/asset-list");
    }
    setOpen(isOpen);
  };

  if (!assetData) return <p>Loading...</p>;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl w-full">
        <DialogHeader>
          <h2 className="text-lg font-semibold">Label PDF</h2>
        </DialogHeader>

        {/* Konten Dialog */}
        <div className="h-[500px] flex flex-col items-center justify-center">
          {isMobile ? (
            <div className="text-center">
              <p className="text-red-500 mb-4">
                PDF Preview tidak didukung di perangkat mobile. Silakan download PDF.
              </p>
              <PDFDownloadLink
                document={<LabelPDF asset={assetData} qrCodeUrl={qrCodeUrl} />}
                fileName={`label-${assetData.assetNumber}.pdf`}
              >
                {({ loading }) => (
                  <Button className="w-full max-w-[200px]">
                    {loading ? "Loading..." : "Download PDF"}
                  </Button>
                )}
              </PDFDownloadLink>
            </div>
          ) : (
            <PDFViewer width="100%" height="100%">
              <LabelPDF asset={assetData} qrCodeUrl={qrCodeUrl} />
            </PDFViewer>
          )}
        </div>

        {/* Tombol Download PDF (untuk desktop) */}
        {!isMobile && (
          <div className="mt-4 text-center">
            <PDFDownloadLink
              document={<LabelPDF asset={assetData} qrCodeUrl={qrCodeUrl} />}
              fileName={`label-${assetData.assetNumber}.pdf`}
            >
              {({ loading }) => (
                <Button variant="outline">
                  {loading ? "Loading..." : "Download PDF"}
                </Button>
              )}
            </PDFDownloadLink>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GeneratePDFPage;


// "use client";

// import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
// import { useEffect, useState } from "react";
// import LabelPDF from "@/components/asset-management/asset/labelPdf";
// import { useParams, useRouter } from "next/navigation";
// import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
// import { useMediaQuery } from "react-responsive";
// import { Button } from "@/components/ui/button";

// interface Asset {
//   id: string;
//   assetNumber: string;
//   status: string;
//   location?: string;
//   purchaseDate?: string;
//   purchaseCost?: number;
//   residualValue?: number;
//   usefulLife?: number;
//   assetTypeId: string;
//   departmentId: string;
//   productId: string;
//   employeeId?: string;
//   assetImage1?: string;
//   product: {
//     part_number: string;
//   };
//   employee: {
//     name: string;
//   };
// }

// const GeneratePDFPage = () => {
//   const params = useParams();
//   const router = useRouter();
//   const assetId = params.assetId as string;
//   const [assetData, setAssetData] = useState<Asset | null>(null);
//   const [qrCodeUrl, setQrCodeUrl] = useState("");
//   const [open, setOpen] = useState(true);
//   const isMobile = useMediaQuery({ maxWidth: 768 }); // Cek apakah layar kecil

//   useEffect(() => {
//     const fetchAsset = async () => {
//       try {
//         const res = await fetch(`/api/asset/${assetId}`);
//         if (!res.ok) throw new Error("Failed to fetch asset data");
//         const data: Asset = await res.json();
//         setAssetData(data);

//         // Generate QR Code
//         const qrCode = await import("qrcode");
//         const qr = await qrCode.default.toDataURL(data.assetNumber);
//         setQrCodeUrl(qr);
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     fetchAsset();
//   }, [assetId]);

//   // Tutup dialog dan redirect ke halaman asset-list
//   const handleClose = (isOpen: boolean) => {
//     if (!isOpen) {
//       router.push("/dashboard/asset/asset-list");
//     }
//     setOpen(isOpen);
//   };

//   if (!assetData) return <p>Loading...</p>;

//   return (
//     <Dialog open={open} onOpenChange={handleClose}>
//       <DialogContent className="max-w-4xl w-full">
//         <DialogHeader>
//           <h2 className="text-lg font-semibold">Label PDF</h2>
//         </DialogHeader>

//         <div className="h-[500px]">
//           {isMobile ? (
//             <p className="text-center text-red-500">PDF Preview tidak didukung di perangkat mobile. Silakan download PDF.</p>
//           ) : (
//             <PDFViewer width="100%" height="100%">
//               <LabelPDF asset={assetData} qrCodeUrl={qrCodeUrl} />
//             </PDFViewer>
//           )}
//         </div>

//         {/* Tombol Download PDF */}
//         <div className="mt-4 text-center">
//           <PDFDownloadLink
//             document={<LabelPDF asset={assetData} qrCodeUrl={qrCodeUrl} />}
//             fileName={`label-${assetData.assetNumber}.pdf`}
//           >
//             {({ loading }) => (
//               <Button variant="outline">{loading ? "Loading..." : "Download PDF"}</Button>
//             )}
//           </PDFDownloadLink>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default GeneratePDFPage;
