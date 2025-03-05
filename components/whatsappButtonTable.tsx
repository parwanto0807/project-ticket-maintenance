"use client";

import { useState } from "react";
import { FaWhatsappSquare } from "react-icons/fa";

interface WhatsAppLinkButtonProps {
  numbers: { id: number; label: string; phone: string }[];
  message: string;
  disabled?: boolean;
}

const WhatsAppLinkButtonTable: React.FC<WhatsAppLinkButtonProps> = ({ numbers, message, disabled = false }) => {
  const [showModal, setShowModal] = useState(false);

  const getTimeBasedGreeting = () => {
    const hours = new Date().getHours();
    if (hours >= 5 && hours < 12) return "Selamat pagi";
    if (hours >= 12 && hours < 16) return "Selamat siang";
    if (hours >= 16 && hours < 19) return "Selamat sore";
    return "Selamat malam";
  };

  // Fungsi membuka WhatsApp dengan nomor yang dipilih dan menyertakan label ke dalam pesan
  const openWhatsApp = (selectedNumber: { phone: string; label: string }) => {
    // Pesan dinamis: gabungkan greeting, label nomor, dan pesan yang sudah diberikan
    const dynamicMessage = `${getTimeBasedGreeting()} ${selectedNumber.label} - ${message}`;
    const encodedMessage = encodeURIComponent(dynamicMessage);
    const whatsappUrl = `https://wa.me/${selectedNumber.phone}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
    setShowModal(false);
  };

  return (
    <>
      {/* Tombol untuk memunculkan dialog pilihan nomor */}
      <button
        onClick={() => !disabled && setShowModal(true)}
        disabled={disabled}
        className={`flex items-center space-x-2 transition font-medium ${
          disabled
            ? "text-gray-400 opacity-50 cursor-not-allowed"
            : "text-green-600 hover:text-green-700"
        }`}
      >
        <FaWhatsappSquare size={20} />
        <span>Kirim Pesan</span>
      </button>

      {/* Modal Dialog untuk memilih nomor WhatsApp */}
      {showModal && !disabled && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg w-80">
            <h2 className="text-lg font-semibold text-center mb-4 text-gray-800 dark:text-white">
              Pilih Nomor WhatsApp
            </h2>
            <div className="space-y-2">
              {numbers.map((num) => (
                <button
                  key={num.id}
                  onClick={() => openWhatsApp(num)}
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

export default WhatsAppLinkButtonTable;
