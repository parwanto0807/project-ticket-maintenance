"use client";

import * as z from "zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateTicketMaintenanceSchema } from "@/schemas";
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
import { toast } from "sonner";
import { useTransition } from "react";
import { createTicket } from "@/action/maintenance/ticket";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { AssetStatus, AssetType, Department, Product } from "@prisma/client";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
    FaTicketAlt,
    FaUser,
    FaBuilding,
    FaTools,
    FaExclamationTriangle,
    FaCalendar,
    FaImage,
    FaArrowLeft,
    FaPaperPlane,
    FaCog,
    FaMobile,
    FaDesktop,
    FaChevronRight
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Asset {
    id: string;
    countNumber: number;
    assetNumber: string;
    status: AssetStatus;
    location: string | null;
    purchaseDate: Date | null;
    purchaseCost: number | null;
    residualValue: number | null;
    usefulLife: number | null;
    createdAt: Date;
    updatedAt: Date;
    assetTypeId: string;
    assetType: AssetType;
    departmentId: string;
    assetImage1: string | null;
    productId: string;
    employeeId: string | null;
    product: Product | null;
    employee: Employee | null;
    department: Department | null;
}

type Employee = {
    id: string;
    name: string;
    email: string;
    address: string;
    picture: string;
    signInvoice: boolean;
    userDept: string;
    createdAt: Date;
    updatedAt: Date;
    department?: {
        id: string;
        dept_name: string;
    };
};

async function resizeImage(file: File, maxWidth: number, maxHeight: number): Promise<File> {
    return new Promise((resolve, reject) => {
        const img = document.createElement('img');
        img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            if (!ctx) {
                reject(new Error("Canvas context not available"));
                return;
            }
            let { width, height } = img;
            const aspectRatio = width / height;
            if (width > maxWidth) {
                width = maxWidth;
                height = Math.round(width / aspectRatio);
            }
            if (height > maxHeight) {
                height = maxHeight;
                width = Math.round(height * aspectRatio);
            }
            canvas.width = width;
            canvas.height = height;
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";
            ctx.drawImage(img, 0, 0, width, height);
            canvas.toBlob((blob) => {
                if (blob) {
                    const resizedFile = new File([blob], file.name, {
                        type: "image/jpeg",
                        lastModified: new Date().getTime()
                    });
                    resolve(resizedFile);
                } else {
                    reject(new Error("Failed to create blob"));
                }
            }, "image/jpeg", 0.85);
        };
        img.onerror = () => reject(new Error("Failed to load image"));
        const objectUrl = URL.createObjectURL(file);
        img.src = objectUrl;
        img.onload = () => {
            URL.revokeObjectURL(objectUrl);
        };
    });
}

const CreateTicketForm = ({ assetFind, employeeDataFind }: { assetFind: Asset[]; employeeDataFind: Employee[] }) => {
    const [isPending, startTransition] = useTransition();
    const [loading, setLoading] = useState(false);
    const [ticketNumber, setTicketNumber] = useState("");
    const [selectedDepartmentName, setSelectedDepartmentName] = useState<{ dept_name: string } | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const router = useRouter();
    const user = useCurrentUser();
    const userTicket = user?.email;

    const userDept = employeeDataFind?.filter((emp) => emp.email === userTicket);
    const departmentId = userDept?.[0]?.department?.id;
    const departmentEmployees = employeeDataFind?.filter((emp) => emp.department?.id === departmentId);
    const departmentByAsset = assetFind?.filter((ass) => ass.departmentId === departmentId);

    const [ticketImage1, setTicketImage1] = useState<File | null>(null);
    const [previewImage1, setPreviewImage1] = useState<string>("");

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const form = useForm<z.infer<typeof CreateTicketMaintenanceSchema>>({
        resolver: zodResolver(CreateTicketMaintenanceSchema),
        defaultValues: {
            troubleUser: "",
            analisaDescription: "",
            actionDescription: "",
            priorityStatus: "Low",
            status: "Pending",
            createdAt: new Date(),
            updatedAt: new Date(),
            scheduledDate: undefined,
            completedDate: undefined,
            employeeId: "",
            assetId: "",
            ticketNumber: "",
            countNumber: 0,
        },
    });

    useEffect(() => {
        const fetchTicketNumber = async () => {
            try {
                setLoading(true);
                const res = await fetch("/api/generateTicketNumber");
                const data = await res.json();
                if (data.ticketNumber && data.countNumber !== undefined) {
                    setTicketNumber(data.ticketNumber);
                    form.setValue("ticketNumber", data.ticketNumber, { shouldValidate: true });
                    form.setValue("countNumber", data.countNumber, { shouldValidate: true });
                }
            } catch (error) {
                console.error("Error fetching ticket number:", error);
                toast.error("Failed to generate ticket number");
            } finally {
                setLoading(false);
            }
        };
        fetchTicketNumber();
    }, [form]);

    const handleSelectEmployee = (employeeId: string) => {
        form.setValue("employeeId", employeeId);
        const selectedEmployee = employeeDataFind?.find((emp) => emp.id === employeeId);
        if (selectedEmployee?.department) {
            setSelectedDepartmentName({ dept_name: selectedEmployee.department.dept_name });
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setUploadProgress(0);
            const file = e.target.files[0];
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return 90;
                    }
                    return prev + 10;
                });
            }, 100);
            try {
                let finalFile = file;
                if (file.size > 1048576) {
                    finalFile = await resizeImage(file, 1200, 1200);
                }
                setTicketImage1(finalFile);
                setPreviewImage1(URL.createObjectURL(finalFile));
                setUploadProgress(100);
                setTimeout(() => setUploadProgress(0), 1000);
            } catch (error) {
                console.error("Error processing image:", error);
                toast.error("Failed to process image");
                setUploadProgress(0);
            } finally {
                clearInterval(progressInterval);
            }
        }
    };

    const onSubmit = (values: z.infer<typeof CreateTicketMaintenanceSchema>) => {
        setLoading(true);
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                if (value instanceof Date) {
                    formData.append(key, value.toISOString());
                } else {
                    formData.append(key, value.toString());
                }
            }
        });
        if (ticketImage1) {
            formData.append("ticketImage1", ticketImage1);
        }
        startTransition(() => {
            createTicket(formData)
                .then((data) => {
                    if (data?.error) {
                        toast.error(data.error);
                    }
                    if (data?.success) {
                        toast.success("🎉 Ticket created successfully!");
                        setTimeout(() => {
                            router.push("/dashboard/maintenance/ticket");
                        }, 1500);
                    }
                })
                .catch((error) => {
                    console.error("Submission error:", error);
                    toast.error("Failed to create ticket");
                })
                .finally(() => setLoading(false));
        });
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const itemVariants = {
        hidden: { y: 10, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 120,
                damping: 20
            }
        }
    };

    return (
        <div className="bg-gradient-to-br from-slate-50 via-orange-50/30 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 min-h-screen">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-xl mx-auto pb-24"
            >
                {/* Visual Header */}
                <div className="relative px-4 pt-4 pb-6 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-grid-slate-100/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))] dark:bg-grid-slate-800/20" />

                    <div className="relative flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                                <FaTicketAlt className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-[14px] md:text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
                                    Register Ticket
                                </h1>
                                <p className="text-[9px] md:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                    Maintenance Management
                                </p>
                            </div>
                        </div>
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase">System Ready</span>
                        </div>
                    </div>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="px-3">
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="space-y-3"
                        >
                            {/* Section: Basic Info */}
                            <motion.div variants={itemVariants} className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-xl shadow-slate-200/20 dark:shadow-black/20">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-1 h-3 bg-orange-500 rounded-full" />
                                    <h2 className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest">Informasi Utama</h2>
                                </div>

                                <div className="space-y-4">
                                    {/* Ticket Number */}
                                    <FormField
                                        control={form.control}
                                        name="ticketNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2 text-[9px] md:text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                                    <FaTicketAlt className="w-2.5 h-2.5 text-orange-500" />
                                                    Nomor Tiket
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input
                                                            {...field}
                                                            value={ticketNumber}
                                                            disabled
                                                            className="text-[10px] md:text-xs font-black h-11 bg-orange-50/30 border-orange-100 dark:bg-orange-500/5 dark:border-orange-500/20 text-orange-700 dark:text-orange-400 tracking-wider shadow-inner"
                                                        />
                                                        {loading && (
                                                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-orange-600" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="employeeId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="flex items-center gap-2 text-[9px] md:text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                                        <FaUser className="w-2.5 h-2.5 text-blue-500" />
                                                        Pengguna Aset
                                                    </FormLabel>
                                                    <Select
                                                        value={field.value}
                                                        onValueChange={(value) => {
                                                            field.onChange(value);
                                                            handleSelectEmployee(value);
                                                        }}
                                                        disabled={isPending}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className="h-11 text-[10px] md:text-xs font-bold border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50">
                                                                <SelectValue placeholder="Pilih pengguna" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {departmentEmployees?.map((data) => (
                                                                <SelectItem key={data.id} value={data.id} className="text-[10px] md:text-xs font-medium">
                                                                    {data.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage className="text-[8px] font-semibold" />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="space-y-1.5">
                                            <p className="flex items-center gap-2 text-[9px] md:text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                                <FaBuilding className="w-2.5 h-2.5 text-purple-500" />
                                                Departemen
                                            </p>
                                            <div className="h-11 flex items-center px-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-100 dark:border-slate-800">
                                                <p className="text-[10px] md:text-xs font-black text-slate-700 dark:text-slate-300">
                                                    {selectedDepartmentName?.dept_name || "---"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Section: Asset detail */}
                            <motion.div variants={itemVariants} className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-xl shadow-slate-200/20 dark:shadow-black/20">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-1 h-3 bg-blue-500 rounded-full" />
                                    <h2 className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest">Detail Perangkat</h2>
                                </div>

                                <div className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="assetId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2 text-[9px] md:text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                                    <FaCog className="w-2.5 h-2.5 text-blue-500" />
                                                    Nama Aset
                                                </FormLabel>
                                                <Select
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                    disabled={isPending}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="h-11 text-[10px] md:text-xs font-bold border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50">
                                                            <SelectValue placeholder="Pilih perangkat bermasalah" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {departmentByAsset?.map((data) => (
                                                            <SelectItem key={data.id} value={data.id} className="text-[10px] md:text-xs py-2">
                                                                <div className="flex flex-col gap-0.5">
                                                                    <span className="font-black text-slate-800 dark:text-slate-200 uppercase tracking-tight">{data.product?.part_name}</span>
                                                                    <span className="text-[9px] font-medium text-slate-500 flex items-center gap-1">
                                                                        {data.assetNumber} • {data.location || "No Location"}
                                                                    </span>
                                                                </div>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage className="text-[8px] font-semibold" />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="troubleUser"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2 text-[9px] md:text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                                    <FaTools className="w-2.5 h-2.5 text-red-500" />
                                                    Detail Masalah
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        {...field}
                                                        placeholder="Jelaskan kendala perangkat secara detail..."
                                                        disabled={isPending}
                                                        className="min-h-[90px] text-[10px] md:text-xs font-medium border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 py-3 leading-relaxed focus-visible:ring-orange-500/30"
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-[8px] font-semibold" />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </motion.div>

                            {/* Section: Priority & Image */}
                            <motion.div variants={itemVariants} className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-xl shadow-slate-200/20 dark:shadow-black/20">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-1 h-3 bg-red-500 rounded-full" />
                                    <h2 className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest">Prioritas & Bukti</h2>
                                </div>

                                <div className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="priorityStatus"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2 text-[9px] md:text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                                    <FaExclamationTriangle className="w-2.5 h-2.5 text-amber-500" />
                                                    Tingkat Urgensi
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="flex flex-wrap gap-2">
                                                        {["Low", "Medium", "High", "Critical"].map((p) => (
                                                            <button
                                                                key={p}
                                                                type="button"
                                                                onClick={() => field.onChange(p)}
                                                                className={cn(
                                                                    "flex-1 min-w-[70px] py-2.5 rounded-lg text-[9px] font-black uppercase tracking-tighter transition-all transition-transform duration-200 active:scale-95",
                                                                    field.value === p
                                                                        ? (p === "Critical" ? "bg-red-600 text-white shadow-lg ring-2 ring-red-500/20" :
                                                                            p === "High" ? "bg-orange-500 text-white shadow-lg ring-2 ring-orange-500/20" :
                                                                                p === "Medium" ? "bg-amber-500 text-white shadow-lg ring-2 ring-amber-500/20" :
                                                                                    "bg-green-600 text-white shadow-lg ring-2 ring-green-500/20")
                                                                        : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                                                                )}
                                                            >
                                                                {p === "Low" ? "🟢 Low" : p === "Medium" ? "🟡 Med" : p === "High" ? "🟠 High" : "🔴 Crit"}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <div className="pt-2">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="flex items-center gap-2 text-[9px] md:text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                                <FaImage className="w-2.5 h-2.5 text-purple-500" />
                                                Bukti Foto
                                            </p>
                                            <div className="flex items-center gap-2">
                                                {isMobile ? <FaMobile className="w-2.5 h-2.5 text-blue-500/50" /> : <FaDesktop className="w-2.5 h-2.5 text-slate-400/50" />}
                                                <span className="text-[8px] font-bold text-slate-400 uppercase">Native Mode</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <label
                                                htmlFor="ticketImage1"
                                                className="group relative flex flex-col items-center justify-center h-28 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-950/50 hover:bg-orange-50/50 dark:hover:bg-orange-500/5 transition-all text-center cursor-pointer overflow-hidden p-2"
                                            >
                                                {!previewImage1 ? (
                                                    <>
                                                        <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm mb-2 group-hover:scale-110 transition-transform">
                                                            <FaImage className="w-3.5 h-3.5 text-slate-400 group-hover:text-orange-500" />
                                                        </div>
                                                        <span className="text-[9px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-tighter">Tap to Upload</span>
                                                        <span className="text-[7px] font-medium text-slate-400 dark:text-slate-500 mt-0.5 mt-1">PNG, JPG (Max 1MB)</span>
                                                    </>
                                                ) : (
                                                    <div className="relative w-full h-full">
                                                        <Image
                                                            src={previewImage1}
                                                            alt="Preview"
                                                            fill
                                                            className="object-cover rounded-xl"
                                                        />
                                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <span className="text-[8px] font-black text-white uppercase tracking-widest bg-orange-600 px-2 py-1 rounded-full shadow-lg">Change</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </label>
                                            <input
                                                id="ticketImage1"
                                                type="file"
                                                accept="image/*"
                                                {...(isMobile ? { capture: "environment" } : {})}
                                                onChange={handleImageUpload}
                                                className="hidden"
                                            />

                                            {previewImage1 && (
                                                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                                                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 shadow-sm relative shrink-0">
                                                        <Image src={previewImage1} alt="Thumbnail" fill className="object-cover" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-[9px] font-black text-slate-700 dark:text-slate-200 truncate uppercase mt-0.5">Asset_Proof.jpg</p>
                                                        <p className="text-[8px] font-bold text-green-600 uppercase flex items-center gap-1">
                                                            <div className="w-1 h-1 bg-green-500 rounded-full" /> Checked
                                                        </p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setPreviewImage1("");
                                                            setTicketImage1(null);
                                                        }}
                                                        className="w-6 h-6 rounded-full bg-red-50 dark:bg-red-500/10 text-red-500 flex items-center justify-center active:scale-90 transition-transform"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        <AnimatePresence>
                                            {uploadProgress > 0 && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="mt-3 space-y-1.5"
                                                >
                                                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1">
                                                        <motion.div
                                                            className="bg-orange-500 h-1 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.4)]"
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${uploadProgress}%` }}
                                                        />
                                                    </div>
                                                    <div className="flex justify-between items-center text-[7px] font-black text-slate-500 uppercase tracking-widest">
                                                        <span>Uploading File</span>
                                                        <span>{uploadProgress}%</span>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Sticky Header-like Footer for Action */}
                        <div className={cn(
                            "fixed bottom-0 left-0 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200/60 dark:border-slate-800/60 p-4 z-50",
                            user?.role === "USER" ? "pb-[80px] md:pb-6" : "pb-6"
                        )}>
                            <div className="max-w-xl mx-auto flex gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.push("/dashboard/maintenance/ticket")}
                                    className="flex-1 h-11 border-slate-200 dark:border-slate-800 rounded-xl text-[10px] font-black uppercase tracking-tight hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95"
                                    disabled={loading}
                                >
                                    <FaArrowLeft className="w-2.5 h-2.5 mr-2" />
                                    Back
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={loading || isPending}
                                    className="flex-[2] h-11 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-orange-500/30 transition-all active:scale-95 disabled:grayscale"
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white" />
                                            Proses...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <FaPaperPlane className="w-2.5 h-2.5" />
                                            Submit Ticket
                                            <FaChevronRight className="w-2 h-2 ml-1 opacity-50" />
                                        </div>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </form>
                </Form>
            </motion.div>
        </div>
    );
};

export default CreateTicketForm;