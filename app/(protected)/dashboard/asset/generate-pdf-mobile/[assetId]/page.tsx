"use client";

import { BlobProvider, PDFDownloadLink } from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import LabelPDF from "@/components/asset-management/asset/labelPdf";
import { useParams, useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
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
  department: {
    dept_name: string;
  };
}

const GeneratePDFPage = () => {
  const params = useParams();
  const router = useRouter();
  const assetId = params.assetId as string;
  const [assetData, setAssetData] = useState<Asset | null>(null);
  const [barcodeUrl, setBarcodeUrl] = useState("");
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        const res = await fetch(`/api/asset/${assetId}`);
        if (!res.ok) throw new Error("Failed to fetch asset data");
        const data: Asset = await res.json();
        setAssetData(data);

        // Generate Barcode 1D menggunakan JsBarcode
        const { default: JsBarcode } = await import("jsbarcode");
        const canvas = document.createElement("canvas");
        JsBarcode(canvas, data.assetNumber, {
          format: "CODE128",
          displayValue: false,
          width: 2,    // Mengatur ketebalan garis barcode
          height: 40,  // Mengatur tinggi barcode
          margin: 0,
        });
        const barcode = canvas.toDataURL("image/png");
        setBarcodeUrl(barcode);
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

        {/* Tampilkan PDF menggunakan BlobProvider dan iframe */}
        <div className="h-[500px]">
          <BlobProvider document={<LabelPDF asset={assetData} barcodeUrl={barcodeUrl} />}>
            {({ url }) =>
              url ? (
                <iframe
                  src={url}
                  width="100%"
                  height="100%"
                  style={{ border: "none" }}
                  title="PDF Preview"
                />
              ) : (
                <p>Loading PDF...</p>
              )
            }
          </BlobProvider>
        </div>

        {/* Tombol Download PDF */}
        <div className="mt-4 text-center">
          <PDFDownloadLink
            document={<LabelPDF asset={assetData} barcodeUrl={barcodeUrl} />}
            fileName={`label-${assetData.assetNumber}.pdf`}
          >
            {({ loading }) => (
              <Button variant="outline">
                {loading ? "Loading..." : "Download PDF"}
              </Button>
            )}
          </PDFDownloadLink>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GeneratePDFPage;


// "use client";

// import { BlobProvider, PDFDownloadLink } from "@react-pdf/renderer";
// import { useEffect, useState } from "react";
// import LabelPDF from "@/components/asset-management/asset/labelPdf";
// import { useParams, useRouter } from "next/navigation";
// import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
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
//   department: {
//     dept_name: string;
//   };
// }

// const GeneratePDFPage = () => {
//   const params = useParams();
//   const router = useRouter();
//   const assetId = params.assetId as string;
//   const [assetData, setAssetData] = useState<Asset | null>(null);
//   const [qrCodeUrl, setQrCodeUrl] = useState("");
//   const [open, setOpen] = useState(true);

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

//         {/* Tampilkan PDF menggunakan BlobProvider dan iframe */}
//         <div className="h-[500px]">
//           <BlobProvider
//             document={<LabelPDF asset={assetData} qrCodeUrl={qrCodeUrl} />}
//           >
//             {({ url }) => // Hapus `blob` dari sini
//               url ? (
//                 <iframe
//                   src={url}
//                   width="100%"
//                   height="100%"
//                   style={{ border: "none" }}
//                   title="PDF Preview"
//                 />
//               ) : (
//                 <p>Loading PDF...</p>
//               )
//             }
//           </BlobProvider>
//         </div>

//         {/* Tombol Download PDF */}
//         <div className="mt-4 text-center">
//           <PDFDownloadLink
//             document={<LabelPDF asset={assetData} qrCodeUrl={qrCodeUrl} />}
//             fileName={`label-${assetData.assetNumber}.pdf`}
//           >
//             {({ loading }) => (
//               <Button variant="outline">
//                 {loading ? "Loading..." : "Download PDF"}
//               </Button>
//             )}
//           </PDFDownloadLink>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default GeneratePDFPage;