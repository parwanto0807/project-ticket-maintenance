import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// export const formatCurrency = (value : any) => {
//   // Mengonversi bigint ke number dengan cara aman
//   const numberValue = Number(value); // Konversi ke number
//   return new Intl.NumberFormat('id-ID', {
//       style: 'currency',
//       currency: 'IDR',
//       minimumFractionDigits: 0, // Atur ke 0 jika Anda tidak ingin desimal
//   }).format(numberValue);
// };

export const formatCurrencyInvoice = (value: number, currency: string) => {
  const formattedValue = new Intl.NumberFormat('id-ID', { style: 'currency', currency }).format(value);
  // Menambahkan spasi antara simbol dan angka
  return formattedValue.replace(/(\D)(\d)/, '$1 $2');
};


// Fungsi untuk mengonversi format mata uang kembali ke BigInt
// const parseCurrencyBigint = (value: string) => {
//   const numericValue = value.replace(/[^\d]/g, ''); // Menghapus karakter non-digit
//   return BigInt(numericValue);
// };

export const formatCurrencyIDR = (amount: bigint): string => {
  const amountNumber = Number(amount); // Konversi bigint ke number
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(amountNumber);
};


export function formatCurrencyQtt(value: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0, // Mengatur jumlah digit desimal
  }).format(value);
}

export const formatDateTime = (dateStr: string) => {
  const date = new Date(dateStr);
  const formatter = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
  return formatter.format(date);
};

export const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const formatter = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium", // Mengatur format tanggal
    // timeStyle tidak disertakan sehingga waktu tidak akan ditampilkan
  });
  return formatter.format(date);
};

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};
