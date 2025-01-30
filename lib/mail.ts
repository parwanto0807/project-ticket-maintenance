import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendTwoFactorTokenEmail = async (
    email: string,
    token: string
) => {
    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "2FA Code",
        html: `<p>Your 2FA Code: ${token}</p>`
    });
};

export const sendPasswordResetEmail = async (
    email: string,
    token: string 
) => {
    const resetLink = `https://solusiit.id/auth/new-password?token=${token}`;
    //const resetLink = `http://77.37.44.232:3000/auth/new-password?token=${token}`;
    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Reset your password",
        html:`<p>Click <a href="${resetLink}">here</a> to reset password.</p>`
    });
}

export const sendVerificationEmail = async (
    email: string,
    token: string 
) => {
     const confirmLink = `https://solusiit.id/auth/new-verification?token=${token}`;
    //const confirmLink = `http://77.37.44.232:3000/auth/new-verification?token=${token}`;
    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Confirm your email",
        html:`<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`
    });
}