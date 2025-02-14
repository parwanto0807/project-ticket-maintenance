"use client";

import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import LabelPDF from "@/components/asset-management/asset/labelPdf";
import { useParams, useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";


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
    part_number: string
  }
  employee: {
    name: string
  }
}

const GeneratePDFPage = () => {
  const params = useParams();
  const router = useRouter(); // ✅ Tambahkan useRouter untuk redirect
  const assetId = params.assetId as string;
  const [assetData, setAssetData] = useState<Asset | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        const res = await fetch(`/api/asset/${assetId}`);
        if (!res.ok) throw new Error("Failed to fetch asset data");
        const data: Asset = await res.json();
        setAssetData(data);

        // Generate QR Code untuk assetNumber
        const qrCode = await import("qrcode");
        const qr = await qrCode.default.toDataURL(data.assetNumber);
        setQrCodeUrl(qr);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAsset();
  }, [assetId]);

  // ✅ Ketika dialog ditutup, arahkan ke "/dashboard/asset/asset-list"
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

        <div className="h-[500px]">
          <PDFViewer width="100%" height="100%">
            <LabelPDF asset={assetData} qrCodeUrl={qrCodeUrl} />
          </PDFViewer>
        </div>

        {/* Tombol Download PDF */}
        <div className="mt-4">
          <PDFDownloadLink
            document={<LabelPDF asset={assetData} qrCodeUrl={qrCodeUrl} />}
            fileName={`label-${assetData.assetNumber}.pdf`}
            className="p-2 bg-green-600 text-white rounded-md"
          >
            {({ loading }) => (loading ? "Loading..." : "Download PDF")}
          </PDFDownloadLink>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GeneratePDFPage;
