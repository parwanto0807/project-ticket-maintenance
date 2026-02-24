"use client";

import * as z from "zod";
import { useState, useTransition } from "react";
import { CardWrapper } from "./card-wrapper"
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
import { Input } from "../../../project-ticket-maintenance/components/ui/input";
import { Button } from "../../../project-ticket-maintenance/components/ui/button";
import { FormError } from "../../../project-ticket-maintenance/components/form-error";
import { FormSuccess } from "../../../project-ticket-maintenance/components/form-success";
import { loginAdmin } from "@/action/auth/login-admin";

const LoginAdminForm = () => {
    const searchParams = useSearchParams();
    const urlError = searchParams.get("error") === "OAuthAccountNotLinked"
        ? "Email already in use with diferrent provider!"
        : "";
    const [showTwofactor] = useState(false);
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
            loginAdmin(values)
                .then((data) => {
                    if (data?.error) {
                        form.reset();
                        setError(data.error);
                    }
                    // if (data?.success) {
                    //     form.reset();
                    //     setSuccess(data.success);
                    // }
                    // if (data?.twoFactor) {
                    //     setShowTwoFactor(true);
                    // }
                })
                .catch(() => setError("Something went wrong"));
        });
    };



    return (
        <CardWrapper
            headerLabel="Otorisasi Admin Luar"
            backButtonLabel="Kembali ke halaman masuk"
            backButtonHref="/auth/login"
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4 sm:space-y-6"
                >
                    <div className="space-y-3 sm:space-y-4">
                        {showTwofactor && (
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem className="space-y-1 sm:space-y-2">
                                        <FormLabel className="text-slate-700 font-semibold text-xs sm:text-base">Kode Otentikasi Dua Faktor</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={isPending}
                                                placeholder="123456"
                                                className="bg-slate-50 border-slate-200 h-10 sm:h-14 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all duration-300 px-4 text-sm font-medium rounded-xl shadow-sm"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-600 font-medium text-[10px] sm:text-sm" />
                                    </FormItem>
                                )}
                            />
                        )}
                        {!showTwofactor && (
                            <>
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1 sm:space-y-2">
                                            <FormLabel className="text-slate-700 font-semibold text-xs sm:text-base">Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    disabled={isPending}
                                                    placeholder="admin@email.com"
                                                    type="email"
                                                    className="bg-slate-50 border-slate-200 h-10 sm:h-14 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all duration-300 px-4 text-sm font-medium rounded-xl shadow-sm"
                                                />
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
                                            <FormLabel className="text-slate-700 font-semibold text-xs sm:text-base">Kata Sandi</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    disabled={isPending}
                                                    placeholder="Masukkan kata sandi"
                                                    type="password"
                                                    className="bg-slate-50 border-slate-200 h-10 sm:h-14 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all duration-300 px-4 text-sm font-medium rounded-xl shadow-sm"
                                                />
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
                        {isPending ? "Memproses..." : "Masuk sebagai Admin"}
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}

export default LoginAdminForm