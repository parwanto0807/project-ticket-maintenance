"use client";

import * as z from "zod";
import { useState, useTransition } from "react";
import { CardWrapper } from "./card-wrapper";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/schemas";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "../../../project-ticket-maintenance/components/form-error";
import { FormSuccess } from "../../../project-ticket-maintenance/components/form-success";
import { login } from "@/action/auth/login";
import { Eye, EyeOff, Mail, Lock, Key } from "lucide-react";

const LoginForm = () => {
    const searchParams = useSearchParams();
    const urlError = searchParams.get("error") === "OAuthAccountNotLinked"
        ? "Email already in use with different provider!"
        : "";
    const [showTwoFactor, setShowTwoFactor] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        setError("");
        setSuccess("");

        startTransition(() => {
            login(values)
                .then((data) => {
                    if (data?.error) {
                        form.reset();
                        setError(data.error);
                    }
                    if (data?.success) {
                        form.reset();
                        setSuccess(data.success);
                    }
                    if (data?.twoFactor) {
                        setShowTwoFactor(true);
                    }
                })
                .catch(() => setError("Something went wrong"));
        });
    };

    return (
        <div className="w-full max-w-[90vw] sm:max-w-md mx-auto md:p-2 flex items-center justify-center min-h-[80vh]">
            <CardWrapper
                headerLabel="Welcome to AssetFlow"
                showSocial
            >
                {/* Custom Header */}
                <div className="text-center space-y-2 sm:space-y-6 mb-4 sm:mb-8">
                    <div className="flex justify-center">
                        {/* <div className="p-2 sm:p-3 bg-green-500/40 rounded-lg sm:rounded-xl backdrop-blur-sm border border-green-400 shadow-lg">
                            <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-green-200" />
                        </div> */}
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                            AssetFlow
                        </h1>
                        <p className="text-blue-100 font-medium text-sm sm:text-base">
                            Maintenance & Asset Management
                        </p>
                        <p className="text-blue-200 text-xs sm:text-sm">
                            Secure access to your dashboard
                        </p>
                    </div>
                </div>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 sm:space-y-6"
                    >
                        <div className="space-y-4 sm:space-y-5">
                            {showTwoFactor ? (
                                <div className="space-y-4 sm:space-y-5">
                                    <div className="flex justify-center mb-4 sm:mb-6">
                                        <div className="p-2 sm:p-3 bg-purple-500/40 rounded-lg sm:rounded-xl border border-purple-400 shadow-md">
                                            <Key className="w-5 h-5 sm:w-6 sm:h-6 text-purple-200" />
                                        </div>
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="code"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-white font-semibold text-sm sm:text-base">
                                                    Two-Factor Code
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input
                                                            {...field}
                                                            disabled={isPending}
                                                            placeholder="123456"
                                                            className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all duration-300 pl-9 sm:pl-10 pr-4 py-3 sm:py-4 text-base font-medium rounded-lg"
                                                        />
                                                        <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-300" />
                                                    </div>
                                                </FormControl>
                                                <FormMessage className="text-red-300 font-medium text-xs sm:text-sm" />
                                            </FormItem>
                                        )}
                                    />
                                    <p className="text-blue-100 text-center font-medium text-xs sm:text-sm">
                                        Enter verification code from your authenticator app
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-white font-semibold text-sm sm:text-base">
                                                    Email
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input
                                                            {...field}
                                                            disabled={isPending}
                                                            placeholder="admin@assetflow.com"
                                                            type="email"
                                                            className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all duration-300 pl-9 sm:pl-10 pr-4 py-3 sm:py-4 text-sm font-medium rounded-lg"
                                                        />
                                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-300" />
                                                    </div>
                                                </FormControl>
                                                <FormMessage className="text-red-300 font-medium text-xs sm:text-sm" />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-white font-semibold text-sm sm:text-base">
                                                    Password
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input
                                                            {...field}
                                                            disabled={isPending}
                                                            placeholder="Enter your password"
                                                            type={showPassword ? "text" : "password"}
                                                            className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all duration-300 pl-9 sm:pl-10 pr-9 sm:pr-10 py-3 sm:py-4 text-sm font-medium rounded-lg"
                                                        />
                                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-300" />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300 hover:text-blue-200 transition-colors p-1"
                                                        >
                                                            {showPassword ?
                                                                <EyeOff className="w-4 h-4" /> :
                                                                <Eye className="w-4 h-4" />
                                                            }
                                                        </button>
                                                    </div>
                                                </FormControl>
                                                <FormMessage className="text-red-300 font-medium text-xs sm:text-sm" />
                                            </FormItem>
                                        )}
                                    />
                                </>
                            )}
                        </div>

                        <FormError message={error || urlError} />
                        <FormSuccess message={success} />

                        <Button
                            disabled={isPending}
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-3 sm:py-4 rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-blue-500/30 border-0 font-bold text-sm sm:text-base"
                        >
                            {isPending ? (
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span className="text-sm">Signing in...</span>
                                </div>
                            ) : showTwoFactor ? (
                                "Verify & Continue"
                            ) : (
                                "Sign In to Dashboard"
                            )}
                        </Button>
                        {!showTwoFactor && (
                            <div className="mt-3 sm:mt-4 text-center text-xs">
                                Don&apos;t have an account?{" "}
                                <a
                                    href="/auth/login-admin"
                                    className="text-primary hover:underline transition-colors"
                                >
                                    Sign up
                                </a>
                            </div>
                        )}
                        {!showTwoFactor && (
                            <div className="text-center pt-2 sm:pt-3">
                                <p className="text-blue-100 font-medium text-xs sm:text-sm">
                                    Manage your maintenance operations securely
                                </p>
                            </div>
                        )}
                    </form>
                </Form>
            </CardWrapper>
        </div>
    )
}

export default LoginForm;