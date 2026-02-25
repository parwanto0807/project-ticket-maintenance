"use client";

import * as z from "zod";
import { useState, useTransition } from "react";
import { CardWrapper } from "./card-wrapper"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchemaEmail } from "@/schemas";
import { useTranslation } from "@/hooks/use-translation";
import { TranslationKeys } from "@/lib/translations";


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
import { registerEmail } from "@/action/auth/register";

const RegisterForm = () => {
    const { t } = useTranslation();
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof RegisterSchemaEmail>>({
        resolver: zodResolver(RegisterSchemaEmail),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = (values: z.infer<typeof RegisterSchemaEmail>) => {
        setError("");
        setSuccess("");

        startTransition(() => {
            registerEmail(values)
                .then((data) => {
                    setError(data.error);
                    setSuccess(data.success);
                });
        });
    }



    return (
        <CardWrapper
            headerLabel={t("create_new_account")}
            backButtonLabel={t("back_to_login")}
            backButtonHref="/auth/login"
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4 sm:space-y-6"
                >
                    <div className="space-y-3 sm:space-y-4">
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
                                            placeholder="admin@example.com"
                                            type="email"
                                            className="bg-slate-50 border-slate-200 h-10 sm:h-14 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all duration-300 px-4 text-sm font-medium rounded-xl shadow-sm"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-600 font-medium text-[10px] sm:text-sm" />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormError message={error} />
                    <FormSuccess message={success} />
                    <Button
                        disabled={isPending}
                        type="submit"
                        className="w-full h-11 sm:h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-blue-500/10 border-0 font-bold text-sm sm:text-base"
                    >
                        {isPending ? t("processing") : t("register_account")}
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}

export default RegisterForm;