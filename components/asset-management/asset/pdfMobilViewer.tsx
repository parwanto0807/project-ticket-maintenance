"use client";

import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

interface PDFViewProps {
  pdfUrl: string;
}

const PDFMobileViewer: React.FC<PDFViewProps> = ({ pdfUrl }) => {
  return (
    <div style={{ height: "500px", width: "100%" }}>
      <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js`}>
        <Viewer fileUrl={pdfUrl} />
      </Worker>
    </div>
  );
};

export default PDFMobileViewer;
