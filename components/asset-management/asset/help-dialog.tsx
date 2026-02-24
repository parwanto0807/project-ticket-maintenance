"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QuestionMarkCircleIcon, BookOpenIcon } from "@heroicons/react/24/outline";
import { Info, TrendingDown, Calendar, Calculator, CheckCircle2, BookOpen } from "lucide-react";

export function AssetHelpDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all shadow-sm">
                    <BookOpen className="w-4 h-4 text-blue-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Dokumentasi</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-slate-200 dark:border-slate-800">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-2xl font-black text-slate-900 dark:text-white">
                        <Info className="w-6 h-6 text-blue-500" />
                        Panduan Asset Management
                    </DialogTitle>
                    <DialogDescription className="text-slate-500 dark:text-slate-400">
                        Memahami cara kerja sistem inventaris dan modul penyusutan aset.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 pt-4">
                    {/* Ringkasan Penggunaan */}
                    <section className="space-y-3">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" />
                            Cara Menggunakan
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                                <p className="text-[11px] font-bold text-slate-900 dark:text-white mb-1">Daftar & Detail Aset</p>
                                <p className="text-[10px] text-slate-500">Lihat ringkasan finansial di tabel utama atau klik ikon "Mata" untuk melihat visualisasi kesehatan aset yang lebih mendalam.</p>
                            </div>
                            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                                <p className="text-[11px] font-bold text-slate-900 dark:text-white mb-1">Indikator Kesehatan</p>
                                <p className="text-[10px] text-slate-500">Warna lencana (hijau/kuning/merah) menunjukkan sisa nilai buku aset dibandingkan harga belinya.</p>
                            </div>
                        </div>
                    </section>

                    {/* Modul Penyusutan */}
                    <section className="space-y-3 bg-blue-50/30 dark:bg-blue-900/10 p-4 rounded-2xl border border-blue-100/50 dark:border-blue-800/50">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 flex items-center gap-2">
                            <TrendingDown className="w-4 h-4" />
                            Modul Penyusutan (Depreciation)
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                            Sistem menggunakan metode <strong>Straight-Line Depreciation</strong> (Garis Lurus) yang menghitung penyusutan secara merata setiap bulan selama masa pakai aset.
                        </p>
                        <div className="bg-white/50 dark:bg-slate-900/50 p-3 rounded-lg font-mono text-[10px] text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                            Penyusutan per Bulan = (Harga Beli - Nilai Sisa) / Masa Pakai (Bulan)
                        </div>
                    </section>

                    {/* Syarat Data */}
                    <section className="space-y-3">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
                            <Calculator className="w-4 h-4" />
                            Syarat Perhitungan Akurat
                        </h3>
                        <ul className="space-y-2">
                            <li className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
                                <span className="p-1 bg-emerald-100 dark:bg-emerald-900/30 rounded text-emerald-600 dark:text-emerald-400 mt-0.5"><Calculator className="w-3 h-3" /></span>
                                <div><span className="font-bold text-slate-700 dark:text-slate-300">Purchase Cost:</span> Harga pembelian awal aset.</div>
                            </li>
                            <li className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
                                <span className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded text-blue-600 dark:text-blue-400 mt-0.5"><Calendar className="w-3 h-3" /></span>
                                <div><span className="font-bold text-slate-700 dark:text-slate-300">Purchase Date:</span> Tanggal mulai aset dioperasikan.</div>
                            </li>
                            <li className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
                                <span className="p-1 bg-amber-100 dark:bg-amber-900/30 rounded text-amber-600 dark:text-amber-400 mt-0.5"><TrendingDown className="w-3 h-3" /></span>
                                <div><span className="font-bold text-slate-700 dark:text-slate-300">Useful Life:</span> Estimasi total bulan masa pakai aset.</div>
                            </li>
                        </ul>
                    </section>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
                        <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold">Project Ticket & Maintenance System</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
