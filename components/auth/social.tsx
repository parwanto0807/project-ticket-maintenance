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
                    <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center">
                    <span className="px-4 bg-slate-900 text-white/50 text-xs font-semibold tracking-wider uppercase py-1 rounded-full border border-white/10">
                        Quick Access
                    </span>
                </div>
            </div>

            {/* Professional Google Button */}
            <div className="group cursor-pointer" onClick={() => onClick("google")}>
                <div className="bg-gradient-to-r from-white/5 to-white/10 hover:from-white/10 hover:to-white/15 border border-white/15 hover:border-blue-400/30 rounded-xl p-4 transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-blue-500/10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="bg-white p-2 rounded-xl shadow-md">
                                <FcGoogle className="h-6 w-6" />
                            </div>
                            <div className="text-left">
                                <p className="text-white font-semibold text-sm">Google Workspace</p>
                                <p className="text-white/60 text-xs">Secure enterprise login</p>
                            </div>
                        </div>
                        <ExternalLink className="h-4 w-4 text-white/40 group-hover:text-blue-400 transition-colors duration-300" />
                    </div>
                </div>
            </div>

            {/* Security Badge */}
            <div className="flex items-center justify-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-lg py-2 px-3">
                <Shield className="h-3 w-3 text-blue-400" />
                <span className="text-blue-300 text-xs font-medium">SOC2 Compliant</span>
            </div>
        </div>
    );
};