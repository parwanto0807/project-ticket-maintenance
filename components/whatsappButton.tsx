"use client";

import { useState } from "react";
import { FaWhatsappSquare } from "react-icons/fa";

interface WhatsAppButtonProps {
  numbers: { id: number; label: string; phone: string }[];
  message: string;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ numbers, message }) => {
  const [showModal, setShowModal] = useState(false);

  // Fungsi membuka WhatsApp dengan nomor yang dipilih
  const openWhatsApp = (whatsappNumber: string) => {
    const encodedMessage = encodeURIComponent(message);
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;

    if (isDesktop) {
      const desktopWhatsApp = `whatsapp://send?phone=${whatsappNumber}&text=${encodedMessage}`;
      window.location.href = desktopWhatsApp;

      setTimeout(() => {
        window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, "_blank");
      }, 1000);
    } else {
      window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, "_blank");
    }

    setShowModal(false);
  };

  return (
    <>
      {/* Tombol Floating WhatsApp */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 p-4 rounded-full bg-green-500/80 text-white shadow-lg cursor-pointer hover:bg-green-500/100 transition"
      >
        <FaWhatsappSquare size={40} />
      </button>

      {/* Modal Pilihan Nomor WhatsApp */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg w-80">
            <h2 className="text-lg font-semibold text-center mb-4 text-gray-800 dark:text-white">Pilih Nomor WhatsApp</h2>
            <div className="space-y-2">
              {numbers.map((num) => (
                <button
                  key={num.id}
                  onClick={() => openWhatsApp(num.phone)}
                  className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                >
                  {num.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 w-full px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default WhatsAppButton;
