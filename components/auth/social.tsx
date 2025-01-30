"use client";
import React from "react";

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
// import { FaGithub } from "react-icons/fa";
import { Button } from "../ui/button";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

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
        <div className="flex items-center w-full gap-x-2">
            <Button
                size="lg"
                className="w-full"
                variant="outline"
                onClick={() => onClick("google")}>
                Login with
                <FcGoogle className="h-5 w-5 ml-2" />
            </Button>

            {/* <Button 
                size="lg"
                className="w-full"
                variant="outline"
                onClick={() => onClick("github")}>
                <FaGithub className="h-5 w-5"/>
            </Button> */}
        </div>
    );
};
