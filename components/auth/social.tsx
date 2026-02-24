"use client";
import React from "react";

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
// import { Button } from "../../../project-ticket-maintenance/components/ui/button";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { Shield, ExternalLink } from "lucide-react";

export const Social = () => {
    const onClick = async (provider: "google" | "github") => {
        console.log(`Clicked ${provider} button`);
        try {
            const result = await signIn(provider, {
                callbackUrl: DEFAULT_LOGIN_REDIRECT,
            });
            console.log("Sign in result:", result);
        } catch (error) {
            console.error("Error during sign in:", error);
        }
    }

    return (
        <div className="w-full space-y-4">
            {/* Modern Divider */}
            <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center">
                    <span className="px-3 sm:px-4 bg-white border border-slate-200 text-slate-500 text-[9px] sm:text-[10px] font-bold tracking-[0.2em] uppercase py-0.5 sm:py-1 rounded-full">
                        Akses Cepat
                    </span>
                </div>
            </div>

            {/* Professional Google Button */}
            <div className="group cursor-pointer" onClick={() => onClick("google")}>
                <div className="bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-400 rounded-xl sm:rounded-2xl p-3 sm:p-4 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 sm:space-x-4">
                            <div className="bg-white p-1.5 sm:p-2 rounded-lg sm:rounded-xl shadow-md border border-slate-100">
                                <FcGoogle className="h-5 w-5 sm:h-6 sm:w-6" />
                            </div>
                            <div className="text-left">
                                <p className="text-slate-900 font-semibold text-xs sm:text-sm">Google Workspace</p>
                                <p className="text-slate-500 text-[10px] sm:text-xs">Login perusahaan yang aman</p>
                            </div>
                        </div>
                        <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-600 transition-colors duration-300" />
                    </div>
                </div>
            </div>
        </div>
    );
};