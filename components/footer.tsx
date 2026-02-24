import React from "react";
import Link from "next/link";
import { Wrench, Github, Twitter, Linkedin } from "lucide-react";

export const Footer = () => {
    return (
        <footer className="bg-slate-950 border-t border-white/10 py-12 px-4 md:px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                {/* Brand Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Wrench className="w-6 h-6 text-blue-400" />
                        <span className="text-xl font-bold text-white">AxonService</span>
                    </div>
                    <p className="text-blue-100/60 text-sm leading-relaxed">
                        Platform terkemuka untuk manajemen aset cerdas dan optimalisasi pemeliharaan.
                    </p>
                    <div className="flex gap-4">
                        <Link href="#" className="text-blue-100/40 hover:text-white transition-colors">
                            <Twitter className="w-5 h-5" />
                        </Link>
                        <Link href="#" className="text-blue-100/40 hover:text-white transition-colors">
                            <Github className="w-5 h-5" />
                        </Link>
                        <Link href="#" className="text-blue-100/40 hover:text-white transition-colors">
                            <Linkedin className="w-5 h-5" />
                        </Link>
                    </div>
                </div>

                {/* Product links */}
                <div>
                    <h4 className="text-white font-semibold mb-6">Produk</h4>
                    <ul className="space-y-4 text-sm text-blue-100/60">
                        <li><Link href="#" className="hover:text-blue-400 transition-colors">Fitur</Link></li>
                        <li><Link href="#" className="hover:text-blue-400 transition-colors">Keamanan</Link></li>
                        <li><Link href="#" className="hover:text-blue-400 transition-colors">Perusahaan</Link></li>
                        <li><Link href="#" className="hover:text-blue-400 transition-colors">Solusi</Link></li>
                    </ul>
                </div>

                {/* Company links */}
                <div>
                    <h4 className="text-white font-semibold mb-6">Perusahaan</h4>
                    <ul className="space-y-4 text-sm text-blue-100/60">
                        <li><Link href="#" className="hover:text-blue-400 transition-colors">Tentang Kami</Link></li>
                        <li><Link href="#" className="hover:text-blue-400 transition-colors">Karir</Link></li>
                        <li><Link href="#" className="hover:text-blue-400 transition-colors">Blog</Link></li>
                        <li><Link href="#" className="hover:text-blue-400 transition-colors">Legal</Link></li>
                    </ul>
                </div>

                {/* Support links */}
                <div>
                    <h4 className="text-white font-semibold mb-6">Dukungan</h4>
                    <ul className="space-y-4 text-sm text-blue-100/60">
                        <li><Link href="#" className="hover:text-blue-400 transition-colors">Pusat Bantuan</Link></li>
                        <li><Link href="#" className="hover:text-blue-400 transition-colors">Referensi API</Link></li>
                        <li><Link href="#" className="hover:text-blue-400 transition-colors">Komunitas</Link></li>
                        <li><Link href="#" className="hover:text-blue-400 transition-colors">Kontak</Link></li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-blue-100/40">
                <p>© 2026 AxonService Inc. Hak cipta dilindungi undang-undang.</p>
                <div className="flex gap-8">
                    <Link href="#" className="hover:text-white transition-colors">Kebijakan Privasi</Link>
                    <Link href="#" className="hover:text-white transition-colors">Syarat Layanan</Link>
                </div>
            </div>
        </footer>
    );
};
