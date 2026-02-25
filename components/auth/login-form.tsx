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
import { Eye, EyeOff, Mail, Lock, Key, Wrench } from "lucide-react";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";

import { useTranslation } from "@/hooks/use-translation";
import { TranslationKeys } from "@/lib/translations";

const font = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800", "900"],
});

const LoginForm = () => {
    const { t } = useTranslation();
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
        <div className="w-full max-w-[95vw] sm:max-w-md mx-auto flex items-center justify-center min-h-[70vh] sm:min-h-[80vh] py-4 sm:py-8">
            <CardWrapper
                headerLabel={t("login_welcome")}
                showSocial
            >
                {/* Custom Header */}
                <div className="text-center space-y-1 sm:space-y-6 mb-3 sm:mb-8">
                    <div className="flex justify-center">
                        <div className="p-2 sm:p-3 bg-blue-50/50 rounded-2xl border border-blue-100 shadow-sm">
                            <Wrench className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                        </div>
                    </div>
                    <div className="space-y-0.5 sm:space-y-2">
                        <h1 className={cn(
                            "text-3xl sm:text-5xl font-black bg-gradient-to-r from-blue-950 via-blue-800 to-blue-600 bg-clip-text text-transparent tracking-tighter antialiased drop-shadow-sm",
                            font.className
                        )}>
                            AxonService
                        </h1>
                        <p className="text-slate-600 font-semibold text-xs sm:text-base tracking-tight">
                            {t("app_subtitle")}
                        </p>
                        <p className="text-slate-400 text-[10px] sm:text-sm font-medium">
                            {t("login_access_desc")}
                        </p>
                    </div>
                </div>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-3 sm:space-y-6"
                    >
                        <div className="space-y-3 sm:space-y-5">
                            {showTwoFactor ? (
                                <div className="space-y-3 sm:space-y-5">
                                    <div className="flex justify-center mb-2 sm:mb-6">
                                        <div className="p-2 bg-purple-100 rounded-xl border border-purple-200 shadow-sm">
                                            <Key className="w-4 h-4 sm:w-6 sm:h-6 text-purple-600" />
                                        </div>
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="code"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1 sm:space-y-2">
                                                <FormLabel className="text-slate-700 font-semibold text-xs sm:text-base">
                                                    {t("two_factor_code")}
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input
                                                            {...field}
                                                            disabled={isPending}
                                                            placeholder="123456"
                                                            className="bg-slate-50 border-slate-200 h-10 sm:h-14 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all duration-300 pl-8 sm:pl-10 pr-4 text-sm font-medium rounded-xl shadow-sm"
                                                        />
                                                        <Key className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-blue-600" />
                                                    </div>
                                                </FormControl>
                                                <FormMessage className="text-red-600 font-medium text-[10px] sm:text-sm" />
                                            </FormItem>
                                        )}
                                    />
                                    <p className="text-slate-500 text-center font-medium text-[10px] sm:text-sm">
                                        {t("enter_verification")}
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1 sm:space-y-2">
                                                <FormLabel className="text-slate-700 font-semibold text-xs sm:text-base">
                                                    Email
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input
                                                            {...field}
                                                            disabled={isPending}
                                                            placeholder="admin@axonservice.com"
                                                            type="email"
                                                            className="bg-slate-50 border-slate-200 h-10 sm:h-14 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all duration-300 pl-8 sm:pl-10 pr-4 text-sm font-medium rounded-xl shadow-sm"
                                                        />
                                                        <Mail className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-blue-600" />
                                                    </div>
                                                </FormControl>
                                                <FormMessage className="text-red-600 font-medium text-[10px] sm:text-sm" />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1 sm:space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <FormLabel className="text-slate-700 font-semibold text-xs sm:text-base">
                                                        {t("password_label")}
                                                    </FormLabel>
                                                </div>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input
                                                            {...field}
                                                            disabled={isPending}
                                                            placeholder={t("password_placeholder") as string}
                                                            type={showPassword ? "text" : "password"}
                                                            className="bg-slate-50 border-slate-200 h-10 sm:h-14 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all duration-300 pl-8 sm:pl-10 pr-9 text-sm font-medium rounded-xl shadow-sm"
                                                        />
                                                        <Lock className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-blue-600" />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors p-1"
                                                        >
                                                            {showPassword ?
                                                                <EyeOff className="w-3.5 h-3.5" /> :
                                                                <Eye className="w-3.5 h-3.5" />
                                                            }
                                                        </button>
                                                    </div>
                                                </FormControl>
                                                <FormMessage className="text-red-600 font-medium text-[10px] sm:text-sm" />
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
                            className="w-full h-11 sm:h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-blue-500/10 border-0 font-bold text-sm sm:text-base"
                        >
                            {isPending ? (
                                <div className="flex items-center space-x-2">
                                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span className="text-xs">{t("processing")}</span>
                                </div>
                            ) : showTwoFactor ? (
                                t("verify_and_continue")
                            ) : (
                                t("login_to_dashboard")
                            )}
                        </Button>
                        {!showTwoFactor && (
                            <div className="mt-2 text-center text-[10px] sm:text-xs text-slate-500 font-medium">
                                {t("no_account")}{" "}
                                <a
                                    href="/auth/login-admin"
                                    className="text-blue-500 hover:text-blue-400 font-bold transition-colors"
                                >
                                    {t("register_now")}
                                </a>
                            </div>
                        )}
                        {!showTwoFactor && (
                            <div className="text-center pt-1.5 sm:pt-4">
                                <p className="text-slate-600 font-bold text-[9px] sm:text-xs uppercase tracking-[0.15em]">
                                    {t("encrypted_access")}
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