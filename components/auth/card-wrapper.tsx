"use client"

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader
} from "@/components/ui/card";

import { Header } from "./header";
import { Social } from "@/components/auth/social";
import { BackButton } from "@/components/auth/back-button";
// import { LogoutButton } from "../auth/logout-button";

interface CardWrapperProps {
    children: React.ReactNode;
    headerLabel: string;
    backButtonLabel?: string;
    backButtonHref?: string;
    showSocial?: boolean;
};

export const CardWrapper = ({
    children,
    headerLabel,
    backButtonLabel = "",
    backButtonHref = "/auth-login",
    showSocial,
}: CardWrapperProps) => {
    return (
        <Card className="w-[400px] shadow-md">
            <CardHeader>
                <Header label={headerLabel} />
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
            {showSocial && (
                <CardFooter>
                    <Social />
                </CardFooter>
            )}
            <CardFooter>
                {/* <LogoutButton> */}
                <BackButton
                    label={backButtonLabel}
                    href={backButtonHref}
                />
                {/* </LogoutButton> */}
            </CardFooter>
        </Card>
    )
}