import { useState, ChangeEvent } from 'react';
import * as XLSX from 'xlsx';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { PlusIcon } from '@heroicons/react/24/outline';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface PreviewData {
  idProduct: string;
  hargaHpp: number;
  hargaJual: number;
  idMtUang: string;
}

export default function ImportPrices() {
  const [previewData, setPreviewData] = useState<PreviewData[]>([]);
  const [file, setFile] = useState<File | null>(null);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (evt) => {
        const arrayBuffer = evt.target?.result as ArrayBuffer;
        const data = new Uint8Array(arrayBuffer);
        const wb = XLSX.read(data, { type: 'array' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const jsonData: PreviewData[] = XLSX.utils.sheet_to_json(ws);
        setPreviewData(jsonData);
      };
      reader.readAsArrayBuffer(selectedFile);
    }
  };

  const handleImport = async () => {
    if (!file) {
      alert('Please select a file first');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await fetch('/api/dashboard/products/import-prices', {
        method: 'POST',
        body: formData,
      });
  
      console.log('Response status:', response.status);
      const responseText = await response.text();
      console.log('Response text:', responseText);
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      try {
        const result = JSON.parse(responseText);
        if (result.success) {
          alert(result.success);
        } else if (result.error) {
          alert(`Error: ${result.error}`);
          if (result.details) {
            console.error('Error details:', result.details);
          }
        } else {
          throw new Error('Unexpected response format');
        }
      } catch (jsonError) {
        console.error('Failed to parse JSON:', jsonError);
        alert(`Error importing data: ${responseText}`);
      }
    } catch (error) {
      console.error('Error importing data:', error);
      alert(`Error importing data: `);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          <PlusIcon className="w-5 h-5 mr-2" />
          Import Prices
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Import Prices</DialogTitle>
        <DialogDescription>Upload an Excel file to import prices.</DialogDescription>
        <input 
          type="file" 
          accept=".xlsx, .xls" 
          onChange={handleFileUpload} 
          className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-violet-50 file:text-violet-700
          hover:file:bg-violet-100
          mb-4"
        />
        {previewData.length > 0 && (
          <div>
            <h2 className="text-lg mb-2">Preview</h2>
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="py-2">ID Product</TableHead>
                  <TableHead className="py-2">Harga HPP</TableHead>
                  <TableHead className="py-2">Harga Jual</TableHead>
                  <TableHead className="py-2">ID Mata Uang</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {previewData.slice(0, 5).map((row, index) => (
                  <TableRow key={index}>
                    <TableCell className="py-2 px-4">{row.idProduct}</TableCell>
                    <TableCell className="py-2 px-4">{row.hargaHpp}</TableCell>
                    <TableCell className="py-2 px-4">{row.hargaJual}</TableCell>
                    <TableCell className="py-2 px-4">{row.idMtUang}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <p className="mt-4">Showing first 5 rows of {previewData.length} total</p>
            <button 
              onClick={handleImport} 
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Import Data
            </button>
          </div>
        )}
        <DialogClose className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
          Close
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
