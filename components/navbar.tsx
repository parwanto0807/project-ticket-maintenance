"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Wrench, Menu, X } from "lucide-react";
import { LoginButton } from "./auth/login-button";

export const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-8 py-4",
                isScrolled
                    ? "bg-slate-900/80 backdrop-blur-md border-b border-white/10 py-3"
                    : "bg-transparent"
            )}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-500/30 group-hover:bg-blue-500/30 transition-colors">
                        <Wrench className="w-6 h-6 text-blue-400" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                        AxonService
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    <Link
                        href="#features"
                        className="text-sm font-medium text-blue-100/70 hover:text-white transition-colors"
                    >
                        Fitur
                    </Link>
                    <Link
                        href="#solutions"
                        className="text-sm font-medium text-blue-100/70 hover:text-white transition-colors"
                    >
                        Solusi
                    </Link>
                    <Link
                        href="#about"
                        className="text-sm font-medium text-blue-100/70 hover:text-white transition-colors"
                    >
                        Tentang
                    </Link>
                    <LoginButton>
                        <Button
                            variant="default"
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6"
                        >
                            Masuk
                        </Button>
                    </LoginButton>
                </div>

                {/* Mobile menu button */}
                <button
                    className="md:hidden p-2 text-blue-100 hover:bg-white/10 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Navigation Expansion */}
            {mobileMenuOpen && (
                <div className="absolute top-full left-0 right-0 bg-slate-900 border-b border-white/10 p-6 flex flex-col gap-4 animate-in slide-in-from-top duration-300 md:hidden">
                    <Link
                        href="#features"
                        className="text-lg font-medium text-blue-100"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Fitur
                    </Link>
                    <Link
                        href="#solutions"
                        className="text-lg font-medium text-blue-100"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Solusi
                    </Link>
                    <Link
                        href="#about"
                        className="text-lg font-medium text-blue-100"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Tentang
                    </Link>
                    <LoginButton>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg rounded-xl mt-2">
                            Masuk
                        </Button>
                    </LoginButton>
                </div>
            )}
        </nav>
    );
};
