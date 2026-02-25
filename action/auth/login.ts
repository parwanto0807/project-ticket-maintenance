"use server";

import * as z from "zod";
import { AuthError } from "next-auth";
import { db } from "@/lib/db";
import { signIn } from "@/auth";
import { LoginSchema } from "@/schemas";
import { getUserByEmail, getEmailMaster } from "@/data/auth/user";
import { getTwoFactorTokenByEmail } from "@/data/auth/two-factor-token";
import {
    sendVerificationEmail,
    sendTwoFactorTokenEmail,
} from "@/lib/mail";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import {
    generateVerificationToken,
    generateTwoFactorToken
} from "@/lib/token";
import { getTwoFactorConfirmationByUserId } from "@/data/auth/two-factor-confirmation";

//Proses validasi dan Authentikasi pengguna 
export const login = async (values: z.infer<typeof LoginSchema>) => { //validasi data dari LoginSchema
    const validatedFields = LoginSchema.safeParse(values); //hasil validasi disimpan di validatedFileds

    //jika validasi gagal makan muncul pesan "invalid field"
    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    };

    //Jika validasi data dari zod benar, maka system akan mencari data email di database di folder /data
    const { email, password, code } = validatedFields.data;
    const existingUser = await getUserByEmail(email);

    // Jika pengguna tidak ditemukan (!existingUser) atau jika email atau password pengguna 
    // tidak terdefinisi (!existingUser.email atau !existingUser.password), 
    // maka pengguna dianggap tidak ada atau informasi yang sesuai tidak ditemukan. 
    // Dalam kasus ini, kode mengembalikan { error: "Email does not exist!" }, 
    // yang menunjukkan bahwa email yang dimasukkan tidak terdaftar dalam sistem.
    // Check if email exists in Master (Employee or Technician)
    const existingEmail = await getEmailMaster(email);
    if (!existingEmail) {
        return { error: "Email anda belum terdaftar, silahkan Hubungi Admin IT" };
    }

    if (!existingUser || !existingUser.email || !existingUser.password) {
        return { error: "Email does not exist!" }
    };

    // Jika pengguna ditemukan dan properti emailVerified dari existingUser adalah false(!existingUser.emailVerified),
    // maka langkah - langkah berikut dilakukan:
    // Menghasilkan token verifikasi baru menggunakan generateVerificationToken(existingUser.email).
    // Mengirim email verifikasi kepada pengguna menggunakan sendVerificationEmail, 
    // dengan mengirimkan alamat email(verificationToken.email) dan token verifikasi(verificationToken.token).
    // Kode mengembalikan { success: "Confirmation email sent!" }, 
    // yang memberitahu pengguna bahwa email konfirmasi telah dikirimkan.
    if (!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(
            existingUser.email,
        );
        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token,
        );

        return { success: "Confirmation email sent!" }
    }
    // Kode memeriksa apakah existingUser memiliki fitur 2FA diaktifkan (existingUser.isTwoFactorEnabled === true) 
    // dan apakah alamat email pengguna (existingUser.email) terdefinisi. 
    // Ini menjamin bahwa proses 2FA hanya dilakukan untuk pengguna yang memenuhi kedua syarat ini.
    if (existingUser.isTwoFactorEnabled && existingUser.email) {
        // Jika code (kode 2FA yang dimasukkan oleh pengguna) terdefinisi, 
        // maka kode ini akan memulai proses verifikasi.
        if (code) {
            // //TODO: verify Code
            // getTwoFactorTokenByEmail(existingUser.email) 
            // digunakan untuk mendapatkan token 2FA yang terkait dengan alamat email pengguna.
            const twoFactorToken = await getTwoFactorTokenByEmail(
                existingUser.email
            );
            // Jika tidak ada twoFactorToken yang ditemukan, kode mengembalikan { error: "Invalid code!" }, 
            // yang menunjukkan bahwa kode 2FA yang dimasukkan tidak valid.
            if (!twoFactorToken) {
                return { error: "Invalid code!" };
            };
            // Jika token 2FA tidak sesuai dengan kode yang dimasukkan (twoFactorToken.token !== code), 
            // kode juga mengembalikan { error: "Invalid code!" }.
            if (twoFactorToken.token !== code) {
                return { error: "Invalid code!" };
            };
            // Kode juga memeriksa apakah token 2FA telah kadaluarsa (hasExpired). Jika ya, 
            // maka kode mengembalikan { error: "Code expired!" }.
            const hasExpired = new Date(twoFactorToken.expires) < new Date();
            if (hasExpired) {
                return { errpr: " Code expired!" }
            };
            // Jika kode 2FA valid, token 2FA yang digunakan dihapus dari database 
            // menggunakan db.twoFactorToken.delete({ where: { id: twoFactorToken.id } }).
            await db.twoFactorToken.delete({
                where: { id: twoFactorToken.id }
            });
            // Selanjutnya, kode memeriksa apakah ada konfirmasi 2FA sebelumnya untuk pengguna ini (existingConfirmation). 
            // Jika ada, konfirmasi 2FA sebelumnya dihapus dari database.
            const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);
            if (existingConfirmation) {
                await db.twoFactorConfirmation.delete({
                    where: { id: existingConfirmation.id }
                });
            };
            // Terakhir, kode membuat entri baru untuk konfirmasi 2FA dalam database 
            // menggunakan db.twoFactorConfirmation.create({ data: { userId: existingUser.id } })
            await db.twoFactorConfirmation.create({
                data: {
                    userId: existingUser.id,
                }
            });

            // Jika tidak ada code yang dimasukkan oleh pengguna (artinya pengguna memerlukan token 2FA baru), 
            // kode ini akan menghasilkan token 2FA baru menggunakan generateTwoFactorToken(existingUser.email).
            // Kemudian, kode mengirimkan email yang berisi token 2FA baru kepada pengguna 
            // menggunakan sendTwoFactorTokenEmail.
            // Kode mengembalikan { twoFactor: true }, yang menandakan bahwa proses 2FA sedang berlangsung 
            // dan pengguna perlu memasukkan kode 2FA yang baru dikirimkan.
        } else {
            const twoFactorToken = await generateTwoFactorToken(existingUser.email)
            await sendTwoFactorTokenEmail(
                twoFactorToken.email,
                twoFactorToken.token,
            );
            return { twoFactor: true }
        }
    }

    // Blok try digunakan untuk mengelilingi kode yang mungkin menghasilkan kesalahan. 
    // Dalam hal ini, signIn("credentials", { ... }) adalah operasi yang dijalankan. 
    // Fungsi signIn ini digunakan untuk melakukan proses autentikasi atau sign-in 
    // pengguna dengan menggunakan kredensial (email dan password) yang disediakan.
    // Jika tidak ada kesalahan yang terjadi dalam signIn, eksekusi akan melanjutkan setelah blok try.
    // Jika ada kesalahan yang terjadi, eksekusi langsung pindah ke blok catch.
    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: DEFAULT_LOGIN_REDIRECT,
        })
    } catch (error) {
        // Blok catch(error) menangkap kesalahan yang dilemparkan oleh signIn atau kesalahan apa pun yang terjadi selama eksekusi di dalam blok try.
        // Pertama, kode memeriksa apakah error yang terjadi adalah instance dari kelas AuthError menggunakan instanceof AuthError.
        // Jika error adalah instance dari AuthError, maka blok switch digunakan untuk menentukan jenis kesalahan yang terjadi (error.type).
        // Jika error.type adalah "CredentialsSignin", itu berarti kesalahan terjadi karena kredensial yang tidak valid (email atau password salah). 
        // Kode akan mengembalikan objek { error: "Invalid credentials!" }, yang memberi tahu pengguna bahwa kredensial yang dimasukkan tidak benar.
        // Jika jenis kesalahan lain terjadi yang tidak ditangani secara khusus dalam switch, maka kode akan mengembalikan { error: "Something went wrong!" }. 
        // Pesan ini memberi tahu pengguna bahwa terjadi kesalahan yang tidak terduga selama proses sign-in.
        // Jika kesalahan yang terjadi bukan instance dari AuthError, maka kesalahan tersebut dilemparkan kembali menggunakan throw error;, 
        // sehingga kesalahan dapat ditangani lebih lanjut atau dilaporkan ke sistem pelaporan kesalahan.
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials!" }
                default:
                    return { error: "Something went wrong!" }
            }
        }
        throw error;
    }
}